import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./TestUtils"

describe("Air Operations tests for air units in Return 2 boxes", () => {
  let controller
  let counters
  let kaf1, aaf1, haf1, saf1, aaf2, saf2
  let ef1, ef2, hf1, yf1, yf2, ydb1, mf1, mf2, mdb, mdb2, mtb

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    // set CSF to prevent null exception
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    kaf1 = counters.get("Kaga-A6M-2b-1")
    aaf1 = counters.get("Akagi-A6M-2b-1")
    aaf2 = counters.get("Akagi-A6M-2b-2")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")

    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, aaf2)

    //  CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 0, saf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 0, saf1)

    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    hf1 = counters.get("Hornet-F4F4-1")

    yf1 = counters.get("Yorktown-F4F4-1")
    yf2 = counters.get("Yorktown-F4F4-2")
    ydb1 = counters.get("Yorktown-SBD3-1")

    mf1 = counters.get("Midway-F4F3")
    mf2 = counters.get("Midway-F2A-3")
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")

    // TF16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, ef2)

    // TF17
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR, 0, yf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 0, yf2)

    // MIDWAY
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR, 0, mf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 0, mf2)

  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Units in Hangar Boxes, Flight Deck Box Available", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK)

    destinations = controller.getValidAirUnitDestinations(saf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Units in Hangar Boxes, Flight Deck Box NOT Available", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    // 1. Both Flight Deck Slots occupied
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, kaf1)

    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations).toBeNull

    // 2. Flight Deck 1 box damaged, other box occupied
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kaf1)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 1)

    destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations).toBeNull

    // 3. Both FLight Deck boxes damaged
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, aaf2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 1)

    destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations).toBeNull
  })

  test("Create Lists of Valid Destination Boxes for each US Air Unit in Hangar Boxes, Flight Deck Box Available", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)

    destinations = controller.getValidAirUnitDestinations(yf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)

    
    destinations = controller.getValidAirUnitDestinations(mf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK)
  })

  test("Create Lists of Valid Destination Boxes for each US Air Unit in Hangar Boxes, Flight Deck Box UnAvailable", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

   // 1. Both Flight Deck Slots occupied
   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, hf1)
   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 1, ydb1)
   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 1, mdb)

   let destinations = controller.getValidAirUnitDestinations(ef1.name)
   expect(destinations).toBeNull

   destinations = controller.getValidAirUnitDestinations(yf1.name)
   expect(destinations).toBeNull

   // Midway has 3 flight deck slots
   destinations = controller.getValidAirUnitDestinations(mf1.name)
   expect(destinations.length).toEqual(1)
   expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK)

   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 2, mdb2)
   destinations = controller.getValidAirUnitDestinations(mf1.name)
   expect(destinations).toBeNull

  })

  test("Create Lists of Valid Destination Boxes for each US Air Unit in Hangar Boxes, Flight Deck Damaged", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    // One deck box damaged, other occupied (Midway 2 boxes damaged)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 1)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 1)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 2)

    
   let destinations = controller.getValidAirUnitDestinations(ef1.name)
   expect(destinations).toBeNull

   destinations = controller.getValidAirUnitDestinations(yf1.name)
   expect(destinations).toBeNull

   destinations = controller.getValidAirUnitDestinations(mf1.name)
   expect(destinations).toBeNull
  })
})
