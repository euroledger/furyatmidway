import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import GlobalGameState from "../src/model/GlobalGameState"
import { createFleetMove } from "./TestUtils"
import { distanceBetweenHexes, mapHexToIndex } from "../src/components/HexUtils"
import { getInitialGameStateAsArray } from "../src/controller/gameStateUtils"
import { AIR_STRATEGIES, GAME_STRATEGIES, getAirSetupBoxes } from "../src/UIEvents/AI/USAirUnitSetupBots"
import { usBoxToIndex } from "../src/AirUnitData"
import { airUnitLocationsAsArray } from "../src/controller/gameStateUtils"
import {
  generateUSAirOperationsMovesCarriers,
  generateUSAirOperationsMovesMidway,
  getFirstAirOpTargetsInRange,
  sortStrikeGroups,
  moveStrikeGroups,
  getAllTargetsInRange,
  numTargetsInRange,
} from "../src/UIEvents/AI/USAirOperationsBot"
import { isFirstAirOpForStrike, firstAirOpUSStrikeRegion } from "../src/controller/AirOperationsHandler"

describe("Numeric Evaluation Of State of Each Side's Naval and Air Power", () => {
  let controller
  let counters
  let ef1, ef2, edb1, edb2, etb, hf1, hf2, hdb1, hdb2, htb
  let mf1, mf2, mdb, mdb2, mtb, mhb1, mhb2
  let yf1, yf2, ydb1, ydb2, ytb

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
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")
    mhb1 = counters.get("Midway-B26-B")
  })

  test("Variables Used in Air Operations - US", () => {
    createFleetMove(controller, 1, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // A,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    const strategy = GAME_STRATEGIES.MIXED

    const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    const locationIJNDMDCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
    const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.JAPAN)
    const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

    expect(locationIJNDMDCV).toBeUndefined()
    expect(locationUSDMCV).toBeUndefined()
    expect(locationMIF).toBeUndefined()

    const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
    expect(distanceBetweenCSFand1AF).toEqual(6)

    const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)
    expect(distanceBetweenMidwayand1AF).toEqual(5)

    const distanceBetweenCSFandIJNDMCV = -1
    const distanceBetweenCSFandMIF = -1
    const distanceBetween1AFandUSDMCV = -1

    const hexIndexCSF = mapHexToIndex(locationCSF.currentHex)
    expect(hexIndexCSF).toEqual(39)

    const hexIndex1AF = mapHexToIndex(location1AF.currentHex)
    expect(hexIndex1AF).toEqual(2)

    console.log("Strategy=", strategy)

    const airStrategy = AIR_STRATEGIES[strategy]

    console.log("Air Strategy=", airStrategy)

    const airBoxesEnterprise = getAirSetupBoxes(GlobalGameState.US_CARRIERS[0], airStrategy)
    const airBoxesHornet = getAirSetupBoxes(GlobalGameState.US_CARRIERS[1], airStrategy)
    const airBoxesYorktown = getAirSetupBoxes(GlobalGameState.US_CARRIERS[2], airStrategy)
    const airBoxesMidway = getAirSetupBoxes(GlobalGameState.US_CARRIERS[3], airStrategy)

    expect(airBoxesEnterprise).toEqual([0, 1, 1, 2, 2])
    expect(airBoxesHornet).toEqual([0, 0, 3, 4, 3])
    expect(airBoxesYorktown).toEqual([5, 6, 6, 7, 7])
    expect(airBoxesMidway).toEqual([8, 8, 9, 10, 9, 9])
  })

  test("Get Game State Variables as Array - US", () => {
    createFleetMove(controller, 1, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // A,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4
    const array = getInitialGameStateAsArray(controller, GAME_STRATEGIES.MIXED)

    expect(array).toEqual([
      1, 2, 39, 2, -1, -1, -1, 6, 5, -1, -1, -1, 0, 1, 1, 2, 2, 0, 0, 3, 4, 3, 5, 6, 6, 7, 7, 8, 8, 9, 10, 9, 9, 12, 12,
      38, 32, 3, 4,
    ])

    // set air units to various locations and get new game state array

    let i = usBoxToIndex(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(i).toEqual(2)

    i = usBoxToIndex(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1)
    expect(i).toEqual(12)

    const strategy = GAME_STRATEGIES.MIXED
    const airStrategyArray = AIR_STRATEGIES[strategy].flat()

    setInitialAirUnitLocations()

    let unitArray = airUnitLocationsAsArray(controller, GlobalUnitsModel.Side.US)

    // 1. START STATE
    // expect(unitArray).toEqual([0, 1, 1, 2, 2, 0, 3, 3, 4, 4, 5, 6, 7, 7, 6, 8, 9, 9, 9, 10, 10])
    // 2. ACTION: Enterprise SBD-1 to Strike Box 1
    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1, edb1)

    // 3. NEW STATE
    unitArray = airUnitLocationsAsArray(controller, GlobalUnitsModel.Side.US)
    // expect(unitArray).toEqual([0, 1, 12, 2, 2, 0, 3, 3, 4, 4, 5, 6, 7, 7, 6, 8, 9, 9, 9, 10, 10])
  })

  test("Create Air Unit Moves Using US Air Operations Bot", async () => {
    createFleetMove(controller, 3, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // C,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, ef2)

    let usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks()

    // console.log("UNITS ON FLIGHT DECKS=", usAirUnitsOnFlightDecks.map((unit) => unit.name))

    expect(usAirUnitsOnFlightDecks.length).toEqual(9) // all units including 3 on Midway runway
    // Set Up Strike Groups first

    usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(false)
    expect(usAirUnitsOnFlightDecks.length).toEqual(6)

    usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(true)
    expect(usAirUnitsOnFlightDecks.length).toEqual(3) // fighters only

    await generateUSAirOperationsMovesCarriers(controller, { setTestUpdate: undefined }, true)

    // should have three strike groups, one from each carrier, each containing two units

    // test that this has the 3 strike groups etc correctly set
    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)
    expect(unitsInGroup[0].name).toEqual(edb1.name)
    expect(unitsInGroup[1].name).toEqual(edb2.name)

    strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_2)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
    expect(airUnits.length).toEqual(2)
    expect(airUnits[0]).toEqual(ef2)
    expect(airUnits[1]).toEqual(etb)

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
    expect(airUnits.length).toEqual(2)
    expect(airUnits[0]).toEqual(hdb2)
    expect(airUnits[1]).toEqual(htb)

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)
    expect(airUnits.length).toEqual(2)
    expect(airUnits[0]).toEqual(ydb1)
    expect(airUnits[1]).toEqual(ydb2)
  })

  test("Create Enterprise Strike Group SBD plus TBD Combination", async () => {
    createFleetMove(controller, 3, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // C,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, ef2)

    let usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks()

    // console.log("UNITS ON FLIGHT DECKS=", usAirUnitsOnFlightDecks.map((unit) => unit.name))

    expect(usAirUnitsOnFlightDecks.length).toEqual(9) // all units including 3 on Midway runway
    // Set Up Strike Groups first

    usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(false)
    expect(usAirUnitsOnFlightDecks.length).toEqual(6)

    usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(true)
    expect(usAirUnitsOnFlightDecks.length).toEqual(3) // fighters only

    await generateUSAirOperationsMovesCarriers(controller, { setTestUpdate: undefined }, true)

    // test that this has the strike group etc correctly set
    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)
    expect(unitsInGroup[0].name).toEqual(edb1.name)
    expect(unitsInGroup[1].name).toEqual(etb.name)

    // let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
    // expect(airUnits.length).toEqual(2)
    // expect(airUnits[0]).toEqual(ef2)
    // expect(airUnits[1]).toEqual(edb2)
  })

  test("Create Air Unit Moves for Midway Air Units Using US Air Operations Bot", async () => {
    createFleetMove(controller, 3, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // C,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()

    let usAirUnitsOnMidwayRunways = controller.getAllUnitsOnMidwayRunways()
    expect(usAirUnitsOnMidwayRunways.length).toEqual(3)

    // Set Up Strike Groups first

    await generateUSAirOperationsMovesMidway(controller, { setTestUpdate: undefined }, true)

    // Will have new airUnitLocationsArray after this operation. See above test

    // test that this has the 3 strike groups etc correctly set
    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(3)
    expect(unitsInGroup[0].name).toEqual(mdb.name)
    expect(unitsInGroup[1].name).toEqual(mf1.name)
    expect(unitsInGroup[2].name).toEqual(mdb2.name)

    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK)
    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual(mtb.name)
    expect(airUnits[1].name).toEqual(mhb1.name)
  })

  test("Move US Strike Groups First Air Op, Carrier Fleets 2 Hexes apart", async () => {
    createFleetMove(controller, 7, -1, "1AF", GlobalUnitsModel.Side.JAPAN) // G, 2
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, ef2)

    await generateUSAirOperationsMovesCarriers(controller, { setTestUpdate: undefined }, true)

    let strikeUnits = controller.getStrikeUnits(GlobalUnitsModel.Side.US)

    const firstOp = isFirstAirOpForStrike(controller, strikeUnits[0], GlobalUnitsModel.Side.US)
    expect(firstOp).toEqual(true)

    const usRegion = firstAirOpUSStrikeRegion(controller, strikeUnits[0])
    expect(usRegion.length).toEqual(19) // 19 possible destination

    const targets = getFirstAirOpTargetsInRange(controller, strikeUnits[0], 2, 1)
    expect(targets.length).toEqual(1)
    expect(targets[0]).toEqual("1AF")

    strikeUnits = sortStrikeGroups(controller, strikeUnits)

    // Enterprise Strike Group should be element 3 (last) in array as it contains no fighters
    // but the other two groups do contain fighters
    expect(strikeUnits[2].name).toEqual("US-SG1")
    expect(strikeUnits[2].units[0].carrier).toEqual(GlobalUnitsModel.Carrier.ENTERPRISE)

    getAllTargetsInRange(controller, strikeUnits)

    const numTargets = numTargetsInRange(strikeUnits)
    expect(numTargets).toEqual(1)
  })

  test("Move US Strike Groups First Air Op, Carrier Fleets 5 Hexes apart", async () => {
    createFleetMove(controller, 7, -2, "1AF", GlobalUnitsModel.Side.JAPAN) // G, 1
    createFleetMove(controller, 7, 3, "CSF", GlobalUnitsModel.Side.US) // G,6

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, ef2)

    await generateUSAirOperationsMovesCarriers(controller, { setTestUpdate: undefined }, true)
 
    await moveStrikeGroups(controller, { setStrikeGroupUpdate: undefined }, true)

    let strikeUnits = controller.getStrikeUnits(GlobalUnitsModel.Side.US)

    // Both Strike Groups should move to 7,1
    // Third SG cannot be formed because it has TBDs (range of 5 is too great)
    let location = controller.getStrikeGroupLocation(strikeUnits[0].name, GlobalUnitsModel.Side.US)
    expect(location.currentHex.q).toEqual(7)
    expect(location.currentHex.r).toEqual(1)

    location = controller.getStrikeGroupLocation(strikeUnits[1].name, GlobalUnitsModel.Side.US)
    expect(location.currentHex.q).toEqual(7)
    expect(location.currentHex.r).toEqual(1)
  })

  test("Move US Strike Groups Target Allocation, Multiple IJN Fleets on Map", async () => {
    createFleetMove(controller, 7, -1, "1AF", GlobalUnitsModel.Side.JAPAN) // G, 2
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4
    createFleetMove(controller, 4, 0, "IJN-DMCV", GlobalUnitsModel.Side.JAPAN) // D 2
    createFleetMove(controller, 5, 4, "MIF", GlobalUnitsModel.Side.JAPAN) // E 6

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, ef2)

    await generateUSAirOperationsMovesCarriers(controller, { setTestUpdate: undefined }, true)

    let strikeUnits = controller.getStrikeUnits(GlobalUnitsModel.Side.US)

    strikeUnits = sortStrikeGroups(controller, strikeUnits)

    getAllTargetsInRange(controller, strikeUnits)

    const numTargets = numTargetsInRange(strikeUnits)
    expect(numTargets).toEqual(3)

    await moveStrikeGroups(controller, { setStrikeGroupUpdate: undefined }, true)
    let location = controller.getStrikeGroupLocation(strikeUnits[0].name, GlobalUnitsModel.Side.US)

    // Strike Group 1 (only) Should be in same hex as 1AF
    // The others won't move until after the battle
    expect(location.currentHex.q).toEqual(7)
    expect(location.currentHex.r).toEqual(-1)
  })

  test("Move US Strike Groups Second Air Op", async () => {
    createFleetMove(controller, 3, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // C,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    GlobalGameState.airOperationPoints.japan = 3
    GlobalGameState.airOperationPoints.us = 4

    setInitialAirUnitLocations()
    await generateUSAirOperationsMovesCarriers(controller, { setTestUpdate: undefined }, true)

    const strikeUnits = controller.getStrikeUnits(GlobalUnitsModel.Side.US)

    const firstOp = isFirstAirOpForStrike(controller, strikeUnits[0], GlobalUnitsModel.Side.US)
    expect(firstOp).toEqual(true)

    const usRegion = firstAirOpUSStrikeRegion(controller, strikeUnits[0])
    expect(usRegion.length).toEqual(19) // 19 possible destination
  })
})
