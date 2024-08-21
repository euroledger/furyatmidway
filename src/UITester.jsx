import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import "./style.css"
import {
  calcRandomJapanTestData,
  getFleetUnitUpdateUS,
  calcTestDataUS,
  createFleetUpdate,
  calcStrikeDataUS,
} from "./AirUnitTestData"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"
import { airUnitDataJapan, airUnitDataUS, airUnitsToStrikeGroupsUS, createStrikeGroupUpdate } from "./AirUnitTestData"

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
const UITester = async ({ e, setTestClicked, setAirUnitUpdate, setFleetUnitUpdate, setStrikeGroupUpdate, nextAction, doRoll }) => {
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

    setAirUnitUpdate(update)
    await delay(1)
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

    await delay(1)
    if (update.nextAction) {
      console.log("GAME STATE = ", GlobalGameState.gamePhase)

      nextAction(e)
    }
  }
  await delay(1)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)
  nextAction(e) // us card draw
  await delay(1)
  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  nextAction(e) // midway
  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  const usFleetMove = createFleetUpdate("CSF", 4, 1)
  setFleetUnitUpdate(usFleetMove)

  // setFleetUnitUpdate(undefined)
  await delay(1)
  nextAction(e)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  const jpFleetMove = createFleetUpdate("1AF", 2, 2)
  setFleetUnitUpdate(jpFleetMove)
  await delay(1)
  nextAction(e)
  await delay(1)
  nextAction(e)
  await delay(1)
  nextAction(e)

  nextAction(e)

  // Set dice roll automatically -> US initiative
  doRoll(2, 3)
  
  console.log("SIDE WITH INITIATIVE=", GlobalGameState.sideWithInitiative)
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

    await delay(1)
    if (update.nextAction) {
      nextAction(e)
    }
  }
  await delay(1)

  const usStrikeGroupMove = createStrikeGroupUpdate("US-SG1", 2, 2)
  setStrikeGroupUpdate(usStrikeGroupMove)

  await delay(1)

}

export default UITester
