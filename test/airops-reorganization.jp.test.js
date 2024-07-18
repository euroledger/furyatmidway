import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import {
  getStep1Fighters,
  getStep1DiveBombers,
  getStep1TorpedoPlanes,
  checkForReorganization,
} from "../src/controller/AirOperationsHandler"

describe("Air Operations tests for Reorganization", () => {
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

  test.skip("1 Step Air Units", () => {
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

  test.skip("Reorganize 1 Step Air Units within the same box (CD1 RETURN1), no auto reorganize", () => {
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

  test.skip("Reorganize 1 Step Air Units within the same box (CD1 RETURN1), auto reorganize", () => {
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
    // Test reorg in TO box
    kdb.aircraftUnit.steps = 1
    adb.aircraftUnit.steps = 1

    let unitsToReorganize = checkForReorganization(
      controller,
      GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
      GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
      false
    )
    expect(unitsToReorganize.length).toEqual(2)

    // We have two step 1 fighters = one in the (Kaga) hangar one in the (CD1) return1 box
    // These can be reorganized to free up a slot on the carrier (which is at capacity)
    // aaf2 can then land on the Kaga (goes to Hangar)
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR, 0, aaf1)
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, kdb)

    // kdb.aircraftUnit.steps = 2
    // adb.aircraftUnit.steps = 2

    // aaf1.aircraftUnit.steps = 1
    // aaf2.aircraftUnit.steps = 1

    // unitsToReorganize = checkForReorganization(
    //   controller,
    //   GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
    //   GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
    //   false
    // )
    // expect(unitsToReorganize.length).toEqual(2)
  })

  test("Reorganize 1 Step Air Units across boxes CD1 RETURN1 - AKAGI HANGAR, auto reorganize", () => {})

  test("Reorganize 1 Step Air Units across boxes CD1 CAP RETURN - AKAGI FLIGHT DECK, auto reorganize", () => {
    // TODO once CAP return code written
  })
})
