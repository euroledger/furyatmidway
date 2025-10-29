import GlobalGameState from "./model/GlobalGameState"
import { loadGameStateForId } from "./SaveLoadGame"

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function loadHandler({
  controller,
  setTestClicked,
  setSplash,
  setAirUnitUpdate,
  setFleetUnitUpdate,
  setStrikeGroupUpdate,
  setDamageMarkerUpdate,
  setDmcvShipMarkerUpdate,
  setTowedCVSelected,
  loadState,
  id,
  setLoading,
  setPreviousPosition,
}) {
  GlobalGameState.gamePhase = "LOADING"
  setTestClicked(true)
  console.log("Load game from local storage")
  setSplash(false)
  const {
    airUpdates,
    jpfleetUpdates,
    usfleetUpdates,
    jpStrikeUpdates,
    usStrikeUpdates,
    jpDamageMarkerUpdates,
    usDamageMarkerUpdates,
    jpDMCVMarkerUpdates,
    usDMCVMarkerUpdates,
    logItems,
    cvSelected,
    previousPosition,
  } = loadGameStateForId(controller, id)

  setTowedCVSelected(cvSelected)
  for (const update of airUpdates) {
    await delay(1)
    setAirUnitUpdate(update)
    await delay(1)
  }

  for (const update of usfleetUpdates) {
    await delay(1)
    setFleetUnitUpdate(update)
    await delay(1)
  }

  for (const update of jpfleetUpdates) {
    await delay(1)
    setFleetUnitUpdate(update)
    await delay(1)
  }

  for (const update of jpStrikeUpdates) {
    setStrikeGroupUpdate(update)
    await delay(1)
  }
  for (const update of usStrikeUpdates) {
    setStrikeGroupUpdate(update)
    await delay(1)
  }

  for (const updateArray of jpDamageMarkerUpdates) {
    await delay(1)
    for (let update of updateArray) {
      if (update === null) {
        continue
      }
      setDamageMarkerUpdate(update)
      await delay(1)
    }
  }

  for (const updateArray of usDamageMarkerUpdates) {
    await delay(1)
    for (let update of updateArray) {
      if (update === null) {
        continue
      }
      setDamageMarkerUpdate(update)
      await delay(1)
    }
  }
  for (const update of jpDMCVMarkerUpdates) {
    setDmcvShipMarkerUpdate(update)
    await delay(1)
  }
  for (const update of usDMCVMarkerUpdates) {
    setDmcvShipMarkerUpdate(update)
    await delay(1)
  }

  GlobalGameState.logItems = new Array()
  for (let item of logItems.values()) {
    GlobalGameState.log(item)
  }

  if (previousPosition !== undefined) {
    setPreviousPosition(() => previousPosition)
  }

  console.log(
    "************************ DONE LOADING ^^^^^^^^^^^^^^^^ set game phase to",
    GlobalGameState.temporaryGamePhase
  )

  console.log("************************ JAPAN PLAYER TYPE=", GlobalGameState.jpPlayerType),
    (GlobalGameState.gamePhase = GlobalGameState.temporaryGamePhase)

  loadState()
  setTestClicked(false)
  setAirUnitUpdate({
    name: "",
    position: {},
    boxName: "",
    index: -1,
  })
  setLoading(false)

  // QUACK TEMPORARY UNTIL NEW GAMES WITH THESE ARE SAVED- REMOVE

  // GlobalGameState.nextAvailableDamageMarker = 0
  // GlobalGameState.nextAvailableSunkMarker = 0
  // if (GlobalGameState.totalMidwayHits === undefined) {
  //   GlobalGameState.totalMidwayHits = 0
  //   GlobalGameState.midwayBox0Damaged = false
  //   GlobalGameState.midwayBox1Damaged = false
  //   GlobalGameState.midwayBox2Damaged = false
  // }
}

export default loadHandler
