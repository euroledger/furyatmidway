import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"
import GlobalGameState from "../src/model/GlobalGameState"
import { displayAttackTargetPanel } from "../src/GameStateHandler"
import { createFleetMove } from "./TestUtils"
import HexCommand from "../src/commands/HexCommand"

describe("Controller test.skips", () => {
  let controller
  let counters
  let saf1, saf2, sdb, stb
  let haf1, haf2, hdb, htb
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb1

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
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

  function placeStrikeGroupsOnMapUS(box) {
    const strikeCounter = {
      name: "US-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/usStrike1.png",
      width: "2.1%",
      box: box,
      side: GlobalUnitsModel.Side.US,
    }

    GlobalGameState.attackingStrikeGroup = strikeCounter

    //  Strike Group moves onto map - test.skip location, moved etc.
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
  }
  function setupStrikeGroups() {


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

    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")
    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")

    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")
    sdb = counters.get("Soryu-D3A-1")
    stb = counters.get("Soryu-B5N-2")

    addUnitToStrikeGroup(edb1.name, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 0)
    addUnitToStrikeGroup(edb2.name, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 1)
    placeStrikeGroupsOnMapUS(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    createFleetMove(controller, 7, 2, "1AF", GlobalUnitsModel.Side.JAPAN) // G-5
  }

  test("Display Attack Target Selection Panel if Task Force under attack contains two carriers", () => {
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    let display = displayAttackTargetPanel(controller)
    expect(display).toEqual(true)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(true)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_16
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(true)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_17
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.MIDWAY
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)
  })

  test("Do not display Attack Target Selection Panel if Task Force under attack contains two carriers, but one sunk", () => {
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    let display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_16
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)
  })

  test("Auto Select target if only one viable carrier to attack (or Midway)", () => {
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_17
    let display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    let target = controller.getTargetForAttack()
    expect(target).toEqual(GlobalUnitsModel.Carrier.YORKTOWN)

    // Hornet sunk, TF16 target auto set to Enterprise
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_16
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    target = controller.getTargetForAttack()
    expect(target).toEqual(GlobalUnitsModel.Carrier.ENTERPRISE)

    // Akagi sunk, CD1 target auto set to Kaga
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    target = controller.getTargetForAttack()
    expect(target).toEqual(GlobalUnitsModel.Carrier.KAGA)

    // Soryu sunk, CD2 target auto set to Hiryu
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    target = controller.getTargetForAttack()
    expect(target).toEqual(GlobalUnitsModel.Carrier.HIRYU)

    // Midway auto set to target
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.MIDWAY
    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    target = controller.getTargetForAttack()
    expect(target).toEqual(GlobalUnitsModel.Carrier.MIDWAY)
  })

  test("No target if all carriers in TF sunk", () => {
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_17
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    let display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    let target = controller.getTargetForAttack()
    expect(target).toBeNull

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    target = controller.getTargetForAttack()
    expect(target).toBeNull

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)

    display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    target = controller.getTargetForAttack()
    expect(target).toBeNull
  })

  test("Assign all air units (except fighters) in strike group to auto selected target", () => {
    setupStrikeGroups()
    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    let display = displayAttackTargetPanel(controller)
    expect(display).toEqual(false)

    let carrierAttackTarget = controller.getTargetForAttack()
    expect(carrierAttackTarget).toEqual(GlobalUnitsModel.Carrier.KAGA)

    // move US strike group to same hex as Japan 1AF
    let location2 = {
      currentHex: {
        q: 7,
        r: 2,
      },
    }
    const strikeGroupsAtLocation = controller.getAllStrikeGroupsInLocation(location2, GlobalUnitsModel.Side.US)
    expect(strikeGroupsAtLocation[0].name).toEqual("US-SG1")


    controller.autoAssignTargets()
    let target = controller.getAirUnitTarget(edb1)
    expect(target).toEqual(GlobalUnitsModel.Carrier.KAGA)

    target = controller.getAirUnitTarget(edb2)
    expect(target).toEqual(GlobalUnitsModel.Carrier.KAGA)
  })
})
