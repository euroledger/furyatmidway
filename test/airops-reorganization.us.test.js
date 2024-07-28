import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import {
  getStep1Fighters,
  getStep1DiveBombers,
  getStep1TorpedoPlanes,
  checkForReorganization,
  checkAllUSBoxesForReorganizationCAP,
} from "../src/controller/AirOperationsHandler"

describe("US Air Operations: tests for Reorganization", () => {
  let controller
  let counters
  let ef1, ef2, edb1, edb2, etb, hf1, hf2, hdb1, hdb2, htb
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

    // MIDWAY
    mf1 = counters.get("Midway-F4F3")
    mf2 = counters.get("Midway-F2A-3")
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")
    mhb1 = counters.get("Midway-B26-B")
    mhb2 = counters.get("Midway-B17-E")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 2, etb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, hf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, htb)

    const yf1 = counters.get("Yorktown-F4F4-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN1, 1, yf1)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 0)
  })

  test("1 Step Air Units", () => {
    const airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    let step1Fighters = getStep1Fighters(airUnits)
    expect(step1Fighters.length).toEqual(0)

    let step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    let step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)
    expect(step1TorpedoPlanes.length).toEqual(0)

    hf1.aircraftUnit.steps = 1
    hf2.aircraftUnit.steps = 1
    htb.aircraftUnit.steps = 1

    step1Fighters = getStep1Fighters(airUnits)
    expect(step1Fighters.length).toEqual(2)

    step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)
    expect(step1TorpedoPlanes.length).toEqual(1)
  })

  test("Reorganize 1 Step Air Units within the same box (TF16 RETURN1), no auto reorganize", () => {
    // Fighters
    hf1.aircraftUnit.steps = 1
    hf2.aircraftUnit.steps = 1
    // no auto reorganize - units in TF16 Return1 Box
    let unitsToReorganize = checkForReorganization(controller, GlobalUnitsModel.AirBox.US_TF16_RETURN1, null, false)

    expect(unitsToReorganize.length).toEqual(2)

    hf1.aircraftUnit.steps = 2
    hf2.aircraftUnit.steps = 2

    // dive bombers
    edb1.aircraftUnit.steps = 1
    hdb1.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, edb1)
    unitsToReorganize = checkForReorganization(controller, GlobalUnitsModel.AirBox.US_TF16_RETURN1, null, false)
    expect(unitsToReorganize.length).toEqual(2)

    // torpedo bombers
    hdb1.aircraftUnit.steps = 2
    edb1.aircraftUnit.steps = 2

    htb.aircraftUnit.steps = 1
    etb.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, htb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, etb)
    unitsToReorganize = checkForReorganization(controller, GlobalUnitsModel.AirBox.US_TF16_RETURN1, null, false)
    expect(unitsToReorganize.length).toEqual(2)
  })

  test("Reorganize 1 Step Air Units within the same box (TF16 RETURN1), auto reorganize", () => {
    // Fighters
    hf1.aircraftUnit.steps = 1
    hf2.aircraftUnit.steps = 1

    // no auto reorganize - units in TF16 Return1 Box
    // Fighters
    checkForReorganization(controller, GlobalUnitsModel.AirBox.US_TF16_RETURN1, null, true)
    expect(hf1.aircraftUnit.steps).toEqual(0)
    expect(hf2.aircraftUnit.steps).toEqual(2)

    // Dive Bombers
    hf1.aircraftUnit.steps = 2
    hf2.aircraftUnit.steps = 2

    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    let step1Fighters = getStep1Fighters(airUnits)
    expect(step1Fighters.length).toEqual(0)

    hdb1.aircraftUnit.steps = 1
    hdb2.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 3, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 4, hdb2)
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    let step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(2)

    checkForReorganization(controller, GlobalUnitsModel.AirBox.US_TF16_RETURN1, null, true)
    expect(hdb1.aircraftUnit.steps).toEqual(0)
    expect(hdb2.aircraftUnit.steps).toEqual(2)

    // Torpedo Bombers
    hdb1.aircraftUnit.steps = 2
    hdb2.aircraftUnit.steps = 2
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    step1DiveBombers = getStep1DiveBombers(airUnits)
    expect(step1DiveBombers.length).toEqual(0)

    etb.aircraftUnit.steps = 1
    htb.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 5, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 6, htb)
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    let step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)
    expect(step1TorpedoPlanes.length).toEqual(2)

    checkForReorganization(controller, GlobalUnitsModel.AirBox.US_TF16_RETURN1, null, true)
    expect(htb.aircraftUnit.steps).toEqual(2)
    expect(etb.aircraftUnit.steps).toEqual(0)
  })

  test("Reorganize 1 Step Air Units across boxes TF16 RETURN1 - ENTERPRISE HANGAR, no auto reorganize", () => {
    // Test reorg in TO box
    // 2 units in TO BOX
    hf1.aircraftUnit.steps = 1
    hf2.aircraftUnit.steps = 1

    let unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.US_TF16_RETURN1,
      GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
      false
    )
    expect(unitsToReorganize.length).toEqual(2)

    // Test reorg across boxes
    // TO BOX Enterprise hangar -> hf2 1 step
    // FROM BOX TF16 RETURN 1 -> hf1 1 step
    // Reorg -> 2 air units in reorg object, no auto organize
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 2, hf2)
    unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.US_TF16_RETURN1,
      GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
      false
    )
    expect(unitsToReorganize.length).toEqual(2)
  })
  test("Get fromBox and toBox for given air unit", () => {
    const unit = ef1
    const carrier = unit.carrier
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, ef1)

    const fromBox = controller.getAirUnitLocation(unit.name).boxName
    expect(fromBox).toEqual(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    const toBox = controller.getAirBoxForNamedShip(GlobalUnitsModel.Side.US, carrier, "HANGAR")
    expect(toBox).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
  })

  test("Reorganize 1 Step Air Units across boxes TF16 RETURN1 - ENTERPRISE$ HANGAR, auto reorganize", () => {
    // Test reorg in TO box
    hf1.aircraftUnit.steps = 1
    hf2.aircraftUnit.steps = 1

    let unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.US_TF16_RETURN1,
      GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
      true
    )
    expect(unitsToReorganize).toBeNull()

    expect(hf1.aircraftUnit.steps).toEqual(0)
    expect(hf2.aircraftUnit.steps).toEqual(2)

    ef1.aircraftUnit.steps = 1
    ef2.aircraftUnit.steps = 1

    // Test reorg across boxes
    // TO BOX Enterprise hangar -> ef2 1 step
    // FROM BOX TF16 RETURN 1 -> ef1 1 step
    // Reorg -> 0 air units in reorg object, auto organize, ef2 in hangar eliminated to make space
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, ef1)
    unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.US_TF16_RETURN1,
      GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
      true
    )
    expect(unitsToReorganize).toBeNull()

    expect(ef2.aircraftUnit.steps).toEqual(0)
    expect(ef1.aircraftUnit.steps).toEqual(2)
  })

  test("Reorganize 1 Step Air Units across boxes TF16 CAP RETURN - ENTERPRISE FLIGHT DECK, no auto reorganize", () => {
    ef1.aircraftUnit.steps = 1
    ef2.aircraftUnit.steps = 1

    // check for reorg between CD1 CAP RETURN and Kaga Flight Deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, 0, ef2)

    checkAllUSBoxesForReorganizationCAP(
      controller,
      ef1,
      GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN,
      GlobalUnitsModel.Side.US,
      false
    )

    let reorgUnits = controller.getReorganizationUnits(ef1.name)
    expect(reorgUnits.length).toEqual(2)

    expect(reorgUnits[0].name).toEqual(ef1.name)
    expect(reorgUnits[1].name).toEqual(ef2.name)

    // same but now reorg with Enterpise Hangar
    ef1.aircraftUnit.steps = 1
    ef2.aircraftUnit.steps = 1

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, ef1)

    reorgUnits = controller.getReorganizationUnits(ef1.name)
    expect(reorgUnits.length).toEqual(2)

    expect(reorgUnits[0].name).toEqual(ef1.name)
    expect(reorgUnits[1].name).toEqual(ef2.name)
  })

  test("Reorganize 1 Step Air Units across boxes TF16 CAP RETURN - ENTERPRISE FLIGHT DECK, auto reorganize", () => {
    ef1.aircraftUnit.steps = 1
    ef1.aircraftUnit.steps = 1

    // check for reorg between CD1 CAP RETURN and Kaga Flight Deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, ef2)

    checkAllUSBoxesForReorganizationCAP(
      controller,
      ef1,
      GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN,
      GlobalUnitsModel.Side.US,
      true
    )

    let reorgUnits = controller.getReorganizationUnits(ef1.name)
    expect(reorgUnits).toBeNull

    // auto reorganize: air unit on flight deck eliminated to make room for combined
    // 2 step unit returning from CAP
    expect((ef1.aircraftUnit.steps = 2))
    expect((ef2.aircraftUnit.steps = 0))
  })
})
