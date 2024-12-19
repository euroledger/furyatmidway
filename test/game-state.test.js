import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import GlobalGameState from "../src/model/GlobalGameState"
import { createFleetMove } from "./TestUtils"
import { distanceBetweenHexes, mapHexToIndex } from "../src/components/HexUtils"
import { AIR_STRATEGIES, GAME_STRATEGIES, getAirSetupBoxes } from "../src/UIEvents/AI/USAirUnitSetupBots"

describe("Numeric Evaluation Of State of Each Side's Naval and Air Power", () => {
  let controller
  let counters
  let ef1, ef2, edb1, edb2, etb, hf1, hf2, hdb1, hdb2, htb
  let mf1, mf2, mdb, mdb2, mtb, mhb1, mhb2
  let yf1, yf2, ydb1, ydb2, ytb

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
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")
    mhb1 = counters.get("Midway-B26-B")
  })

  test("Variables Used in Air Operations - US", () => {
    createFleetMove(controller, 1, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // A,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
    expect(distanceBetweenCSFand1AF).toEqual(6)

    const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)
    expect(distanceBetweenMidwayand1AF).toEqual(5)

    const hexIndexCSF = mapHexToIndex(locationCSF.currentHex)
    expect(hexIndexCSF).toEqual(39)

    const hexIndex1AF = mapHexToIndex(location1AF.currentHex)
    expect(hexIndex1AF).toEqual(2)

    console.log("Strategy=", strategy)

    const strategy = GAME_STRATEGIES.MIXED
    console.log("Strategy=", strategy)
    const airStrategy = AIR_STRATEGIES[strategy]

    const airBoxesEnterprise = getAirSetupBoxes(GlobalGameState.US_CARRIERS[0], airStrategy)
    const airBoxesHornet = getAirSetupBoxes(GlobalGameState.US_CARRIERS[1], airStrategy)
    const airBoxesYorktown = getAirSetupBoxes(GlobalGameState.US_CARRIERS[2], airStrategy)
    const airBoxesMidway = getAirSetupBoxes(GlobalGameState.US_CARRIERS[3], airStrategy)

    console.log("airBoxesEnterprise=", airBoxesEnterprise)
    console.log("airBoxesHornet=", airBoxesHornet)
    console.log("airBoxesYorktown=", airBoxesYorktown)
    console.log("airBoxesMidway=", airBoxesMidway)
    expect(airBoxesEnterprise).toEqual([0, 1, 1, 2, 2])
    expect(airBoxesHornet).toEqual([0, 0, 3, 4, 3])
    expect(airBoxesYorktown).toEqual([5, 6, 6, 7, 7])
    expect(airBoxesMidway).toEqual([8, 8, 9, 10, 9, 9])

    
  })
})
