import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"
import GlobalGameState from "../src/model/GlobalGameState"
import { createFleetMove } from "./TestUtils"
import HexCommand from "../src/commands/HexCommand"
import {
  doAttackFireRolls,
} from "../src/DiceHandler"
import { doStrikeBox } from "../src/controller/AirOperationsHandler"

describe("Controller tests", () => {
  let controller
  let counters
  let saf1, saf2, sdb, stb
  let haf1, haf2, hdb, htb
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb1

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
    GlobalGameState.totalMidwayHits = 0
    GlobalGameState.midwayBox0Damaged = false
    GlobalGameState.midwayBox1Damaged = false
    GlobalGameState.midwayBox2Damaged = false
  })

  function addUnitToStrikeGroup(name, box, index) {
    let counterData = counters.get(name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: box,
        counterData,
        index,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })
  }

  function strikeGroupMoveUS(box, q, r) {
    const strikeCounter = {
      name: "US-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/usStrike1.png",
      width: "2.1%",
      box: box,
      side: GlobalUnitsModel.Side.US,
      loading: false,
      moved: false,
      attacked: false,
      turnmoved: undefined,
      turnattacked: undefined
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
            q: q,
            r: r,
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
  }
  function placeStrikeGroupsOnMapJapan(box, location) {
    const strikeCounter = {
      name: "JP-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/jpStrike1.png",
      width: "2.1%",
      box: box,
      side: GlobalUnitsModel.Side.JAPAN,
      moved: false,
      attacked: false,
      turnmoved: undefined,
      turnattacked: undefined
    }

    let to = {
      currentHex: {
        col: 5,
        q: 7,
        r: 2,
        row: "G",
        side: "jp",
        x: 120,
        y: 200,
      },
    }

    if (location) {
      to = location
    }
    //  Strike Group moves onto map - test location, moved etc.
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeCounter,
        from: HexCommand.OFFBOARD,
        to: to,
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })
  }

  function setupUSStrikeGroups(q, r) {
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US

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
    createFleetMove(controller, 7, 2, "1AF-USMAP", GlobalUnitsModel.Side.US) // G-5

    addUnitToStrikeGroup(edb1.name, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 0)
    addUnitToStrikeGroup(etb.name, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 1)
    strikeGroupMoveUS(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, q, r)
  }

  function setupJapanStrikeGroups() {
    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")
    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")

    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")
    sdb = counters.get("Soryu-D3A-1")
    stb = counters.get("Soryu-B5N-2")

    addUnitToStrikeGroup(haf1.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 0)
    addUnitToStrikeGroup(haf2.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 1)
    addUnitToStrikeGroup(hdb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 2)
    addUnitToStrikeGroup(htb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 3)
    addUnitToStrikeGroup(saf1.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 4)
    addUnitToStrikeGroup(saf2.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 5)
    addUnitToStrikeGroup(sdb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 6)
    addUnitToStrikeGroup(stb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 7)

    placeStrikeGroupsOnMapJapan(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    createFleetMove(controller, 7, 1, "1AF", GlobalUnitsModel.Side.US) // G-4
    createFleetMove(controller, 7, 2, "CSF", GlobalUnitsModel.Side.US) // G-5
  }
  test("US Strike Group Attacks, same AIR OP as moved, units move to RETURN 1", () => {
    setupUSStrikeGroups(7,2)
    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    GlobalGameState.currentCarrierAttackTarget = GlobalUnitsModel.Carrier.KAGA
    controller.setAirUnitTarget(edb1, GlobalUnitsModel.Carrier.KAGA)

    expect(GlobalGameState.carrierTarget1).toEqual(GlobalUnitsModel.Carrier.KAGA)

    controller.setAirUnitTarget(edb2, GlobalUnitsModel.Carrier.AKAGI)

    expect(GlobalGameState.carrierTarget1).toEqual(GlobalUnitsModel.Carrier.KAGA)
    expect(GlobalGameState.carrierTarget2).toEqual(GlobalUnitsModel.Carrier.AKAGI)

    // move US strike group to same hex as Japan 1AF
    let location2 = {
      currentHex: {
        q: 7,
        r: 2,
      },
    }
    let dieRolls = [3, 4]

    doAttackFireRolls(controller, dieRolls)

    for (let unit of unitsInGroup) {
        doStrikeBox(controller, unit.name, GlobalUnitsModel.Side.US, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)

        let destinations = controller.getValidAirUnitDestinations(unit.name)
        expect(destinations).toEqual(GlobalUnitsModel.AirBox.US_TF16_RETURN1)
    }
  })

  test("US Strike Group Attacks, different AIR OP turn to moved, units move to RETURN 2", () => {
    setupUSStrikeGroups(7,1)
    GlobalGameState.gameTurn = 2

    strikeGroupMoveUS(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 7, 2)

    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    GlobalGameState.currentCarrierAttackTarget = GlobalUnitsModel.Carrier.KAGA
    controller.setAirUnitTarget(edb1, GlobalUnitsModel.Carrier.KAGA)

    expect(GlobalGameState.carrierTarget1).toEqual(GlobalUnitsModel.Carrier.KAGA)

    controller.setAirUnitTarget(edb2, GlobalUnitsModel.Carrier.AKAGI)

    expect(GlobalGameState.carrierTarget1).toEqual(GlobalUnitsModel.Carrier.KAGA)
    expect(GlobalGameState.carrierTarget2).toEqual(GlobalUnitsModel.Carrier.AKAGI)

    // FIRST TURN 
    // move US strike group to hex adjacent to JAPAN 1AF
    let location2 = {
      currentHex: {
        q: 7,
        r: 1,
      },
    }
    let dieRolls = [3, 4]

    doAttackFireRolls(controller, dieRolls)

    for (let unit of unitsInGroup) {
        doStrikeBox(controller, unit.name, GlobalUnitsModel.Side.US, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)

        let destinations = controller.getValidAirUnitDestinations(unit.name)
        expect(destinations).toEqual(GlobalUnitsModel.AirBox.US_TF16_RETURN1)
    }
  })
})
