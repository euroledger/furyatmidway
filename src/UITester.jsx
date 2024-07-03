import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import "./style.css"
import { calcRandomJapanTestData, getFleetUnitUpdateUS, calcTestDataUS, createFleetUpdate } from "./AirUnitTestData"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"
import { airUnitDataJapan, airUnitDataUS } from "./AirUnitTestData"

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
const UITester = async ({ e, setTestClicked, setAirUnitUpdate, setFleetUnitUpdate, nextAction }) => {
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

  const usFleetMove = createFleetUpdate("CSF", 5, 1)
  setFleetUnitUpdate(usFleetMove)

  // setFleetUnitUpdate(undefined)
  await delay(1)
  nextAction(e)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)

  const jpFleetMove = createFleetUpdate("1AF", 2, 3)
  setFleetUnitUpdate(jpFleetMove)
  await delay(1)
  nextAction(e)
  await delay(1)
  nextAction(e)
  await delay(1)
  nextAction(e)

  console.log("GAME STATE = ", GlobalGameState.gamePhase)
}

export default UITester
