import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import { doMidwayLandBattleRoll } from "../src/DiceHandler"
import GlobalGameState from "../src/model/GlobalGameState"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"

describe("Midway Invasion tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Japan and US Alternate Rolls in Invasion Battle", () => {
    GlobalGameState.midwayGarrisonLevel = 6
    GlobalGameState.midwayInvasionLevel = 5

    // first roll - JAPAN (4) - HIT
    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    let rolls=[4]

    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(5)

    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
    rolls=[1]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(5)
    expect(GlobalGameState.midwayInvasionLevel).toEqual(4)


    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    rolls=[1]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(4)

    // US - MISS
    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
    rolls=[6]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayInvasionLevel).toEqual(4)

    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    rolls=[1]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(3)

    // US - MISS
    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
    rolls=[6]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayInvasionLevel).toEqual(4)

    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    rolls=[1]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(2)

    // US - MISS
    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
    rolls=[6]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayInvasionLevel).toEqual(4)

    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    rolls=[1]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(1)

    // US - MISS
    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
    rolls=[6]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayInvasionLevel).toEqual(4)

    // JAPAN HIT - reduces garrison to 0. Japan Invasion successful, Japan controls Midway
    GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    rolls=[1]
    doMidwayLandBattleRoll(rolls)
    expect(GlobalGameState.midwayGarrisonLevel).toEqual(0)
    expect(GlobalGameState.midwayControl).toEqual(GlobalUnitsModel.Side.JAPAN)
  })
})
