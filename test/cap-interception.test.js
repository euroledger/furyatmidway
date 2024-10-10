import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { createFleetMove } from "./testUtils"
import HexCommand from "../src/commands/HexCommand"
import GlobalGameState from "../src/model/GlobalGameState"
import { doCAP, doDamageAllocation, doFighterCounterattack } from "../src/DiceHandler"

describe("CAP Interception tests", () => {
  let controller
  let counters
  let saf1, saf2
  let haf1, haf2
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb1
  let mf1, mf2, mdb, mdb2, mtb, mhb1, mhb2

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4
    createFleetMove(controller, 7, 2, "1AF", GlobalUnitsModel.Side.JAPAN) // G-5

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

    mf1 = counters.get("Midway-F4F3")
    mf2 = counters.get("Midway-F2A-3")
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")
    mhb1 = counters.get("Midway-B26-B")
    mhb2 = counters.get("Midway-B17-E")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")

    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")

    setupUSStrikeGroups()
    setupJapaneseCAP()
  })

  function setupUSStrikeGroups() {
    // 1. Add air units to strike boxes

    // Test out a 2 unit strike from a carrier and a 3 unit strike from Midway

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1, 1, hdb1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2, 0, mf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2, 1, mtb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2, 2, mdb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3, 0, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3, 1, edb2)

    // Move strike groups into Japanese 1AF fleet location
    const strikeCounter = {
      name: "US-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/usStrike1.png",
      width: "2.1%",
      box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
      side: GlobalUnitsModel.Side.US,
    }

    GlobalGameState.attackingStrikeGroup = strikeCounter

    //  Strike Group moves onto map - test location, moved etc.
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeCounter,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 5,
            q: 7,
            r: 2,
            row: "G",
            side: "us",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    // 3. set target of strike
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
  }

  function setupJapaneseCAP() {
    // Put all four fighter units of CD2 into CAP
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 1, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 2, saf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 3, saf2)
  }

  test("Enterprise Strike Against Japanese CD2", () => {
    let units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    expect(units.length).toEqual(2)

    // determine if there are fighters in the CAP box
    const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, GlobalUnitsModel.Side.JAPAN)
    expect(capBox).toEqual(GlobalUnitsModel.AirBox.JP_CD2_CAP)

    const capUnits = controller.getAllAirUnitsInBox(capBox)
    expect(capUnits.length).toEqual(4)

    // defender selects the two Hiryu CAP fighter units
    haf1.aircraftUnit.intercepting = true
    haf2.aircraftUnit.intercepting = true

    const defenders = controller.getAllCAPDefenders(GlobalUnitsModel.Side.JAPAN)
    expect(defenders.length).toEqual(2)

    const defendingSteps = controller.getNumDefendingSteps(GlobalUnitsModel.Side.JAPAN)
    expect(defendingSteps).toEqual(4)

    let rolls = [1, 5, 4, 1]
    doCAP(controller, defenders, true, rolls)

    expect(GlobalGameState.capHits).toEqual(2)
  })

  test("Enterprise Strike Against Japanese CD2 with no Fighter Escort", () => {
    let units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_3)
    expect(units.length).toEqual(2)

    const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, GlobalUnitsModel.Side.JAPAN)
    expect(capBox).toEqual(GlobalUnitsModel.AirBox.JP_CD2_CAP)

    const capUnits = controller.getAllAirUnitsInBox(capBox)
    expect(capUnits.length).toEqual(4)

    // defender selects the two Hiryu CAP fighter units
    haf1.aircraftUnit.intercepting = true
    haf2.aircraftUnit.intercepting = true

    const defenders = controller.getAllCAPDefenders(GlobalUnitsModel.Side.JAPAN)
    expect(defenders.length).toEqual(2)

    const defendingSteps = controller.getNumDefendingSteps(GlobalUnitsModel.Side.JAPAN)
    expect(defendingSteps).toEqual(4)

    let rolls = [1, 5, 4, 1]

    doCAP(controller, defenders, false, rolls)

    expect(GlobalGameState.capHits).toEqual(3)
  })

  test("Enterprise Strike Against Japanese CD2 - Damage Allocation", () => {
    // defender selects the two Hiryu CAP fighter units
    haf1.aircraftUnit.intercepting = true
    haf2.aircraftUnit.intercepting = true

    const defenders = controller.getAllCAPDefenders(GlobalUnitsModel.Side.JAPAN)

    let rolls = [1, 5, 4, 1]

    doCAP(controller, defenders, false, rolls)

    expect(GlobalGameState.capHits).toEqual(3)

    doDamageAllocation(controller, etb)
    expect(etb.aircraftUnit.steps === 1)

    doDamageAllocation(controller, etb)
    expect(etb.aircraftUnit.steps === 0)
  })

  test("Enterprise Strike Against CD2 - Fighter Escort Counterattack", () => {
    haf1.aircraftUnit.intercepting = true
    haf2.aircraftUnit.intercepting = true

    const defenders = controller.getAllCAPDefenders(GlobalUnitsModel.Side.JAPAN)

    let rolls = [6, 5, 4, 1]

    // one hit from CAP on Enterprise fighter escort
    doCAP(controller, defenders, true, rolls)

    expect(GlobalGameState.capHits).toEqual(1)

    doDamageAllocation(controller, ef1)
    expect(etb.aircraftUnit.steps === 1)

    // Now 1 remaining step of fighter can attack the CAP units
    rolls = [2]

    GlobalGameState.taskForceTarget = "1AF"
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US

    doFighterCounterattack(controller, rolls)
    expect(GlobalGameState.fighterHits).toEqual(1)

    doDamageAllocation(controller, haf1)
    expect(haf1.aircraftUnit.steps === 1)
  })
})
