import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves, getValidUSDestinationsCAP } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./TestUtils"

describe("Air Operations tests with Preset air unit locations", () => {
  let controller
  let counters
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb
  let yf1, yf2, eyb1, ydb2, ytb
  let mf1, mf2, mdb, mdb2, mtb, mhb1, mhb2

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    // TF 16
    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    etb = counters.get("Enterprise-TBD1")

    hf1 = counters.get("Hornet-F4F4-1")
    hf2 = counters.get("Hornet-F4F4-2")
    hdb1 = counters.get("Hornet-SBD3-1")
    hdb2 = counters.get("Hornet-SBD3-2")
    htb = counters.get("Hornet-TBD1")

    
    yf1 = counters.get("Yorktown-F4F4-1")
    
    // MIDWAY
    mf1 = counters.get("Midway-F4F3")
    mf2 = counters.get("Midway-F2A-3")
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")
    mhb1 = counters.get("Midway-B26-B")
    mhb2 = counters.get("Midway-B17-E")

    // TF 16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, 1, hf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 0, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, edb2)

    //  MIDWAY
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN, 0, mf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN, 1, mf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 0, mdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR, 0, mtb)
  })

  test("Create Lists of Valid Destination Boxes for Enterprise fighter 1 unit returning from CAP", () => {
    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US,
      ef1.name
    )

    // Note US Air Units are not required to land on parent carrier, any carrier
    // in TF will do
    expect(destinations.length).toEqual(4)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
    expect(destinations[3]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for Enterprise fighter 1 unit returning from CAP, Enterprise Sunk", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US,
      ef1.name
    )

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for Enterprise fighter 1 unit returning from CAP, Enterprise Sunk, Hornet Flight Deck unavailable", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 1) // and 1 unit already there (hdb1)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US,
      ef1.name
    )

    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Enterprise CAP returning air unit, Enterprise at capacity, go to Hornet (Hangar orFlight Deck)", () => {
    // Add one unit to Enterprise flight deck and one to hangar so
    // carrier now at capacity

    // returning CAP unit will go to Hornet Flight Deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, etb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 2, hf1)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US,
      ef1.name
    )

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Enterprise CAP returning air unit, Enterprise sunk, go to Hornet, Hornet at capacity, no possible destination for this air unit", () => {
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGAR, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGAR, 1, hf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGAR, 2, hdb2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US,
      ef1.name
    )

    expect(destinations.length).toEqual(0)
  })

  test("Enterprise CAP returning air unit, Enterprise flight deck damaged/occupied, go to Enterprise hangar or Hornet Flight Deck or Hangar", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 1)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US,
      ef1.name
    )

    expect(destinations.length).toEqual(3)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Unit", () => {
    // set CSF to prevent null exception
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations(ef1.name)

    expect(destinations.length).toEqual(4)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[2]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
    expect(destinations[3]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for US (Yorktown) Air Unit", () => {
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN, 0, yf1)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.YORKTOWN,
      GlobalUnitsModel.Side.US,
      yf1.name
    )
    expect(destinations.length).toEqual(2)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for US (Midway) Air Unit", () => {
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN, 0, mf1)

    let destinations = getValidUSDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.MIDWAY,
      GlobalUnitsModel.Side.US,
      mf1.name
    )
    expect(destinations.length).toEqual(2)

    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR)
  })
})
