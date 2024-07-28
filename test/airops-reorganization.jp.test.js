import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import {
  getStep1Fighters,
  getStep1DiveBombers,
  getStep1TorpedoPlanes,
  checkForReorganization,
  checkAllBoxesForReorganization,
  checkAllJapanBoxesForReorganizationCAP,
} from "../src/controller/AirOperationsHandler"

describe("Japan Air Operations: tests for Reorganization", () => {
  let controller
  let counters
  let kaf1, kaf2, kdb, ktb, aaf1, aaf2, adb, atb

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

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, kaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 1, ktb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 2, adb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 1, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 2, atb)
  })

  test("1 Step Air Units", () => {
    const airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    let step1Fighters = getStep1Fighters(airUnits)
    expect(step1Fighters.length).toEqual(0)

    let step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    let step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)
    expect(step1TorpedoPlanes.length).toEqual(0)

    aaf1.aircraftUnit.steps = 1
    aaf2.aircraftUnit.steps = 1
    atb.aircraftUnit.steps = 1

    step1Fighters = getStep1Fighters(airUnits)
    expect(step1Fighters.length).toEqual(2)

    step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)
    expect(step1TorpedoPlanes.length).toEqual(1)
  })

  test("Reorganize 1 Step Air Units within the same box (CD1 RETURN1), no auto reorganize", () => {
    // Fighters
    aaf1.aircraftUnit.steps = 1
    aaf2.aircraftUnit.steps = 1
    // no auto reorganize - units in CD1 Return1 Box
    let unitsToReorganize = checkForReorganization(controller, GlobalUnitsModel.AirBox.JP_CD1_RETURN1, null, false)

    expect(unitsToReorganize.length).toEqual(2)

    aaf1.aircraftUnit.steps = 2
    aaf2.aircraftUnit.steps = 2

    // dive bombers
    kdb.aircraftUnit.steps = 1
    adb.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 1, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 2, adb)
    unitsToReorganize = checkForReorganization(controller, GlobalUnitsModel.AirBox.JP_CD1_RETURN1, null, false)
    expect(unitsToReorganize.length).toEqual(2)

    // torpedo bombers
    kdb.aircraftUnit.steps = 2
    adb.aircraftUnit.steps = 2

    ktb.aircraftUnit.steps = 1
    atb.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 1, ktb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 2, atb)
    unitsToReorganize = checkForReorganization(controller, GlobalUnitsModel.AirBox.JP_CD1_RETURN1, null, false)
    expect(unitsToReorganize.length).toEqual(2)
  })

  test("Reorganize 1 Step Air Units within the same box (CD1 RETURN1), auto reorganize", () => {
    // Fighters
    aaf1.aircraftUnit.steps = 1
    aaf2.aircraftUnit.steps = 1

    // no auto reorganize - units in CD1 Return1 Box
    // Fighters
    checkForReorganization(controller, GlobalUnitsModel.AirBox.JP_CD1_RETURN1, null, true)
    expect(aaf1.aircraftUnit.steps).toEqual(0)
    expect(aaf2.aircraftUnit.steps).toEqual(2)

    // Dive Bombers
    aaf1.aircraftUnit.steps = 2
    aaf2.aircraftUnit.steps = 2

    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    let step1Fighters = getStep1Fighters(airUnits)
    expect(step1Fighters.length).toEqual(0)

    kdb.aircraftUnit.steps = 1
    adb.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 3, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 4, adb)
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    let step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(2)

    checkForReorganization(controller, GlobalUnitsModel.AirBox.JP_CD1_RETURN1, null, true)
    expect(kdb.aircraftUnit.steps).toEqual(0)
    expect(adb.aircraftUnit.steps).toEqual(2)

    // Torpedo Bombers
    kdb.aircraftUnit.steps = 2
    adb.aircraftUnit.steps = 2
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    ktb.aircraftUnit.steps = 1
    atb.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 5, ktb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 6, kdb)
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    let step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)
    expect(step1TorpedoPlanes.length).toEqual(2)

    checkForReorganization(controller, GlobalUnitsModel.AirBox.JP_CD1_RETURN1, null, true)
    expect(ktb.aircraftUnit.steps).toEqual(2)
    expect(atb.aircraftUnit.steps).toEqual(0)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 RETURN1 - AKAGI HANGAR, no auto reorganize", () => {
    // test reorg in TO box
    // 2 units in TO BOX
    kdb.aircraftUnit.steps = 1
    adb.aircraftUnit.steps = 1

    let unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
      false
    )
    expect(unitsToReorganize.length).toEqual(2)

    aaf1.aircraftUnit.steps = 1
    aaf2.aircraftUnit.steps = 1

    // test reorg across boxes
    // TO BOX Akagi hangar -> aaf2 1 step
    // FROM BOX CD1 RETURN 1 -> aaf1 1 step
    // Reorg -> 2 air units in reorg object, no auto organize
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 2, aaf2)
    unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
      false
    )
    expect(unitsToReorganize.length).toEqual(2)
  })
  test("Get fromBox and toBox for given air unit", () => {
    const unit = aaf1
    const carrier = unit.carrier

    const fromBox = controller.getAirUnitLocation(unit.name).boxName
    expect(fromBox).toEqual(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    const toBox = controller.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, carrier, "FLIGHT")
    expect(toBox).toEqual(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 RETURN1 - AKAGI HANGAR, auto reorganize", () => {
    // test reorg in TO box
    kdb.aircraftUnit.steps = 1
    adb.aircraftUnit.steps = 1

    let unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
      true
    )
    expect(unitsToReorganize).toBeNull()

    expect(kdb.aircraftUnit.steps).toEqual(0)
    expect(adb.aircraftUnit.steps).toEqual(2)

    aaf1.aircraftUnit.steps = 1
    aaf2.aircraftUnit.steps = 1

    // test reorg across boxes
    // TO BOX Akagi hangar -> aaf2 1 step
    // FROM BOX CD1 RETURN 1 -> aaf1 1 step
    // Reorg -> 0 air units in reorg object, auto organize, aaf2 in hangar eliminated to make space
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 2, aaf2)
    unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
      true
    )
    expect(unitsToReorganize).toBeNull()

    expect(aaf2.aircraftUnit.steps).toEqual(0)
    expect(aaf1.aircraftUnit.steps).toEqual(2)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 RETURN1 - other Task Force Carriers no auto reorganize", () => {
    // Situation
    // 1 Step Akagi fighter unit needs to land, Akagi is Sunk, Kaga at capacity
    //  => Kaga has no 1 step fighters
    //    => Check other TF - Hiryu and Soryu are both at capacity so no landing possible
    //      => Hiryu and Soryu both have 1 step fighters so should be 3 units for possible reorg

    // Set Akagi to Sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    expect(controller.isSunk(GlobalUnitsModel.Carrier.AKAGI)).toEqual(true)

    // Load up Hiryu and Soryu to max capacity
    const hf1 = counters.get("Hiryu-A6M-2b-1")
    const hf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")

    const sf1 = counters.get("Soryu-A6M-2b-1")
    const sf2 = counters.get("Soryu-A6M-2b-2")
    const sdb = counters.get("Soryu-D3A-1")
    const stb = counters.get("Soryu-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, hf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 1, htb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 2, adb) // Akagi dive bomber on HIRYU

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 1, sf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 0, sf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 1, stb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 2, atb) // Akagi torped bomber on SORYU

    let numUnitsOnCarrier = controller.numUnitsOnCarrier("Hiryu", GlobalUnitsModel.Side.JAPAN)
    expect(numUnitsOnCarrier).toEqual(5)

    numUnitsOnCarrier = controller.numUnitsOnCarrier("Soryu", GlobalUnitsModel.Side.JAPAN)
    expect(numUnitsOnCarrier).toEqual(5)

    // Akagi (incoming) fighter unit plus two fighter units in hangars set to 1 step
    aaf1.aircraftUnit.steps = 1
    hf1.aircraftUnit.steps = 1
    sf1.aircraftUnit.steps = 1

    checkAllBoxesForReorganization(
      controller,
      aaf1,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.Side.JAPAN,
      false
    )

    const reorgUnits = controller.getReorganizationUnits(aaf1.name)
    expect(reorgUnits.length).toEqual(3)

    expect(reorgUnits[0].name).toEqual(hf1.name)
    expect(reorgUnits[1].name).toEqual(aaf1.name)
    expect(reorgUnits[2].name).toEqual(sf1.name)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 RETURN1 - other Task Force Carriers with auto reorganize", () => {
    // Same as previous test but this time auto reorganize
    // If neither carrier damaged (or both damaged) eliminate first unit found

    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    expect(controller.isSunk(GlobalUnitsModel.Carrier.AKAGI)).toEqual(true)

    // Load up Hiryu and Soryu to max capacity
    const hf1 = counters.get("Hiryu-A6M-2b-1")
    const hf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")

    const sf1 = counters.get("Soryu-A6M-2b-1")
    const sf2 = counters.get("Soryu-A6M-2b-2")
    const sdb = counters.get("Soryu-D3A-1")
    const stb = counters.get("Soryu-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, hf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 1, htb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR, 2, adb) // Akagi dive bomber on HIRYU

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 1, sf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 0, sf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 1, stb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 2, atb) // Akagi torpedo bomber on SORYU

    let numUnitsOnCarrier = controller.numUnitsOnCarrier("Hiryu", GlobalUnitsModel.Side.JAPAN)
    expect(numUnitsOnCarrier).toEqual(5)

    numUnitsOnCarrier = controller.numUnitsOnCarrier("Soryu", GlobalUnitsModel.Side.JAPAN)
    expect(numUnitsOnCarrier).toEqual(5)

    // Akagi (incoming) fighter unit plus two fighter units in hangars set to 1 step
    aaf1.aircraftUnit.steps = 1
    hf1.aircraftUnit.steps = 1
    sf1.aircraftUnit.steps = 1

    // Neither Hiryu or Soryu damaged so just elim first fighter unit found (Hiryu's hf1)
    checkAllBoxesForReorganization(
      controller,
      aaf1,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.Side.JAPAN,
      true
    )

    const reorgUnits = controller.getReorganizationUnits(aaf1.name)
    expect(reorgUnits.length).toEqual(0)

    expect(aaf1.aircraftUnit.steps).toEqual(2)
    expect(hf1.aircraftUnit.steps).toEqual(0)
    expect(sf1.aircraftUnit.steps).toEqual(1)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 CAP RETURN - AKAGI FLIGHT DECK, no auto reorganize", () => {
    aaf1.aircraftUnit.steps = 1
    kaf1.aircraftUnit.steps = 1

    // check for reorg between CD1 CAP RETURN and Kaga Flight Deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, kaf1)

    checkAllJapanBoxesForReorganizationCAP(
      controller,
      aaf1,
      GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
      GlobalUnitsModel.Side.JAPAN,
      false
    )

    let reorgUnits = controller.getReorganizationUnits(aaf1.name)
    expect(reorgUnits.length).toEqual(2)

    expect(reorgUnits[0].name).toEqual(kaf1.name)
    expect(reorgUnits[1].name).toEqual(aaf1.name)

    // same but now reorg with Akagi Hangar
    kaf1.aircraftUnit.steps = 1
    aaf1.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, kaf1)

    reorgUnits = controller.getReorganizationUnits(aaf1.name)
    expect(reorgUnits.length).toEqual(2)

    expect(reorgUnits[0].name).toEqual(kaf1.name)
    expect(reorgUnits[1].name).toEqual(aaf1.name)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 CAP RETURN - KAGA HANGAR, no auto reorganize", () => {
    kaf1.aircraftUnit.steps = 1
    kaf2.aircraftUnit.steps = 1

    // Kaga Flight Deck full so...
    // check for reorg between CD1 CAP RETURN and Kaga Hangar
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, ktb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, kaf2)

    checkAllJapanBoxesForReorganizationCAP(
      controller,
      kaf1,
      GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
      GlobalUnitsModel.Side.JAPAN,
      false
    )

    let reorgUnits = controller.getReorganizationUnits(kaf1.name)
    expect(reorgUnits.length).toEqual(2)

    expect(reorgUnits[0].name).toEqual(kaf2.name)
    expect(reorgUnits[1].name).toEqual(kaf1.name)

    // same but now reorg with Akagi Hangar
    // Assume Kaga sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    kaf1.aircraftUnit.steps = 1
    kaf2.aircraftUnit.steps = 2
    aaf1.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, adb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, atb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 0, aaf1)
    checkAllJapanBoxesForReorganizationCAP(
      controller,
      kaf1,
      GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
      GlobalUnitsModel.Side.JAPAN,
      false
    )

    reorgUnits = controller.getReorganizationUnits(kaf1.name)
    expect(reorgUnits.length).toEqual(2)

    expect(reorgUnits[0].name).toEqual(aaf1.name)
    expect(reorgUnits[1].name).toEqual(kaf1.name)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 CAP RETURN - KAGA HANGAR, auto reorganize", () => {
    kaf1.aircraftUnit.steps = 1
    kaf2.aircraftUnit.steps = 1

    // Kaga Flight Deck full so...
    // check for reorg between CD1 CAP RETURN and Kaga Hangar
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, ktb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, kaf2)

    checkAllJapanBoxesForReorganizationCAP(
      controller,
      kaf1,
      GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
      GlobalUnitsModel.Side.JAPAN,
      true
    )

    let reorgUnits = controller.getReorganizationUnits(kaf1.name)
    expect(reorgUnits).toBeNull

    expect(kaf1.aircraftUnit.steps).toEqual(2)
    expect(kaf2.aircraftUnit.steps).toEqual(0)

    // same but now reorg with Akagi Hangar
    // Assume Kaga sunk
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    kaf1.aircraftUnit.steps = 1
    kaf2.aircraftUnit.steps = 2
    aaf1.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, adb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, atb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 0, aaf1)
    checkAllJapanBoxesForReorganizationCAP(
      controller,
      kaf1,
      GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
      GlobalUnitsModel.Side.JAPAN,
      true
    )

    reorgUnits = controller.getReorganizationUnits(kaf1.name)
    expect(reorgUnits).toBeNull

    expect(kaf1.aircraftUnit.steps).toEqual(2)
    expect(aaf1.aircraftUnit.steps).toEqual(0)

  })

  test("Reorganize 1 Step Air Units across boxes CD1 CAP RETURN - AKAGI FLIGHT DECK, auto reorganize", () => {
    aaf1.aircraftUnit.steps = 1
    kaf1.aircraftUnit.steps = 1

    // check for reorg between CD1 CAP RETURN and Kaga Flight Deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kaf1)

    checkAllJapanBoxesForReorganizationCAP(
      controller,
      aaf1,
      GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
      GlobalUnitsModel.Side.JAPAN,
      true
    )

    let reorgUnits = controller.getReorganizationUnits(aaf1.name)
    expect(reorgUnits).toBeNull

    // auto reorganize: air unit on flight deck eliminated to make room for combined
    // 2 step unit returning from CAP
    expect((aaf1.aircraftUnit.steps = 2))
    expect((kaf1.aircraftUnit.steps = 0))
  })
})
