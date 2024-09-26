import GlobalGameState from "./model/GlobalGameState"
import { loadGameStateForId } from "./SaveLoadGame"

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// const loadState = ({
//   setUSMapRegions,
//   setCSFAlertShow,
//   setMidwayDialogShow,
//   setUsFleetRegions,
//   setJapanMapRegions,
//   setUSMapRegions,
//   setJapanFleetRegions,
//   setJapanStrikePanelEnabled,
//   setUsStrikePanelEnabled,
//   setFleetUnitUpdate
// }) => {
//   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
//     const carrier = GlobalGameState.getJapanCarrier()
//     determineAllUnitsDeployedForCarrier(GlobalInit.controller, GlobalUnitsModel.Side.JAPAN, carrier)
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
//     const carrier = GlobalGameState.getUSCarrier()
//     determineAllUnitsDeployedForCarrier(GlobalInit.controller, GlobalUnitsModel.Side.US, carrier)
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET) {
//     setUSMapRegions(usCSFStartHexes)
//     if (!GlobalGameState.usFleetPlaced) {
//       setCSFAlertShow(true)
//     }
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
//     setMidwayDialogShow(true)
//     GlobalGameState.phaseCompleted = false
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
//     if (!GlobalGameState.usFleetMoved) {
//       setUsFleetRegions()
//     } else {
//       setUSMapRegions([])
//       GlobalGameState.phaseCompleted = true
//     }
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
//     setJapanFleetRegions()
//     GlobalGameState.phaseCompleted = GlobalGameState.jpFleetMoved
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
//     setJapanMapRegions([])
//     GlobalGameState.phaseCompleted = true
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
//     setJapanMapRegions([])
//     GlobalGameState.phaseCompleted = true
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
//     setJapanMapRegions([])
//     GlobalGameState.phaseCompleted = true
//   } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
//     GlobalGameState.phaseCompleted = false
//     if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
//       setJapanStrikePanelEnabled(true)
//       setUsStrikePanelEnabled(false)
//       const units = GlobalInit.controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.JAPAN)
//       if (units.length === 0) {
//         GlobalGameState.phaseCompleted = true
//       } else {
//         GlobalGameState.phaseCompleted = false
//       }
//     } else {
//       setUsStrikePanelEnabled(true)
//       setJapanStrikePanelEnabled(false)
//       const units = GlobalInit.controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.US)
//       if (units.length === 0) {
//         GlobalGameState.phaseCompleted = true
//       } else {
//         GlobalGameState.phaseCompleted = false
//       }
//     }
//   }
//   // If we don't do this, a drag and drop move fires a fleet update and the fleet does not move
//   setFleetUnitUpdate(undefined)

//   GlobalGameState.updateGlobalState()
//   const enabledJapanBoxes = getJapanEnabledAirBoxes()
//   setEnabledJapanBoxes(() => enabledJapanBoxes)

//   const enabledUSBoxes = getUSEnabledAirBoxes()
//   setEnabledUSBoxes(() => enabledUSBoxes)
// }

async function loadHandler({
  setTestClicked,
  setSplash,
  setAirUnitUpdate,
  setFleetUnitUpdate,
  setStrikeGroupUpdate,
  loadState,
  id,
  setLoading,
}) {
  setTestClicked(true)
  console.log("Load game from local storage")
  setSplash(false)
  const { airUpdates, jpfleetUpdates, usfleetUpdates, jpStrikeUpdates, usStrikeUpdates, logItems } =
    loadGameStateForId(id)
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

  for (const update of jpStrikeUpdates) {
    setStrikeGroupUpdate(update)
    await delay(1)
  }
  for (const update of usStrikeUpdates) {
    setStrikeGroupUpdate(update)
    await delay(1)
  }

  GlobalGameState.logItems = new Array()
  for (let item of logItems.values()) {
    GlobalGameState.log(item)
  }

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
  GlobalGameState.nextAvailableDamageMarker = 0
  GlobalGameState.nextAvailableSunkMarker = 0
  if (GlobalGameState.totalMidwayHits === undefined) {
    GlobalGameState.totalMidwayHits = 0
    GlobalGameState.midwayBox0Damaged = false
    GlobalGameState.midwayBox1Damaged = false
    GlobalGameState.midwayBox2Damaged = false
  }
}

export default loadHandler
