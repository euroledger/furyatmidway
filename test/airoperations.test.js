import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalGameState from "../src/model/GlobalGameState"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"

describe("Air Operations tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Initiative Determination", () => {
    GlobalGameState.airOperationPoints.japan  = 2
    GlobalGameState.airOperationPoints.us = 3

    let sideWithInitiative = controller.determineInitiative(1, 4)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    sideWithInitiative = controller.determineInitiative(4, 1)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)

    sideWithInitiative = controller.determineInitiative(3, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    GlobalGameState.airOperationPoints.japan  = 2
    GlobalGameState.airOperationPoints.us = 2
    sideWithInitiative = controller.determineInitiative(3, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)

    sideWithInitiative = controller.determineInitiative(2, 2)
    expect(sideWithInitiative).toBeNull()

    GlobalGameState.airOperationPoints.japan  = 0
    GlobalGameState.airOperationPoints.us = 2
    sideWithInitiative = controller.determineInitiative(5, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    GlobalGameState.airOperationPoints.japan  = 1
    GlobalGameState.airOperationPoints.us = 0
    sideWithInitiative = controller.determineInitiative(5, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)
  })

})