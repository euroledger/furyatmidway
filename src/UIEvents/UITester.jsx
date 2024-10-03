import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import "../style.css"
import {
  calcRandomJapanTestData,
  getFleetUnitUpdateUS,
  calcTestDataUS,
  createFleetUpdate,
  calcStrikeDataUS,
} from "../AirUnitTestData"
import JapanAirBoxOffsets from "../components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "../components/draganddrop/USAirBoxOffsets"
import { airUnitDataJapan, airUnitDataUS, airUnitsToStrikeGroupsUS, createStrikeGroupUpdate } from "../AirUnitTestData"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { v4 as uuidv4 } from "uuid"

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
const UITester = async ({
  e,
  setTestClicked,
  setAirUnitUpdate,
  setFleetUnitUpdate,
  setStrikeGroupUpdate,
  nextAction,
  doInitiativeRoll,
  setAttackAirCounterUpdate,
}) => {
  setTestClicked(true)

  const DELAY = 1
  let update
  for (const unit of airUnitDataJapan) {
    update = calcRandomJapanTestData(unit, GlobalInit.controller)
    if (!update) {
      continue
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
    update.position = position1.offsets[update.index]

    setAirUnitUpdate(update)
    await delay(DELAY)
    if (update.nextAction) {
      nextAction(e)
    }
  }
  nextAction(e) // get past japan card draw

  update = getFleetUnitUpdateUS("CSF")
  setFleetUnitUpdate(update)

  nextAction(e) // get past US Fleet Unit setup

  for (const unit of airUnitDataUS) {
    update = calcTestDataUS(unit, GlobalInit.controller)
    if (!update) {
      continue
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

    let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)

    update.position = position1.offsets[update.index]

    setAirUnitUpdate(update)

    await delay(DELAY)
    if (update.nextAction) {
      console.log("GAME STATE = ", GlobalGameState.gamePhase)

      nextAction(e)
    }
  }
  await delay(DELAY)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)
  nextAction(e) // us card draw
  await delay(DELAY)
  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  nextAction(e) // midway
  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  const usFleetMove = createFleetUpdate("CSF", 4, 1)
  setFleetUnitUpdate(usFleetMove)

  // setFleetUnitUpdate(undefined)
  await delay(DELAY)
  nextAction(e)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  const jpFleetMove = createFleetUpdate("1AF", 2, 2)
  setFleetUnitUpdate(jpFleetMove)
  await delay(DELAY)
  nextAction(e)
  await delay(DELAY)
  nextAction(e)
  await delay(DELAY)
  nextAction(e)

  nextAction(e)

  // Set dice roll automatically -> US initiative
  doInitiativeRoll(2, 3)

  GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
  nextAction(e)

  console.log("Now allocate US Air Units to strike boxes")
  // Allocate Air Units to Strike Boxes
  for (const unit of airUnitsToStrikeGroupsUS) {
    update = calcStrikeDataUS(unit, GlobalInit.controller)
    if (!update) {
      continue
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

    let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)

    update.position = position1.offsets[update.index]
    // console.log("Send Air Unit update:", update)
    setAirUnitUpdate(update)

    await delay(DELAY)
    if (update.nextAction) {
      nextAction(e)
    }
  }
  await delay(DELAY)

  const usStrikeGroupMove = createStrikeGroupUpdate("US-SG1", 2, 2)
  setStrikeGroupUpdate(usStrikeGroupMove)

  await delay(DELAY)

  // targetSelectionButtonClick(GlobalInit.controller, GlobalUnitsModel.TaskForce.CARRIER_DIV_1)

  // TARGET SELECTION SCREEN
  GlobalGameState.testTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
  GlobalGameState.updateGlobalState()

  await delay(500)

  GlobalGameState.rollDice = true
  await delay(10)
  GlobalGameState.updateGlobalState()

  await delay(10)

  GlobalGameState.rollDice = false

  await delay(2000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()

  // CAP SELECTION SCREEN

  const capBox = GlobalInit.controller.getCAPBoxForTaskForce(
    GlobalGameState.taskForceTarget,
    GlobalUnitsModel.Side.JAPAN
  )
  const capUnits = GlobalInit.controller.getAllAirUnitsInBox(capBox)

  if (capUnits.length > 0) {
    await delay(1000)
    GlobalGameState.closePanel = false

    GlobalGameState.testCapSelection = 0
    GlobalGameState.updateGlobalState()

    await delay(500)
    GlobalGameState.rollDice = true
    await delay(10)
    GlobalGameState.updateGlobalState()
  }

  await delay(2000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()

  await delay(1000)
  GlobalGameState.closePanel = false
  GlobalGameState.rollDice = false

  GlobalGameState.updateGlobalState()
  await delay(10)

  // CAP DAMAGE ALLOCATION

  if (GlobalGameState.capHits > 0) {
    for (let i = 0; i < GlobalGameState.capHits; i++) {
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(10)
      let numStrikeUnits = GlobalInit.controller.getAttackingStrikeUnits()
      console.log("NUM STRIKE UNITS = ", numStrikeUnits.length)
      const selection = Math.floor(Math.random() * numStrikeUnits.length)

      console.log("SELECTION = ", selection)
      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(500)
    }
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()

  // ESCORT COUNTERATTACK
  await delay(1000)
  GlobalGameState.closePanel = false
  GlobalGameState.rollDice = true
  await delay(10)
  GlobalGameState.updateGlobalState()

  await delay(2000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()

  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  // ESCORT DAMAGE ALLOCATION
  if (GlobalGameState.fighterHits > 0) {
    for (let i = 0; i < GlobalGameState.fighterHits; i++) {
      await delay(1000)
      console.log("PASS NUMBER", i)
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(100)
      let numCAPUnits = GlobalInit.controller.getAllCAPDefenders(GlobalUnitsModel.Side.JAPAN)
      const selection = Math.floor(Math.random() * numCAPUnits.length)

      console.log("SELECTION = ", selection)
      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(1000)
    }
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  // ANIT AIRCRAFT FIRE
  await delay(400)
  GlobalGameState.closePanel = false
  GlobalGameState.rollDice = true
  await delay(10)
  GlobalGameState.updateGlobalState()

  await delay(2000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  // ANTI AIRCRAFT DAMAGE
  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  // ESCORT DAMAGE ALLOCATION
  if (GlobalGameState.antiaircraftHits > 0) {
    for (let i = 0; i < GlobalGameState.antiaircraftHits; i++) {
      await delay(1000)
      console.log("PASS NUMBER", i)
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(100)
      let numStrikeUnits = GlobalInit.controller.getAttackingStrikeUnits(true)
      console.log("NUM STRIKE UNITS = ", numStrikeUnits.length)
      const selection = Math.floor(Math.random() * numStrikeUnits.length)

      console.log("SELECTION = ", selection)
      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(1000)
    }
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  // CARRIER TARGET SELECTION SCREEN
  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  const strikeUnits = GlobalInit.controller.getAttackingStrikeUnits(true)

  for (let unit of strikeUnits) {
    let attackAirCounterUpdate
    await delay(300)
    GlobalGameState.testCarrierSelection = -1
    GlobalGameState.updateGlobalState()
    await delay(100)
    let oneOrZero = (Math.random()>=0.5)? 1 : 0;
    const carriersInTF = GlobalInit.controller.getAllCarriersInTaskForce(
      GlobalGameState.taskForceTarget,
      GlobalUnitsModel.Side.JAPAN
    )
    const carrier = carriersInTF[oneOrZero]

    attackAirCounterUpdate = {
      unit,
      carrier: carrier.name,
      id: oneOrZero + 1,
      side: GlobalUnitsModel.Side.US,
      uuid: uuidv4(),
    }

    setAttackAirCounterUpdate(attackAirCounterUpdate)
    await delay(10)

    GlobalGameState.updateGlobalState()
    await delay(1000)
  }
  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  // ATTACK RESOLUTION SCREEN
  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  await delay(1000)
  GlobalGameState.rollDice = true
  GlobalGameState.updateGlobalState()

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  // CARRIER DAMAGE SCREEN
  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  await delay(1000)
  GlobalGameState.rollDice = true
  GlobalGameState.updateGlobalState()

  await delay(2000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()
}

export default UITester
