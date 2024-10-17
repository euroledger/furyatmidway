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
import { getValidJapanDestinationsCAP, getValidUSDestinationsCAP, setValidDestinationBoxes } from "../controller/AirOperationsHandler"

const DELAY = 1
const MIDWAY_ATTACK = true

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate, side) {
  console.log("side with init=",GlobalGameState.sideWithInitiative)

  let s = side ?? GlobalGameState.sideWithInitiative
  let strikeUnitsReturning = GlobalInit.controller.getAirUnitsInStrikeBoxesReadyToReturn(s)

  for (const unit of strikeUnitsReturning) {
    setValidDestinationBoxes(GlobalInit.controller, unit.name, unit.side)

    const destBoxes = GlobalInit.controller.getValidAirUnitDestinations(unit.name)
    if (destBoxes.length === 0) {
      // this can only happen if all carriers sunk, leave for now
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
    console.log("position1 = ", position1, "box name=", update.boxName)
    if (position1 === undefined) {
      console.log("ERROR: position1 undefined in return strike units")
      continue
    }
    update.position = position1.offsets[update.index]

    setTestUpdate(update)
    await delay(5)
  }
}
async function moveCAPUnitsFromReturnBoxToCarrier(side, setTestUpdate) {
  const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(side)

  console.log("******* capUnitsReturning=",capUnitsReturning)
  for (const unit of capUnitsReturning) {
    const parentCarrier = GlobalInit.controller.getCarrierForAirUnit(unit.name)

    let destinationsArray = side === GlobalUnitsModel.Side.JAPAN ? getValidJapanDestinationsCAP(
      GlobalInit.controller,
      parentCarrier,
      side
    ):
    getValidUSDestinationsCAP(
      GlobalInit.controller,
      parentCarrier,
      side
    )
    // go to first available destination
    let update = {
      name: unit.name,
      boxName: destinationsArray[0],
    }

    update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
    let position1 = side === GlobalUnitsModel.Side.JAPAN ?
      JapanAirBoxOffsets.find((box) => box.name === update.boxName) :
      USAirBoxOffsets.find((box) => box.name === update.boxName)
      
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

async function setupJapanAirStrike(strikeGroup, setStrikeGroupUpdate, q, r) {
  await delay(100)
  const jpStrikeGroupMove = createStrikeGroupUpdate(strikeGroup, q, r)
  setStrikeGroupUpdate(jpStrikeGroupMove)

  await delay(DELAY)
}

async function doTargetSelection() {
  if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.TARGET_DETERMINATION) {
    return
  }
  // TARGET SELECTION SCREEN
  GlobalGameState.closePanel = false

  await delay(500)

  let oneOrZero = Math.random() >= 0.5 ? 1 : 0

  GlobalGameState.testTarget =
    oneOrZero === 1 ? GlobalUnitsModel.TaskForce.CARRIER_DIV_1 : GlobalUnitsModel.TaskForce.CARRIER_DIV_2
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
  if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.ATTACK_TARGET_SELECTION) {
    return
  }

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
  console.log("IN HERE...")
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
  await doTargetSelection()

  await doCAPInterception(defendingSide)

  await doCAPDamageAllocation()

  await doEscortCounterAttack()

  await doEscortDamageAllocation()

  await doAntiAircraftFire()

  await doAntiAircraftDamage()

  await doCarrierTargetSelection(setAttackAirCounterUpdate)

  await doAttackResolution()

  await doCarrierDamage()
}

async function doMidwayAttack(nextAction, e, setTestUpdate, setStrikeGroupUpdate) {
  // Allocate Air Units to Strike Boxes

  // 1. Get all fighters on flight decks
  const fighters = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(true)

  // 2. Get all attack aircraft on flight decks
  const attackAircraft = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(false)

  // 3. strike group of 4 units (balanced equally)
  const oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // 4. Move units to Strike Boxes
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
    console.log("Send Air Unit update:", update)
    setTestUpdate(update)

    await delay(DELAY)
  }

  // FIRST AIR OP - MOVE STRIKE GROUP OUT TO SEA
  await setupJapanAirStrike("JP-SG1", setStrikeGroupUpdate, 4, 2)
  await nextAction(e)

  // SECOND AIR OP - MOVE STRIKE GROUP TO MIDWAY
  await delay(DELAY)
  await setupJapanAirStrike("JP-SG1", setStrikeGroupUpdate, 6, 3)

  console.log("AIR STRIKE BEGIN")
  await doAirStrike(GlobalUnitsModel.Side.US)
  console.log("AIR STRIKE END")

  await delay(1000)
  await moveCAPUnitsFromReturnBoxToCarrier(GlobalUnitsModel.Side.US, setTestUpdate)

  // console.log("MOVE STRIKE UNITS TO RETURN BOXES")
  // // move strike units that have attacked to return boxes
  await moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate, GlobalUnitsModel.Side.JAPAN)
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

  if (GlobalGameState.midwayAttackDeclaration) {
    doMidwayAttack(nextAction, e, setTestUpdate, setStrikeGroupUpdate)
  }
  // await delay(DELAY)
  // nextAction(e)
  // await delay(DELAY)
  // nextAction(e)

  // // Set dice roll automatically -> US initiative
  // doInitiativeRoll(2, 3)

  // nextAction(e)

  // // Allocate Air Units to Strike Boxes
  // for (const unit of airUnitsToStrikeGroupsUS) {
  //   update = calcStrikeDataUS(unit, GlobalInit.controller)
  //   if (!update) {
  //     continue
  //   }
  //   update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

  //   let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)

  //   update.position = position1.offsets[update.index]
  //   // console.log("Send Air Unit update:", update)
  //   setTestUpdate(update)

  //   await delay(DELAY)
  //   if (update.nextAction) {
  //     nextAction(e)
  //   }
  // }

  // await setupUSAirStrike("US-SG1", setStrikeGroupUpdate)
  // await doAirStrike(GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)

  // await delay(10)

  // await setupUSAirStrike("US-SG2", setStrikeGroupUpdate)
  // await doAirStrike( GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)

  // await delay(10)

  // await setupUSAirStrike("US-SG3", setStrikeGroupUpdate)
  // await doAirStrike( GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)

  // await delay(1000)

  // // We need to do this in the UI tester because this is a manual (not automated) operation
  // // reason being that sometimes there is a choice for the player
  // console.log("MOVE CAP UNITS BACK TO CARRIER")
  // await moveCAPUnitsFromReturnBoxToCarrier(GlobalUnitsModel.Side.JAPAN, setTestUpdate)

  // console.log("MOVE STRIKE UNITS TO RETURN BOXES")
  // // move strike units that have attacked to return boxes
  // await moveAttackingStrikeUnitsToReturnBoxes(setTestUpdate)

  // GlobalGameState.closePanel = false
  // await delay(100)
  // GlobalGameState.closePanel = true // in case eliminated air units are on display

  // // doInitiativeRoll(3, 2)
  // // await delay(1000)
  // // nextAction(e) // go from tidy up to initiative determination
  // // console.log("GlobalGameState.sideWithInitiative=",GlobalGameState.sideWithInitiative)
  // // console.log("Now allocate Japan Air Units to strike boxes")
}

export default UITester
