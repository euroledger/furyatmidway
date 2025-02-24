import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import GlobalGameState from "../src/model/GlobalGameState"
import {
  allocateCAPDamageToAttackingStrikeUnit,
  allocateAAADamageToAttackingStrikeUnit,
  doTargetSelection,
} from "../src/UIEvents/AI/USAirCombatBot"

describe("Combat Selections by US Bot", () => {
  let controller
  let counters
  let ef1, ef2, edb1, edb2, etb, hf1, hf2, hdb1, hdb2, htb
  let mf1, mf2, mdb, mdb2, mtb, mhb1, mhb2
  let yf1, yf2, ydb1, ydb2, ytb
  let kaf1, aaf1, haf1, saf1, kaf2, aaf2

  function setInitialAirUnitLocations() {
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, etb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 0, hf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 1, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGAR, 0, hdb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGAR, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 0, yf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 0, yf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 1, ytb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR, 0, ydb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR, 1, ydb2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_CAP, 0, mf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 0, mf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 1, mdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, 2, mdb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR, 0, mtb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR, 1, mhb1)
  }
  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 0)

    yf1 = counters.get("Yorktown-F4F4-1")
    yf2 = counters.get("Yorktown-F4F4-2")
    ydb1 = counters.get("Yorktown-SBD3-1")
    ydb2 = counters.get("Yorktown-SBD3-2")
    ytb = counters.get("Yorktown-TBD1")

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

    mf1 = counters.get("Midway-F4F3")
    mf2 = counters.get("Midway-F2A-3")
    mdb = counters.get("Midway-SBD-2") // *
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1") // *
    mhb1 = counters.get("Midway-B26-B") // *

    kaf1 = counters.get("Kaga-A6M-2b-1")
    aaf1 = counters.get("Akagi-A6M-2b-1")
    kaf2 = counters.get("Kaga-A6M-2b-2")
    aaf2 = counters.get("Akagi-A6M-2b-2")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    saf1 = counters.get("Soryu-A6M-2b-1")
  })

  test("US Target Determination", async () => {
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 1)

    let ret = controller.getDamageToCarriersByTF(GlobalUnitsModel.Side.JAPAN)

    expect(ret.cd1Damage).toEqual(4)
    expect(ret.cd2Damage).toEqual(1)

    // Set Akagi to be the DMCV Carrier for IJN
    GlobalGameState.jpDMCVCarrier = GlobalUnitsModel.Carrier.AKAGI

    ret = controller.getDamageToCarriersByTF(GlobalUnitsModel.Side.JAPAN)

    expect(ret.cd1Damage).toEqual(2)
    expect(ret.cd2Damage).toEqual(1)

    // SET CAR DIV 1 CAP UNITS
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 1, kaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 3, kaf2)
    //  SET CAR DIV 2 CAP UNITS
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 1, saf1)

    ret = controller.getNumStepsInCAPBoxesByTF(GlobalUnitsModel.Side.JAPAN)
    expect(ret.cd1).toEqual(8)
    expect(ret.cd2).toEqual(4)

    // Set one fighter unit to be reduced
    aaf1.aircraftUnit.steps = 1
    const { cd1 } = controller.getNumStepsInCAPBoxesByTF(GlobalUnitsModel.Side.JAPAN)
    expect(cd1).toEqual(7)
  })

  test("US CAP Damage Allocation (to Strike Units)", async () => {
    // Enterprise 5-plane strike group (just for test)
    let strikeUnits = [edb1, edb2, ef1, ef1, etb]
    let selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(ef1)

    // Midway 3-plane strike group
    strikeUnits = [mdb, mtb, mhb1]
    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mhb1)

    mhb1.aircraftUnit.steps = 0
    strikeUnits = [mdb, mtb]

    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)

    expect(selection.unit).toEqual(mdb)

    mdb.aircraftUnit.steps = 1

    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mdb)

    mdb.aircraftUnit.steps = 0

    strikeUnits = [mtb]

    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mtb)

    // Midway 3-plane strike group with fighter escort
    strikeUnits = [mtb, mhb1, mf1]
    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)

    expect(selection.unit).toEqual(mf1)

    mf1.aircraftUnit.steps = 0
    strikeUnits = [mhb1, mtb]

    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mhb1)

    mhb1.aircraftUnit.steps = 0
    strikeUnits = [mtb]

    selection = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mtb)
  })

  test("US AAA Damage Allocation (to Strike Units)", async () => {
    // Enterprise 4-plane strike group
    let strikeUnits = [edb1, edb2, etb]
    let selection = await allocateAAADamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(etb)

    // Midway 3-plane strike group
    strikeUnits = [mdb, mtb, mhb1]
    selection = await allocateAAADamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mhb1)

    mhb1.aircraftUnit.steps = 0
    strikeUnits = [mdb, mtb]

    selection = await allocateAAADamageToAttackingStrikeUnit(strikeUnits)

    expect(selection.unit).toEqual(mdb)

    mdb.aircraftUnit.steps = 1

    selection = await allocateAAADamageToAttackingStrikeUnit(strikeUnits)
    expect(selection.unit).toEqual(mdb)
  })

  test("US Air Strike Carrier Target Selection", async () => {
    // Enterprise 2-plane strike group
    let strikeUnits = [edb1, edb2]

    // No hits to any Japanese carriers -> random selection (pass in test die rolls)
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1

    let carrierTargets = await doTargetSelection(
      controller,
      strikeUnits,
      GlobalUnitsModel.Side.JAPAN,
      { setAttackAirCounterUpdate: undefined },
      [0, 1]
    )
    expect(carrierTargets[0]).toEqual(GlobalUnitsModel.Carrier.AKAGI)
    expect(carrierTargets[1]).toEqual(GlobalUnitsModel.Carrier.KAGA)

    // Kaga 2 hits - both attack units target the damaged carrier 
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 2)

    carrierTargets = await doTargetSelection(
      controller,
      strikeUnits,
      GlobalUnitsModel.Side.JAPAN,
      { setAttackAirCounterUpdate: undefined },
      [0, 1]
    )
    expect(carrierTargets[0]).toEqual(GlobalUnitsModel.Carrier.KAGA)
    expect(carrierTargets[1]).toEqual(GlobalUnitsModel.Carrier.KAGA)

  })
})
