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
import { getValidJapanDestinationsCAP } from "../controller/AirOperationsHandler"

const DELAY = 1

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function moveCAPUnitsFromReturnBoxToCarrier(setTestUpdate) {
  const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.JAPAN)

  console.log("BACK IN UI TESTER capUnitsReturning length=", capUnitsReturning.length)
  for (const unit of capUnitsReturning) {
    const parentCarrier = GlobalInit.controller.getCarrierForAirUnit(unit.name)

    const destinationsArray = getValidJapanDestinationsCAP(
      GlobalInit.controller,
      parentCarrier,
      GlobalUnitsModel.Side.JAPAN
    )
    // go to first available destination
    let update = {
      name: unit.name,
      boxName: destinationsArray[0],
    }

    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
    console.log("position1 = ", position1, "box name=", update.boxName)
    if (position1 === undefined) {
      // orphaned CAP Unit, ignore
      continue
    }
    update.position = position1.offsets[update.index]

    setTestUpdate(update)
    await delay(5)
  }
}
async function setupUSAirStrike(strikeGroup, setStrikeGroupUpdate) {
  await delay(100)
  const usStrikeGroupMove = createStrikeGroupUpdate(strikeGroup, 2, 2)
  setStrikeGroupUpdate(usStrikeGroupMove)

  await delay(DELAY)
}

async function doTargetSelection() {
  // TARGET SELECTION SCREEN
  GlobalGameState.closePanel = false

  await delay(500)


  let oneOrZero = Math.random() >= 0.5 ? 1 : 0

  GlobalGameState.testTarget =
    oneOrZero === 1 ? GlobalUnitsModel.TaskForce.CARRIER_DIV_1 : GlobalUnitsModel.TaskForce.CARRIER_DIV_2
  GlobalGameState.updateGlobalState()

  console.log(">> QUACK GlobalGameState.testTarget =", GlobalGameState.testTarget)
  await delay(500)

  GlobalGameState.rollDice = true
  await delay(10)
  GlobalGameState.updateGlobalState()

  await delay(10)

  GlobalGameState.rollDice = false

  await delay(2000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()

  await delay(2)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()
}

async function doCAPInterception() {
  GlobalGameState.testCapSelection = -1

  // CAP SELECTION SCREEN

  const capBox = GlobalInit.controller.getCAPBoxForTaskForce(
    GlobalGameState.taskForceTarget,
    GlobalUnitsModel.Side.JAPAN
  )
  const capUnits = GlobalInit.controller.getAllAirUnitsInBox(capBox)
  await delay(1000)
  if (capUnits.length > 0) {
    const selection = Math.floor(Math.random() * capUnits.length)

    GlobalGameState.testCapSelection = selection
    GlobalGameState.updateGlobalState()

    await delay(500)
    GlobalGameState.rollDice = true
    await delay(10)
    GlobalGameState.updateGlobalState()
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()

  await delay(1000)
  GlobalGameState.closePanel = false
  GlobalGameState.rollDice = false

  GlobalGameState.updateGlobalState()
  await delay(10)
}

async function doCAPDamageAllocation() {
  // CAP DAMAGE ALLOCATION

  if (GlobalGameState.capHits > 0) {
    for (let i = 0; i < GlobalGameState.capHits; i++) {
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(10)
      let numStrikeUnits = GlobalInit.controller.getAttackingStrikeUnits()
      const selection = Math.floor(Math.random() * numStrikeUnits.length)

      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(500)
    }
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.updateGlobalState()
}

async function doEscortCounterAttack() {
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
}

async function doEscortDamageAllocation() {
  // ESCORT DAMAGE ALLOCATION
  if (GlobalGameState.fighterHits > 0) {
    for (let i = 0; i < GlobalGameState.fighterHits; i++) {
      await delay(1000)
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(100)
      let numCAPUnits = GlobalInit.controller.getAllCAPDefenders(GlobalUnitsModel.Side.JAPAN)
      const selection = Math.floor(Math.random() * numCAPUnits.length)

      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(1000)
    }
  }
  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()
}

async function doAntiAircraftFire() {
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
}

async function doAntiAircraftDamage() {
  // ANTI AIRCRAFT DAMAGE
  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  if (GlobalGameState.antiaircraftHits > 0) {
    for (let i = 0; i < GlobalGameState.antiaircraftHits; i++) {
      await delay(1000)
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(100)
      let numStrikeUnits = GlobalInit.controller.getAttackingStrikeUnits(true)
      const selection = Math.floor(Math.random() * numStrikeUnits.length)

      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(1000)
    }
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()
}

async function doCarrierTargetSelection(setAttackAirCounterUpdate) {
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
    let oneOrZero = Math.random() >= 0.5 ? 1 : 0
    const carriersInTF = GlobalInit.controller.getAllCarriersInTaskForce(
      GlobalGameState.taskForceTarget,
      GlobalUnitsModel.Side.JAPAN
    )
    // oneOrZero= 0 // TEST QUACK TAKE THIS OUT
    const carrier = carriersInTF[oneOrZero]

    const uuid = Date.now()
    attackAirCounterUpdate = {
      unit,
      carrier: carrier.name,
      id: oneOrZero + 1,
      side: GlobalUnitsModel.Side.US,
      uuid,
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
}

async function doAttackResolution() {
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
}

async function doCarrierDamage() {
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

async function doAirStrike(setAttackAirCounterUpdate) {
  await doTargetSelection()

  await doCAPInterception()

  await doCAPDamageAllocation()

  await doEscortCounterAttack()

  await doEscortDamageAllocation()

  await doAntiAircraftFire()

  await doAntiAircraftDamage()

  await doCarrierTargetSelection(setAttackAirCounterUpdate)

  await doAttackResolution()

  await doCarrierDamage()
}

const UITester = async ({
  e,
  setTestClicked,
  setTestUpdate,
  setFleetUnitUpdate,
  setStrikeGroupUpdate,
  nextAction,
  doInitiativeRoll,
  setAttackAirCounterUpdate,
}) => {
  setTestClicked(true)

  let update
  for (const unit of airUnitDataJapan) {
    update = calcRandomJapanTestData(unit, GlobalInit.controller)
    if (!update) {
      continue
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
    update.position = position1.offsets[update.index]

    setTestUpdate(update)
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

    setTestUpdate(update)

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

  // Set dice roll automatically -> US initiative
  doInitiativeRoll(2, 3)

  nextAction(e)

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
    setTestUpdate(update)

    await delay(DELAY)
    if (update.nextAction) {
      nextAction(e)
    }
  }

  await setupUSAirStrike("US-SG1", setStrikeGroupUpdate)
  await doAirStrike(setAttackAirCounterUpdate)

  await delay(10)

  await setupUSAirStrike("US-SG2", setStrikeGroupUpdate)
  await doAirStrike(setAttackAirCounterUpdate)

  await delay(10)

  await setupUSAirStrike("US-SG3", setStrikeGroupUpdate)
  await doAirStrike(setAttackAirCounterUpdate)

  await delay(1000)
  nextAction(e)

  // We need to do this in the UI tester because this is a manual (not automated) operation
  // reason being that sometimes there is a choice for the player
  moveCAPUnitsFromReturnBoxToCarrier(setTestUpdate)

  console.log(">QUACK >>>>>>>>>END, game state=", GlobalGameState.gamePhase)

  GlobalGameState.closePanel = false
  await delay(100)
  GlobalGameState.closePanel = true // in case eliminated air units are on display


  // doInitiativeRoll(3, 2)
  await delay(1000)
  nextAction(e) // go from tidy up to initiative determination
  // console.log("GlobalGameState.sideWithInitiative=",GlobalGameState.sideWithInitiative)
  // console.log("Now allocate Japan Air Units to strike boxes")
}

export default UITester
