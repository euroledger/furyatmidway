import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves, doReturn1, getValidJapanDestinationsCAP } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./TestUtils"

describe("Air Operations tests with Preset air unit locations", () => {
  let controller
  let counters
  let kaf1, kaf2, kdb, ktb
  let aaf1, aaf2, adb, atb
  let saf1, saf2, sdb, stb
  let haf1, haf2, hdb, htb

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
    kaf1 = counters.get("Kaga-A6M-2b-1")
    kaf2 = counters.get("Kaga-A6M-2b-2")
    kdb = counters.get("Kaga-D3A-1")
    ktb = counters.get("Kaga-B5N-2")

    aaf1 = counters.get("Akagi-A6M-2b-1")
    aaf2 = counters.get("Akagi-A6M-2b-2")
    adb = counters.get("Akagi-D3A-1")
    atb = counters.get("Akagi-B5N-2")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")
    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")

    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")
    sdb = counters.get("Soryu-D3A-1")
    stb = counters.get("Soryu-B5N-2")

    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 1, kaf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, adb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 0, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 1, kaf2)

    //  CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 0, saf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 1, saf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 0, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 0, stb)
  })

  test("Create Lists of Valid Destination Boxes for Soryu fighter 1 unit returning from CAP", () => {
    let destinations = getValidJapanDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.SORYU,
      GlobalUnitsModel.Side.JAPAN
    )

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for Soryu fighter 1 unit returning from CAP, Soryu Sunk", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)

    let destinations = getValidJapanDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.SORYU,
      GlobalUnitsModel.Side.JAPAN
    )

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR)

  })

  test("Create Lists of Valid Destination Boxes for Soryu fighter 1 unit returning from CAP, Soryu Sunk, Hiryu Flight Deck unavailable", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 1) // and 1 unit already there (hdb)

    let destinations = getValidJapanDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.SORYU,
      GlobalUnitsModel.Side.JAPAN
    )

    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR)
  })

  test("Soryu CAP returning air unit, Soryu at capacity, go to Hiryu (Flight Deck or Hangar)", () => {
    // Add one unit to Soryu flight deck and two to hangar so
    // carrier now at capacity
    
    // returning CAP unit will go to Hiryu Flight Deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 1, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 2, aaf2)

    let destinations = getValidJapanDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.SORYU,
      GlobalUnitsModel.Side.JAPAN
    )

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR)
  })

  test("Soryu CAP returning air unit, Soryu sunk, go to Hiryu, Hiryu at capacity, no possible destination for this air unit", () => {
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, stb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 1, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 2, haf2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)

    let destinations = getValidJapanDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.SORYU,
      GlobalUnitsModel.Side.JAPAN
    )

    expect(destinations.length).toEqual(0)
  })


  test("Soryu CAP returning air unit, Soryu flight deck has 1 damage - go to Soryu", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 1)

    // This frees up a slot on the flight deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 1, stb)

    let destinations = getValidJapanDestinationsCAP(
        controller,
        GlobalUnitsModel.Carrier.SORYU,
        GlobalUnitsModel.Side.JAPAN
      )
  
      expect(destinations.length).toEqual(2)
      expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)
      expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR)
  })

  test("Soryu CAP returning air unit, Soryu flight deck has 1 damage, other flight deck slot occupied - go to Soryu Hangar", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 1)

    let destinations = getValidJapanDestinationsCAP(
        controller,
        GlobalUnitsModel.Carrier.SORYU,
        GlobalUnitsModel.Side.JAPAN
      )
  
      expect(destinations.length).toEqual(1)
      expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR)
  })


  test("Soryu CAP returning air unit, Soryu flight deck has 2 damage, Hiryu Flight Deck or Hangar", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 2)

    let destinations = getValidJapanDestinationsCAP(
        controller,
        GlobalUnitsModel.Carrier.SORYU,
        GlobalUnitsModel.Side.JAPAN
      )
  
      expect(destinations.length).toEqual(2)
      expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
      expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR)
  })

  test("Soryu CAP returning air unit, Soryu flight deck has 2 damage, Hiryu Flight Deck has 1 damaged and 1 occupied go to Hiryu Hangar", () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 1)

    let destinations = getValidJapanDestinationsCAP(
        controller,
        GlobalUnitsModel.Carrier.SORYU,
        GlobalUnitsModel.Side.JAPAN
      )
  
      expect(destinations.length).toEqual(1)
      expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Unit", () => {
    // set CSF to prevent null exception
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    let destinations = controller.getValidAirUnitDestinations(saf1.name)

    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR)
  })

  test("Create Lists of Valid Destination Boxes for Japan (Kaga) CAP Air Unit when both carriers in CarDiv 1 are sunk", () => {
 
    // Set Akagi and Kaga to be sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    let destinations = getValidJapanDestinationsCAP(
      controller,
      GlobalUnitsModel.Carrier.AKAGI,
      GlobalUnitsModel.Side.JAPAN
    )

    expect(destinations).toBeNull
  })
})
