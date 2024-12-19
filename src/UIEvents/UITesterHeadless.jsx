import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import "../style.css"
import {
  calcRandomJapanTestData,
  getFleetUnitUpdateUS,
  calcTestDataUS,
  createFleetUpdate,
  calcStrikeDataUS,
} from "../AirUnitData"
import JapanAirBoxOffsets from "../components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "../components/draganddrop/USAirBoxOffsets"
import { airUnitDataJapan, airUnitSetupDataUS, airUnitsToStrikeGroupsUS, createStrikeGroupUpdate } from "../AirUnitData"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import {
  getValidJapanDestinationsCAP,
  getValidUSDestinationsCAP,
  setValidDestinationBoxes,
} from "../controller/AirOperationsHandler"
import { doCAP, doCAPEvent } from "../DiceHandler"
import { randomDieRolls } from "../components/dialogs/DiceUtils"

import { selectUSDefendingCAPUnits } from "./AI/USAirOperationsBot"

const DELAY = 1
const MIDWAY_ATTACK = true

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function moveAirUnit(unit, setTestUpdate) {
  const destBoxes = GlobalInit.controller.getValidAirUnitDestinations(unit.name)
  if (destBoxes.length === 0) {
    // this can only happen if all carriers sunk, leave for now
    return
  }
  // go to first available destination
  let update = {
    name: unit.name,
    boxName: destBoxes[0],
  }

  const position1 =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN
      ? JapanAirBoxOffsets.find((box) => box.name === update.boxName)
      : USAirBoxOffsets.find((box) => box.name === update.boxName)
  update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
  if (position1 === undefined) {
    console.log("ERROR: position1 undefined in return strike units")
    return
  }
  update.position = position1.offsets[update.index]

  await delay(1)

  setTestUpdate(update)
  await delay(1)
}
async function moveUnitsFromReturnBoxes(setTestUpdate, side) {
  const airUnits = GlobalInit.controller.getAllAirUnits(side)

  for (const unit of airUnits) {
    if (unit.aircraftUnit.moved) {
      continue // only want units that have not yet moved
    }
    const location = GlobalInit.controller.getAirUnitLocation(unit.name)
    if (location.boxName.includes("RETURNING (2)") || location.boxName.includes("RETURNING (1)")) {
      setValidDestinationBoxes(GlobalInit.controller, unit.name, unit.side)
      await moveAirUnit(unit, setTestUpdate)
    }
  }
}
async function moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate, side) {
  let s = side ?? GlobalGameState.sideWithInitiative
  let strikeUnitsReturning = GlobalInit.controller.getAirUnitsInStrikeBoxesReadyToReturn(s)

  for (const unit of strikeUnitsReturning) {
    setValidDestinationBoxes(GlobalInit.controller, unit.name, unit.side)

    await moveAirUnit(unit, setTestUpdate)
  }
}
async function moveCAPUnitsFromReturnBoxToCarrier(side, setTestUpdate) {
  const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(side)

  for (const unit of capUnitsReturning) {
    const parentCarrier = GlobalInit.controller.getCarrierForAirUnit(unit.name)

    let destinationsArray =
      side === GlobalUnitsModel.Side.JAPAN
        ? getValidJapanDestinationsCAP(GlobalInit.controller, parentCarrier, side)
        : getValidUSDestinationsCAP(GlobalInit.controller, parentCarrier, side)
    // go to first available destination
    let update = {
      name: unit.name,
      boxName: destinationsArray[0],
    }

    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
    let position1 =
      side === GlobalUnitsModel.Side.JAPAN
        ? JapanAirBoxOffsets.find((box) => box.name === update.boxName)
        : USAirBoxOffsets.find((box) => box.name === update.boxName)

    if (position1 === undefined) {
      // orphaned CAP Unit, ignore
      continue
    }
    update.position = position1.offsets[update.index]

    setTestUpdate(update)
    await delay(1)
  }
}
async function moveUSStrikeGroup(strikeGroup, setStrikeGroupUpdate) {
  await delay(100)
  const usStrikeGroupMove = createStrikeGroupUpdate(strikeGroup, 2, 2)
  setStrikeGroupUpdate(usStrikeGroupMove)

  await delay(DELAY)
}

async function moveJapanStrikeGroup(strikeGroup, setStrikeGroupUpdate, q, r) {
  const jpStrikeGroupMove = createStrikeGroupUpdate(strikeGroup, q, r)
  setStrikeGroupUpdate(jpStrikeGroupMove)

  await delay(DELAY)
}

async function doTargetSelection(defendingSide) {
  if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.TARGET_DETERMINATION) {
    return
  }

  // TARGET SELECTION SCREEN
  GlobalGameState.closePanel = false

  await delay(500)

  let oneOrZero = Math.random() >= 0.5 ? 1 : 0

  if (defendingSide === GlobalUnitsModel.Side.JAPAN) {
    GlobalGameState.testTarget =
      oneOrZero === 1 ? GlobalUnitsModel.TaskForce.CARRIER_DIV_1 : GlobalUnitsModel.TaskForce.CARRIER_DIV_2
  } else {
    GlobalGameState.testTarget =
      oneOrZero === 1 ? GlobalUnitsModel.TaskForce.TASK_FORCE_16 : GlobalUnitsModel.TaskForce.TASK_FORCE_17
  }
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

  await delay(2)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()
}

async function doCAPInterception(side) {
  GlobalGameState.testCapSelection = -1

  // CAP SELECTION SCREEN

  const capBox = GlobalInit.controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, side)
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

async function doHeadlessAntiAircraftFire() {
  
}
async function doHeadlessCAPDamageAllocation() {

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

    GlobalGameState.closePanel = true
    GlobalGameState.updateGlobalState()
  }

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  await delay(500)

  GlobalGameState.updateGlobalState()
}

async function doCarrierTargetSelection(setAttackAirCounterUpdate, sideDefending) {
  if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.ATTACK_TARGET_SELECTION) {
    return
  }

  // CARRIER TARGET SELECTION SCREEN
  await delay(100)
  GlobalGameState.closePanel = false
  GlobalGameState.updateGlobalState()

  const strikeUnits = GlobalInit.controller.getAttackingStrikeUnits(true)

  let oneOrZero = Math.random() >= 0.5 ? 1 : 0
  // Assures all carrier units attack the same target
  // which simplifies the test
  for (let unit of strikeUnits) {
    let attackAirCounterUpdate
    await delay(300)
    GlobalGameState.testCarrierSelection = -1
    GlobalGameState.updateGlobalState()
    await delay(100)
    const carriersInTF = GlobalInit.controller.getAllCarriersInTaskForce(GlobalGameState.taskForceTarget, sideDefending)
    const carrier = carriersInTF[oneOrZero]
    const uuid = Date.now()
    attackAirCounterUpdate = {
      unit,
      carrier: carrier.name,
      id: oneOrZero + 1,
      side: GlobalGameState.sideWithInitiative,
      uuid,
    }
    console.log("CARRIER TARGET SELECTION: attackAirCounterUpdate=", attackAirCounterUpdate)
    setAttackAirCounterUpdate(attackAirCounterUpdate)
    await delay(10)

    GlobalGameState.updateGlobalState()
    await delay(1000)
  }
  await delay(1000)
  console.log("CLOSE PANEL CARRIER TARGET SELECTION")
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
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  // if this is Midway damage we may need up to 3 die rolls
  await delay(300)
  GlobalGameState.rollDice = true
  GlobalGameState.updateGlobalState()
  await delay(300)
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  await delay(300)
  GlobalGameState.rollDice = true
  GlobalGameState.updateGlobalState()

  await delay(300)
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  await delay(300)
  GlobalGameState.rollDice = true

  await delay(1000)
  GlobalGameState.closePanel = true
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()
}

async function doAirStrike(defendingSide, setAttackAirCounterUpdate) {
  await doTargetSelection(defendingSide)

  await doCAPInterception(defendingSide)

  await doCAPDamageAllocation()

  await doEscortCounterAttack()

  await doEscortDamageAllocation()

  await doAntiAircraftFire()

  await doAntiAircraftDamage()

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
    // no attacking aircraft left
    return
  }
  await doCarrierTargetSelection(setAttackAirCounterUpdate, defendingSide)

  await doAttackResolution()

  await doCarrierDamage()
}

async function setupJapanAirStrikes(setTestUpdate) {
  // 1. Get all fighters on flight decks
  const fighters = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(true)

  // 2. Get all attack aircraft on flight decks
  const attackAircraft = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(false)

  // 3. Create two strike groups from above units, allocate attack unit then fighter alternatively
  const strikeUnits1 = new Array()
  const strikeUnits2 = new Array()
  const boxName1 = GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0
  const boxName2 = GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2

  for (let i = 0; i < attackAircraft.length; i++) {
    if (i % 2 == 0) {
      strikeUnits1.push(attackAircraft[i])
    } else {
      strikeUnits2.push(attackAircraft[i])
    }
  }
  for (let i = 0; i < fighters.length; i++) {
    if (i % 2 == 0) {
      strikeUnits1.push(fighters[i])
    } else {
      strikeUnits2.push(fighters[i])
    }
  }

  for (const unit of strikeUnits1) {
    let update = {
      name: unit.name,
      boxName: boxName1,
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
    update.position = position1.offsets[update.index]
    setTestUpdate(update)
    await delay(DELAY)
  }
  for (const unit of strikeUnits2) {
    let update = {
      name: unit.name,
      boxName: boxName2,
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
    update.position = position1.offsets[update.index]
    setTestUpdate(update)
    await delay(DELAY)
  }
}

async function doHeadlessCAPInterception(stateObject) {
  const { steps, selectedCapUnits, fighters } = selectUSDefendingCAPUnits(GlobalInit.controller, stateObject)

  const dieRolls = randomDieRolls(steps)
  doCAP(GlobalInit.controller, selectedCapUnits, fighters, dieRolls)

  console.log("ROLLS=", dieRolls, "CAP HITS=", GlobalGameState.capHits)
  doCAPEvent(GlobalInit.controller, selectedCapUnits)
}

async function doHeadlessAirStrike(stateObject, e, nextAction) {
  // add selectTargetTaskForce in here (for attacks on Carriers)

  await doHeadlessCAPInterception(stateObject)
  nextAction(e) 

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    await doHeadlessCAPDamageAllocation()
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
    await doHeadlessCAPDamageAllocation()
  }
}

async function doMidwayAttack(e, nextAction, stateObject) {
  const { setTestUpdate, setStrikeGroupUpdate, setCapSteps } = stateObject
  // Allocate Air Units to Strike Boxes

  // 1. Get all fighters on flight decks
  const fighters = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(true)

  // 2. Get all attack aircraft on flight decks
  const attackAircraft = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(false)

  // 3. Move units to Strike Boxes
  const strikeUnits = new Array()

  strikeUnits.push(attackAircraft[0])
  strikeUnits.push(fighters[0])

  // if (oneOrZero == 1) {
  strikeUnits.push(attackAircraft[1])
  strikeUnits.push(attackAircraft[2])
  // }
  const boxName = GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0

  for (const unit of strikeUnits) {
    if (unit === undefined) {
      continue
    }
    let update = {
      name: unit.name,
      boxName: boxName,
    }
    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)

    update.position = position1.offsets[update.index]
    setTestUpdate(update)

    await delay(DELAY)
  }

  // FIRST AIR OP - MOVE STRIKE GROUP OUT TO SEA
  await moveJapanStrikeGroup("JP-SG1", setStrikeGroupUpdate, 4, 2)
  await nextAction(e)

  // SECOND AIR OP - MOVE STRIKE GROUP TO MIDWAY
  await delay(DELAY)
  await moveJapanStrikeGroup("JP-SG1", setStrikeGroupUpdate, 6, 3)
  await delay(1)

  await doHeadlessAirStrike(stateObject, e, nextAction)
  // await doAirStrike(GlobalUnitsModel.Side.US)

  // await delay(1000)
  // await moveCAPUnitsFromReturnBoxToCarrier(GlobalUnitsModel.Side.US, setTestUpdate)

  // // console.log("MOVE STRIKE UNITS TO RETURN BOXES")
  // // // move strike units that have attacked to return boxes
  // await moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate, GlobalUnitsModel.Side.JAPAN)
}

const UITesterHeadless = async (stateObject) => {
  const {
    e,
    setTestClicked,
    setTestUpdate,
    setAttackAirCounterUpdate,
    setFleetUnitUpdate,
    setStrikeGroupUpdate,
    nextAction,
    doInitiativeRoll,
    setCapAirUnits,
    setCapSteps,
    setFightersPresent,
  } = stateObject

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

  for (const unit of airUnitSetupDataUS) {
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
      nextAction(e)
    }
  }
  await delay(DELAY)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)
  nextAction(e) // us card draw
  await delay(DELAY)
  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  GlobalGameState.midwayAttackDeclaration = MIDWAY_ATTACK
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

  //  TURN 1 STARTS HERE ...........
  var start = new Date().getTime();

  if (GlobalGameState.midwayAttackDeclaration) {
    await doMidwayAttack(e, nextAction, stateObject)
    // await delay(DELAY)
    // nextAction(e)
  }
  var end = new Date().getTime();
  var time = end - start;
  console.log(`Call to doSomething took ${time} milliseconds`)

  await delay(DELAY)
  nextAction(e)

  await nextAction(e)
  await delay(DELAY)

  // Set dice roll automatically -> US initiative
  doInitiativeRoll(1, 6)
  await nextAction(e)

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

  await moveUSStrikeGroup("US-SG1", setStrikeGroupUpdate)
  await doAirStrike(GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)

  await delay(10)

  await moveUSStrikeGroup("US-SG2", setStrikeGroupUpdate)
  await doAirStrike(GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)

  await delay(10)

  await moveUSStrikeGroup("US-SG3", setStrikeGroupUpdate)
  await doAirStrike(GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)

  await delay(1000)

  // // We need to do this in the UI tester because this is a manual (not automated) operation
  // // reason being that sometimes there is a choice for the player
  console.log("MOVE CAP UNITS BACK TO CARRIER")
  await moveCAPUnitsFromReturnBoxToCarrier(GlobalUnitsModel.Side.JAPAN, setTestUpdate)

  console.log("MOVE STRIKE UNITS TO RETURN BOXES")
  // move strike units that have attacked to return boxes
  await moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate)

  GlobalGameState.closePanel = false
  await delay(100)
  GlobalGameState.closePanel = true // in case eliminated air units are on display

  nextAction(e) // -> AIR OPERATIONS TIDY UP
  await delay(1)

  nextAction(e) // -> INITIATIVE DETERMINATIOMN
  await delay(1)

  doInitiativeRoll(6, 1) // GIVE JAPAN NEXT AIR OP
  nextAction(e) // -> INITIATIVE DETERMINATION
  await delay(10)
  await setupJapanAirStrikes(setTestUpdate)

  await moveJapanStrikeGroup("JP-SG1", setStrikeGroupUpdate, 4, 1)
  await doAirStrike(GlobalUnitsModel.Side.US, setAttackAirCounterUpdate)
  await delay(1)

  await moveJapanStrikeGroup("JP-SG3", setStrikeGroupUpdate, 4, 1)
  await doAirStrike(GlobalUnitsModel.Side.US, setAttackAirCounterUpdate)

  await delay(1000)

  // // We need to do this in the UI tester because this is a manual (not automated) operation
  // // reason being that sometimes there is a choice for the player
  console.log("MOVE US CAP UNITS BACK TO CARRIER")
  await moveCAPUnitsFromReturnBoxToCarrier(GlobalUnitsModel.Side.US, setTestUpdate)

  console.log("MOVE STRIKE UNITS TO RETURN BOXES")
  // move strike units that have attacked to return boxes
  await moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate)

  await moveUnitsFromReturnBoxes(setTestUpdate, GlobalUnitsModel.Side.JAPAN)

  GlobalGameState.closePanel = false
  await delay(100)
  GlobalGameState.closePanel = true // in case eliminated air units are on display

  nextAction(e) // -> AIR OPERATIONS TIDY UP
  await delay(1)

  nextAction(e) // -> INITIATIVE DETERMINATIOMN
  await delay(1)
}

export default UITesterHeadless
