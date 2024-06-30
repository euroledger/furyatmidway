import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import { loadGameState } from "./SaveLoadGame"

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
async function loadHandler({ setTestClicked, setSplash, setAirUnitUpdate, setFleetUnitUpdate, loadState }) {
  setTestClicked(true)
  console.log("Load game from local storage")
  setSplash(false)
  const { airUpdates, jpfleetUpdates, usfleetUpdates, logItems } = loadGameState(GlobalInit.controller)
  for (const update of airUpdates) {
    setAirUnitUpdate(update)
    await delay(1)
  }

  for (const update of usfleetUpdates) {
    setFleetUnitUpdate(update)
    await delay(1)
  }

  for (const update of jpfleetUpdates) {
    setFleetUnitUpdate(update)
    await delay(1)
  }

  GlobalGameState.logItems = new Array()
  for (let item of logItems.values()) {
    GlobalGameState.log(item)
  }

  loadState()
  setTestClicked(false)
}

export default loadHandler
