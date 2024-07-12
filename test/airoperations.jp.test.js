import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import AirOperationsModel from "../src/model/AirOperationsModel"
import GlobalGameState from "../src/model/GlobalGameState"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves, doReturn1 } from "../src/controller/AirOperationsHandler"

describe("Air Operations tests with Preset air unit locations", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
    const kaf1 = counters.get("Kaga-A6M-2b-1")
    const kaf2 = counters.get("Kaga-A6M-2b-2")
    const kdb = counters.get("Kaga-D3A-1")
    const ktb = counters.get("Kaga-B5N-2")

    const aaf1 = counters.get("Akagi-A6M-2b-1")
    const aaf2 = counters.get("Akagi-A6M-2b-2")
    const adb = counters.get("Akagi-D3A-1")
    const atb = counters.get("Akagi-B5N-2")

    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")

    const saf1 = counters.get("Soryu-A6M-2b-1")
    const saf2 = counters.get("Soryu-A6M-2b-2")
    const sdb = counters.get("Soryu-D3A-1")
    const stb = counters.get("Soryu-B5N-2")

    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 1, kaf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, ktb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, adb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, atb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 0, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 1, kaf2)

    //  CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 1, saf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 0, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 1, saf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 1, stb)
  })

  test("Initiative Determination", () => {
    GlobalGameState.airOperationPoints.japan = 2
    GlobalGameState.airOperationPoints.us = 3

    let sideWithInitiative = controller.determineInitiative(1, 4)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    sideWithInitiative = controller.determineInitiative(4, 1)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)

    sideWithInitiative = controller.determineInitiative(3, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    GlobalGameState.airOperationPoints.japan = 2
    GlobalGameState.airOperationPoints.us = 2
    sideWithInitiative = controller.determineInitiative(3, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)

    sideWithInitiative = controller.determineInitiative(2, 2)
    expect(sideWithInitiative).toBeNull()

    GlobalGameState.airOperationPoints.japan = 0
    GlobalGameState.airOperationPoints.us = 2
    sideWithInitiative = controller.determineInitiative(5, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    GlobalGameState.airOperationPoints.japan = 1
    GlobalGameState.airOperationPoints.us = 0
    sideWithInitiative = controller.determineInitiative(5, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)
  })


  test("Japanese Carrier Status", () => {
    const carrier = controller.getJapanFleetUnit(GlobalUnitsModel.Carrier.AKAGI)
    expect(carrier.hits).toEqual(0)
    expect(carrier.isSunk).toEqual(false)

    const taskForce = controller.getTaskForceForCarrier(GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Side.JAPAN)
    expect(taskForce).toEqual(GlobalUnitsModel.TaskForce.CARRIER_DIV_1)

    const units = controller.getAllCarriersInTaskForce(taskForce, GlobalUnitsModel.Side.JAPAN)
    expect(units.length).toEqual(2)

    const otherCarrierinTF = controller.getOtherCarrierInTF(GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Side.JAPAN)
    expect(otherCarrierinTF.name).toEqual(GlobalUnitsModel.Carrier.KAGA)

    const model = new AirOperationsModel()
    let box = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, "Akagi", "FLIGHT")
    expect(Object.keys(box).length).toEqual(1)

    box = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, "Akagi", "HANGAR")
    expect(Object.keys(box).length).toEqual(1)

    const numUnitsOnCarrier = controller.numUnitsOnCarrier("Akagi", GlobalUnitsModel.Side.JAPAN)
    expect(numUnitsOnCarrier).toEqual(4)
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Unit", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    let destinations = controller.getValidAirUnitDestinations("Soryu-A6M-2b-1")

    let { carrier, box } = destinations[0]
    expect(destinations.length).toEqual(1)
    expect(carrier).toEqual("Soryu")
    expect(box).toEqual("HANGAR")

    const model = new AirOperationsModel()
    let boxName = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, carrier, box)

    // note we need to send the box object value not key
    const b = Object.values(boxName)[0]
    expect(Object.values(boxName).length).toEqual(1)

    const units = controller.getAllAirUnitsInBox(b)
    expect(units.length).toEqual(1)

    // Set Soryu to be sunk so air unit has to return to Hiryu if possible
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)
    expect(controller.isSunk(GlobalUnitsModel.Carrier.SORYU)).toEqual(true)

    doReturn1(controller, "Soryu-A6M-2b-1", GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations("Soryu-A6M-2b-1")

    expect(destinations.length).toEqual(1)
    expect(destinations[0].carrier).toEqual("Hiryu")
    expect(destinations[0].box).toEqual("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for Japan (Kaga) Air Unit when both carriers in CarDiv 1 are sunk", () => {
    const carriersInOtherTaskForce = controller.getCarriersInOtherTF(
      GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
      GlobalUnitsModel.Side.JAPAN
    )
    expect(carriersInOtherTaskForce.length).toEqual(2)
    expect(carriersInOtherTaskForce[0].name).toEqual(GlobalUnitsModel.Carrier.HIRYU)
    expect(carriersInOtherTaskForce[1].name).toEqual(GlobalUnitsModel.Carrier.SORYU)

    // Set Akagi and Kaga to be sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    doReturn1(controller, "Kaga-A6M-2b-1", GlobalUnitsModel.Side.JAPAN)
    const destinations = controller.getValidAirUnitDestinations("Kaga-A6M-2b-1")

    expect(destinations.length).toEqual(2)

    expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.HIRYU)
    expect(destinations[0].box).toBe("HANGAR")
    expect(destinations[1].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
    expect(destinations[1].box).toBe("HANGAR")
  })
})

describe("Air Operations tests with air unit locations set in tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })
  test("Create Lists of Valid Destination Boxes for Japan Air Unit when carrier at capacity", () => {
    // Put 5 aircraft units on the flight deck and hangar of Kaga
    const kaf1 = counters.get("Kaga-A6M-2b-1")
    const kaf2 = counters.get("Kaga-A6M-2b-2")
    const kdb = counters.get("Kaga-D3A-1")
    const ktb = counters.get("Kaga-B5N-2")
    const aaf1 = counters.get("Akagi-A6M-2b-1")
    const aaf2 = counters.get("Akagi-A6M-2b-2")


    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, kaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 1, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 2, aaf2)

    const isHangarAvailable = controller.isHangarAvailable(GlobalUnitsModel.Carrier.KAGA)
    expect(isHangarAvailable).toEqual(false)

    // Now the Kaga torpedo bomber unit wants to land on Kaga...should be diverted to Akagi instead
    doReturn1(controller, "Kaga-B5N-2", GlobalUnitsModel.Side.JAPAN)
    const destinations = controller.getValidAirUnitDestinations("Kaga-B5N-2")    

    let { carrier, box } = destinations[0]
    expect(destinations.length).toEqual(1)
    expect(carrier).toEqual("Akagi")
    expect(box).toEqual("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for Japan Air Unit when one Car Div 1 carrier flight deck damaged", () => {

    // Akagi fighter unit in return1 box
    const aaf1 = counters.get("Akagi-A6M-2b-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

    // set Akagi flight deck (both boxes) to damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)

    doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    const destinations = controller.getValidAirUnitDestinations(aaf1.name)

    let { carrier, box } = destinations[0]
    expect(destinations.length).toEqual(1)
    expect(carrier).toEqual("Kaga")
    expect(box).toEqual("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for Japan Air Unit when both Car Div 1 carrier flight decks damaged", () => {

    // Akagi fighter unit in return1 box
    const aaf1 = counters.get("Akagi-A6M-2b-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

    // set Akagi flight deck (both boxes) to damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

    doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    const destinations = controller.getValidAirUnitDestinations(aaf1.name)

    expect(destinations.length).toEqual(2)

    expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.HIRYU)
    expect(destinations[0].box).toBe("HANGAR")
    expect(destinations[1].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
    expect(destinations[1].box).toBe("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for Japan Air Unit when  both carriers in CarDiv are sunk and carrier in other Car Div sunk or at capacity or flight deck damaged", () => {
    // Akagi fighter unit in return1 box
    const aaf1 = counters.get("Akagi-A6M-2b-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

    // // set Akagi and Kaga flight deck (both boxes) to damaged and Hiryu sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)

    doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)

    expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
    expect(destinations[0].box).toBe("HANGAR")

    // // flight deck damaged on Hiryu
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 2)

    doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)

    expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
    expect(destinations[0].box).toBe("HANGAR")

    // Hiryu at capacity
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")
    const aaf2 = counters.get("Akagi-A6M-2b-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, htb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, aaf2)

   
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 1, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 2, hdb)
    const numUnitsOnCarrier = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
    doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)

    expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
    expect(destinations[0].box).toBe("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for Japan Air Unit when both carriers in CarDiv 1 are damaged and carriers in other both sunk", () => {
    // Nowhere to land in this scenario
    const aaf1 = counters.get("Akagi-A6M-2b-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

    // // set Akagi and Kaga flight deck (both boxes) to damaged and Hiryu and Soryu sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)

    doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(0)

    const airUnit = controller.getJapanAirUnit(aaf1.name)
    expect(airUnit.steps).toEqual(0)
  })
})
