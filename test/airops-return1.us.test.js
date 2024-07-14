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

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 0)
  })

  test("Air Box Processing for All US units (air and carrier), assume Midway NOT an option for carrier units", () => {
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, ef2)
    const unitsInUSReturn1Box = controller.getAllUnitsInBoxes(GlobalUnitsModel.Side.US, "RETURN1")

    expect(unitsInUSReturn1Box.length).toEqual(3)

    doReturn1(controller, "Enterprise-F4F4-1", GlobalUnitsModel.Side.US)
    const destinations = controller.getValidAirUnitDestinations("Enterprise-F4F4-1")

    expect(destinations.length).toEqual(2)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Air Box Processing for All US units (air and carrier), TF16 carriers sunk: assume Midway IS an option for carrier units", () => {
    const edb1 = counters.get("Enterprise-SBD3-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, edb1)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

    doReturn1(controller, "Enterprise-SBD3-1", GlobalUnitsModel.Side.US, true)
    const destinations = controller.getValidAirUnitDestinations("Enterprise-SBD3-1")

    // If Enterprise and Hornet are sunk, air units can land on Yorktown or Midway
    expect(destinations.length).toEqual(2)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)
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
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations("Enterprise-F4F4-1")

    expect(destinations.length).toEqual(2)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)

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
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)

    // Set Yorktown to sunk, test air units will try TF16
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    doReturn1(controller, "Yorktown-F4F4-1", GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations("Yorktown-F4F4-1")

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
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
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for each Midway US Air Unit", () => {
    const mf1 = counters.get("Midway-F4F3")
    const mf2 = counters.get("Midway-F2A-3")
    const mdb1 = counters.get("Midway-SBD-2")
    const mtb2 = counters.get("Midway-SB2U-3")
    const mtb3 = counters.get("Midway-TBF-1")
    const mdb = counters.get("Midway-B26-B")
    const mhb = counters.get("Midway-B17-E")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 0, mf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 1, mf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 1, mdb1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR, 0, mtb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN1, 1, mdb)

    doReturn1(controller, mdb.name, GlobalUnitsModel.Side.US)
    let destinations = controller.getValidAirUnitDestinations(mdb.name)

    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)

    // Assume Midway flight deck damaged (3 boxes)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 3)

    doReturn1(controller, mdb.name, GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations(mdb.name)

    expect(destinations.length).toEqual(0)
  })
})

describe("Air Operations tests with air unit locations set in tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })
  test("Create Lists of Valid Destination Boxes for US Air Unit when carrier at capacity", () => {
    // Put 5 aircraft units on the flight deck and hangar of Enterprise
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")
    const edb2 = counters.get("Enterprise-SBD3-2")
    const hf1 = counters.get("Hornet-F4F4-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 2, hf1)

    const isHangarAvailable = controller.isHangarAvailable(GlobalUnitsModel.Carrier.ENTERPRISE)
    expect(isHangarAvailable).toEqual(false)

    // Now the Enterprise torpedo bomber unit wants to land on Enterprise...should be diverted to Hornet instead
    doReturn1(controller, "Enterprise-TBD1", GlobalUnitsModel.Side.US)
    const destinations = controller.getValidAirUnitDestinations("Enterprise-TBD1")

    let { carrier, box } = destinations[0]
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for US Air Unit when one TF16 carrier flight deck damaged", () => {
    // Akagi fighter unit in return1 box
    const etb = counters.get("Enterprise-TBD1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, etb)

    // set Entterprise flight deck (both boxes) to damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)

    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US)
    const destinations = controller.getValidAirUnitDestinations(etb.name)

    let { carrier, box } = destinations[0]
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for US Air Unit when both TF 16 carrier flight decks damaged", () => {
    // Akagi fighter unit in return1 box
    const hf1 = counters.get("Hornet-F4F4-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, hf1)

    // set Enterprise and Hornet flight decks (both boxes) to damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 2)

    doReturn1(controller, hf1.name, GlobalUnitsModel.Side.US)
    const destinations = controller.getValidAirUnitDestinations(hf1.name)

    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for US Air Unit when  both carriers in TF16 are sunk and carrier in other TF sunk or at capacity or flight deck damaged, Midway IS available", () => {
    // Enterprise torpedo unit in return1 box
    const etb = counters.get("Enterprise-TBD1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, etb)

    // // set Enterprise and Hornet flight deck (both boxes) to damaged and Yorktown sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US, true)
    let destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)

    // flight deck damaged on Yorktown (instead of sunk)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 2)

    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US, true)
    destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)

    // Yorktown at capacity
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 0)
    const yf1 = counters.get("Yorktown-F4F4-1")
    const yf2 = counters.get("Yorktown-F4F4-2")
    const ydb1 = counters.get("Yorktown-SBD3-1")
    const ydb2 = counters.get("Yorktown-SBD3-2")
    const ytb = counters.get("Yorktown-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 0, ytb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 1, yf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR, 0, yf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR, 1, ydb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR, 2, ydb2)

    // const numUnitsOnCarrier = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)
    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US, true)
    destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)
  })

  test("Empty list of Valid Destination Boxes for US Air Unit when both carriers in TF16 are damaged and carrier in TF17 sunk and Midway NOT an option", () => {
    // Nowhere to land in this scenario
    const etb = counters.get("Enterprise-TBD1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, etb)

    // // set Enterprise and Hornet flight deck (both boxes) to damaged and Yoktown sunk and Midway damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US)
    let destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(0)

    const airUnit = controller.getUSAirUnit(etb.name)
    expect(airUnit.steps).toEqual(0)
  })

  test("Empty list of Valid Destination Boxes for US Air Unit when both carriers in TF16 are damaged and carrier in TF17 sunk and Midway IS an option but Midway runway damaged", () => {
    // Nowhere to land in this scenario
    const etb = counters.get("Enterprise-TBD1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, etb)

    // // set Enterprise and Hornet flight deck (both boxes) to damaged and Yoktown sunk and Midway damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    //Midway damaged but still operable
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 2)

    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US, true)
    let destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(1)

    //Midway damaged and not operable
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 3)

    doReturn1(controller, etb.name, GlobalUnitsModel.Side.US, true)
    destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(0)
  })

  test("Empty list of Valid Destination Boxes for US Air Unit when both carriers in TF16 are damaged and carrier in TF17 sunk and Midway avaiability calculated", () => {
    2
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    const etb = counters.get("Enterprise-TBD1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, etb)

    // set Enterprise and Hornet flight deck (both boxes) to damaged and Yoktown sunk and Midway damaged
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations(etb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)
  })
})
