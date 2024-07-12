import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import AirOperationsModel from "../src/model/AirOperationsModel"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves, doReturn1 } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./TestUtils"

describe("Air Operations tests with Preset air unit locations", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    // TF 16
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")
    const edb2 = counters.get("Enterprise-SBD3-2")
    const etb = counters.get("Enterprise-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 3, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 4, edb2)

    const hf1 = counters.get("Hornet-F4F4-1")
    const hf2 = counters.get("Hornet-F4F4-2")
    const hdb1 = counters.get("Hornet-SBD3-1")
    const hdb2 = counters.get("Hornet-SBD3-2")
    const htb = counters.get("Hornet-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 0, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, hf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 3, htb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGAR, 4, hdb2)

    const yf1 = counters.get("Yorktown-F4F4-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN1, 1, yf1)
  })

  test("Air Box Processing for All US units (air and carrier), assume Midway not an option for carrier units", () => {
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, ef2)
    const unitsInUSReturn1Box = controller.getAllUnitsInBoxes(GlobalUnitsModel.Side.US, "RETURN1")

    expect(unitsInUSReturn1Box.length).toEqual(3)
  })

  // Add US Carrier tst here
  test("US Carrier Status", () => {
    // Place US CSF within two of Midway
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4
    let fleetUnits = controller.getAllCarriersForSide(GlobalUnitsModel.Side.US)
    expect(fleetUnits.length).toEqual(4)

    createFleetMove(controller, 6, -1, "CSF", GlobalUnitsModel.Side.US) // F-2
    fleetUnits = controller.getAllCarriersForSide(GlobalUnitsModel.Side.US)
    expect(fleetUnits.length).toEqual(3)

    const carrier = controller.getUSFleetUnit(GlobalUnitsModel.Carrier.ENTERPRISE)
    expect(carrier.hits).toEqual(0)
    expect(carrier.isSunk).toEqual(false)

    const taskForce = controller.getTaskForceForCarrier(GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.Side.US)
    expect(taskForce).toEqual(GlobalUnitsModel.TaskForce.TASK_FORCE_16)

    const units = controller.getAllCarriersInTaskForce(taskForce, GlobalUnitsModel.Side.US)
    expect(units.length).toEqual(2)

    const otherCarrierinTF = controller.getOtherCarrierInTF(
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US
    )
    expect(otherCarrierinTF.name).toEqual(GlobalUnitsModel.Carrier.HORNET)

    const numUnitsOnCarrier = controller.numUnitsOnCarrier("Enterprise", GlobalUnitsModel.Side.US)
    expect(numUnitsOnCarrier).toEqual(2)
  })

  test("Create Lists of Valid Destination Boxes for each US Air Unit", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations("Enterprise-F4F4-1")

    expect(destinations.length).toEqual(2)
    expect(destinations[0].carrier).toEqual("Enterprise")
    expect(destinations[0].box).toEqual("HANGAR")
    expect(destinations[1].carrier).toEqual("Hornet")
    expect(destinations[1].box).toEqual("HANGAR")

    const model = new AirOperationsModel()
    let boxName = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.US, "Hornet", "FLIGHT")

    // note we need to send the box object value not key
    const b = Object.values(boxName)[0]
    expect(Object.values(boxName).length).toEqual(1)

    const units = controller.getAllAirUnitsInBox(b)
    expect(units.length).toEqual(1)

    // Set Enterprise to be sunk so air unit has to return to Hornet if possible
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
    expect(controller.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE)).toEqual(true)

    doReturn1(controller, "Enterprise-F4F4-1", GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations("Enterprise-F4F4-1")

    expect(destinations.length).toEqual(1)
    expect(destinations[0].carrier).toEqual("Hornet")
    expect(destinations[0].box).toEqual("HANGAR")

    // Set Yorktown to sunk, test air units will try TF16
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    doReturn1(controller, "Yorktown-F4F4-1", GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations("Yorktown-F4F4-1")

    expect(destinations.length).toEqual(2)
    expect(destinations[0].carrier).toEqual("Enterprise")
    expect(destinations[0].box).toEqual("HANGAR")
    expect(destinations[1].carrier).toEqual("Hornet")
    expect(destinations[1].box).toEqual("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for US (Enterprise) Air Unit when both carriers in TF16 are sunk", () => {
    const carriersInOtherTaskForce = controller.getCarriersInOtherTF(
      GlobalUnitsModel.TaskForce.TASK_FORCE_16,
      GlobalUnitsModel.Side.US
    )
    expect(carriersInOtherTaskForce.length).toEqual(1)
    expect(carriersInOtherTaskForce[0].name).toEqual(GlobalUnitsModel.Carrier.YORKTOWN)

    // Set Enterprise and Hornet to be sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

    doReturn1(controller, "Enterprise-F4F4-1", GlobalUnitsModel.Side.US)
    const destinations = controller.getValidAirUnitDestinations("Enterprise-F4F4-1")

    expect(destinations.length).toEqual(1)

    expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.YORKTOWN)
    expect(destinations[0].box).toBe("HANGAR")
  })

  test("Create Lists of Valid Destination Boxes for each Midway US Air Unit", () => {})
})

// describe("Air Operations tests with air unit locations set in tests", () => {
//   let controller
//   let counters

//   beforeEach(() => {
//     controller = new Controller()
//     counters = loadCounters(controller)
//   })
//   test("Create Lists of Valid Destination Boxes for Japan Air Unit when carrier at capacity", () => {
//     // Put 5 aircraft units on the flight deck and hangar of Kaga
//     const kaf1 = counters.get("Kaga-A6M-2b-1")
//     const kaf2 = counters.get("Kaga-A6M-2b-2")
//     const kdb = counters.get("Kaga-D3A-1")
//     const ktb = counters.get("Kaga-B5N-2")
//     const aaf1 = counters.get("Akagi-A6M-2b-1")
//     const aaf2 = counters.get("Akagi-A6M-2b-2")

//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kaf1)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, kaf2)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, kdb)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 1, aaf1)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 2, aaf2)

//     const isHangarAvailable = controller.isHangarAvailable(GlobalUnitsModel.Carrier.KAGA)
//     expect(isHangarAvailable).toEqual(false)

//     // Now the Kaga torpedo bomber unit wants to land on Kaga...should be diverted to Akagi instead
//     doReturn1(controller, "Kaga-B5N-2", GlobalUnitsModel.Side.JAPAN)
//     const destinations = controller.getValidAirUnitDestinations("Kaga-B5N-2")

//     let { carrier, box } = destinations[0]
//     expect(destinations.length).toEqual(1)
//     expect(carrier).toEqual("Akagi")
//     expect(box).toEqual("HANGAR")
//   })

//   test("Create Lists of Valid Destination Boxes for Japan Air Unit when one Car Div 1 carrier flight deck damaged", () => {

//     // Akagi fighter unit in return1 box
//     const aaf1 = counters.get("Akagi-A6M-2b-1")
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

//     // set Akagi flight deck (both boxes) to damaged
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)

//     doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
//     const destinations = controller.getValidAirUnitDestinations(aaf1.name)

//     let { carrier, box } = destinations[0]
//     expect(destinations.length).toEqual(1)
//     expect(carrier).toEqual("Kaga")
//     expect(box).toEqual("HANGAR")
//   })

//   test("Create Lists of Valid Destination Boxes for Japan Air Unit when both Car Div 1 carrier flight decks damaged", () => {

//     // Akagi fighter unit in return1 box
//     const aaf1 = counters.get("Akagi-A6M-2b-1")
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

//     // set Akagi flight deck (both boxes) to damaged
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

//     doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
//     const destinations = controller.getValidAirUnitDestinations(aaf1.name)

//     expect(destinations.length).toEqual(2)

//     expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.HIRYU)
//     expect(destinations[0].box).toBe("HANGAR")
//     expect(destinations[1].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
//     expect(destinations[1].box).toBe("HANGAR")
//   })

//   test("Create Lists of Valid Destination Boxes for Japan Air Unit when  both carriers in CarDiv are sunk and carrier in other Car Div sunk or at capacity or flight deck damaged", () => {
//     // Akagi fighter unit in return1 box
//     const aaf1 = counters.get("Akagi-A6M-2b-1")
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

//     // // set Akagi and Kaga flight deck (both boxes) to damaged and Hiryu sunk
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

//     controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)

//     doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
//     let destinations = controller.getValidAirUnitDestinations(aaf1.name)
//     expect(destinations.length).toEqual(1)

//     expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
//     expect(destinations[0].box).toBe("HANGAR")

//     // // flight deck damaged on Hiryu
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 2)

//     doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
//     destinations = controller.getValidAirUnitDestinations(aaf1.name)
//     expect(destinations.length).toEqual(1)

//     expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
//     expect(destinations[0].box).toBe("HANGAR")

//     // Hiryu at capacity
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
//     const haf1 = counters.get("Hiryu-A6M-2b-1")
//     const haf2 = counters.get("Hiryu-A6M-2b-2")
//     const hdb = counters.get("Hiryu-D3A-1")
//     const htb = counters.get("Hiryu-B5N-2")
//     const aaf2 = counters.get("Akagi-A6M-2b-2")

//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, htb)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, aaf2)

//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 0, haf1)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 1, haf2)
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 2, hdb)
//     const numUnitsOnCarrier = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
//     doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
//     destinations = controller.getValidAirUnitDestinations(aaf1.name)
//     expect(destinations.length).toEqual(1)

//     expect(destinations[0].carrier).toBe(GlobalUnitsModel.Carrier.SORYU)
//     expect(destinations[0].box).toBe("HANGAR")
//   })

//   test("Create Lists of Valid Destination Boxes for Japan Air Unit when both carriers in CarDiv 1 are damaged and carriers in other both sunk", () => {
//     // Nowhere to land in this scenario
//     const aaf1 = counters.get("Akagi-A6M-2b-1")
//     controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)

//     // // set Akagi and Kaga flight deck (both boxes) to damaged and Hiryu and Soryu sunk
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

//     controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)
//     controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)

//     doReturn1(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
//     let destinations = controller.getValidAirUnitDestinations(aaf1.name)
//     expect(destinations.length).toEqual(0)

//     const airUnit = controller.getJapanAirUnit(aaf1.name)
//     expect(airUnit.steps).toEqual(0)
//   })
// })
