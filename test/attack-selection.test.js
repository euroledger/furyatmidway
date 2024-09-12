import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"
import GlobalGameState from "../src/model/GlobalGameState"
import { displayAttackTargetPanel } from "../src/GameStateHandler"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

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
})
