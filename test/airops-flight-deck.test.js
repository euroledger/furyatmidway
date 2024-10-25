import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./TestUtils"

describe("Air Operations tests for air units in Flight Deck boxes", () => {
  let controller
  let counters
  let aaf1, aaf2, adb, atb
  let haf1, haf2, hdb, htb
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb1

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    // set CSF to prevent null exception
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    aaf1 = counters.get("Akagi-A6M-2b-1")
    aaf2 = counters.get("Akagi-A6M-2b-2")
    adb = counters.get("Akagi-D3A-1")
    atb = counters.get("Akagi-B5N-2")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")
    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")
    

    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    etb = counters.get("Enterprise-TBD1")

    hf1 = counters.get("Hornet-F4F4-1")
    hf2 = counters.get("Hornet-F4F4-2")
    hdb1 = counters.get("Hornet-SBD3-1")
    hdb2 = counters.get("Hornet-SBD3-2")
    htb1 = counters.get("Hornet-TBD1")

    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, adb)

    // CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, htb)

    // TF 16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb1)
    edb2.launchedFrom = GlobalUnitsModel.Carrier.ENTERPRISE
    etb.launchedFrom = GlobalUnitsModel.Carrier.ENTERPRISE

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3, 0, etb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 1, hdb1)

    htb1.launchedFrom = GlobalUnitsModel.Carrier.HORNET
    hdb2.launchedFrom = GlobalUnitsModel.Carrier.HORNET
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1, 0, hdb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2, 0, htb1)
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Unit in Flight Deck Boxes", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(2)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR)
    
    destinations = controller.getValidAirUnitDestinations(adb.name)
    expect(destinations.length).toEqual(8) // dive bomber cannot go to CAP
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_1)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2)
    expect(destinations[3]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_3)
    expect(destinations[4]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_4)
    expect(destinations[5]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_5)
    expect(destinations[6]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_6)
    expect(destinations[7]).toEqual(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR)

    // Add dive bomber to strike box 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2, 0, adb)
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    // Now fighter unit can go to strike box 2
    destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(3)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR)
    
  })
 
  test("Create Lists of Valid Destination Boxes for each US Air Unit in Flight Deck Boxes", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(4)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF16_CAP)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3)
    expect(destinations[3]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    
    destinations = controller.getValidAirUnitDestinations(edb1.name)

    expect(destinations.length).toEqual(6) // dive bomber cannot go to CAP
    // cannot go to strike boxes 1 or 2 as these contain Hornet units
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)

    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_4)
    expect(destinations[3]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_5)
    expect(destinations[4]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_6)
    expect(destinations[5]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)

    // // Add dive bomber to strike box 2
    edb1.launchedFrom = GlobalUnitsModel.Carrier.ENTERPRISE
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2, 0, edb1)
    const airUnitsInBox = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2)
    expect(airUnitsInBox.length).toEqual(1)

    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    // Now fighter unit can go to strike box 2
    destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(5)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF16_CAP)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2)
    expect(destinations[3]).toEqual(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3)
    expect(destinations[4]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    
  }) 
})
