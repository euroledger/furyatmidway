import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"
import GlobalGameState from "../src/model/GlobalGameState"
import Controller from "../src/controller/Controller"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Turn 3 - All IJN Carriers Sunk, US Victory", () => {
    GlobalGameState.gameTurn = 3

    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)

    let winner = controller.victoryCheck()

    expect(winner).toEqual(GlobalUnitsModel.Side.US)
  })

  test("Turn 3 - 2 IJN Carriers Left, 1 US, No winner", () => {
    GlobalGameState.gameTurn = 3

    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

    let winner = controller.victoryCheck()
    expect(winner).toBeNull()
  })

  test("Turn 3 - 3 IJN Carriers Left, 1 US, Japan Victory", () => {
    GlobalGameState.gameTurn = 3

    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

    let winner = controller.victoryCheck()
    expect(winner).toEqual(GlobalUnitsModel.Side.JAPAN)
  })

  test("Turn 7 - 1 IJN Carriers Sunk, 2 US Carriers Sunk, Midway US Controlled, US Victory 3-2", () => {
    GlobalGameState.gameTurn = 7

    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

    let winner = controller.victoryCheck()
    expect(winner).toEqual(GlobalUnitsModel.Side.US)
  })

  test("Turn 7 - 1 IJN Carriers Sunk, 2 US Carriers Sunk, Midway Japanese Controlled, Japan Victory 4-1", () => {
    GlobalGameState.gameTurn = 7

    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

    GlobalGameState.midwayControl = GlobalUnitsModel.Side.JAPAN

    let winner = controller.victoryCheck()
    expect(winner).toEqual(GlobalUnitsModel.Side.JAPAN)
  })
})
