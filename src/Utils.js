import GlobalGameState from "./model/GlobalGameState"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import { saveGameState } from "./SaveLoadGame"

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function getRandomElementFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function sideBeingAttacked() {
  return GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
    ? GlobalUnitsModel.Side.JAPAN
    : GlobalUnitsModel.Side.US
}

export function autoSave(controller, side) {
  // Auto save current game state and delete previous games preserving last 3 (only)
  const date = getDateStamp()
  let gameId
  GlobalGameState.gameSaveId = GlobalGameState.gameSaveId ?? 1

  let jpStr = "END-IJNAIROP" + GlobalGameState.airOpJapan
  let usStr = "END-USAIROP" + GlobalGameState.airOpUS

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN) {
    jpStr = "END-IJNNIGHTAIROP"
  }
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) {
    usStr = "END-USNIGHTAIROP"
  }
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
    jpStr = "END-IJNFLEETMOVE"
  }
  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    gameId = `fam-#${GlobalGameState.gameSaveId}-${date}-GT${GlobalGameState.gameTurn}-END-MIDWAY-AIROP${
      GlobalGameState.airOpJapan + 1
    }`
  } else {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      gameId = `fam-#${GlobalGameState.gameSaveId}-${date}-GT${GlobalGameState.gameTurn}-${jpStr}`
    } else {
      gameId = `fam-#${GlobalGameState.gameSaveId}-${date}-GT${GlobalGameState.gameTurn}-${usStr}`
    }
  }
  GlobalGameState.gameSaveId++

  saveGameState(controller, gameId)

  deleteAllAutoSavedGames(5)
}

export function deleteAllAutoSavedGames(numToPreserve) {
  if (!numToPreserve) {
    numToPreserve = 0
  }
  let keys = Object.keys(localStorage)
  const savedGameArray = keys.filter((key) => key.startsWith("fam-#")).map((item) => item.replace("fam-#", ""))

  let numToDelete = savedGameArray.length

  if (numToPreserve && numToDelete <= numToPreserve) {
    return
  }

  numToDelete = savedGameArray.length - numToPreserve

  savedGameArray.sort((a, b) => {
    const tokensArrayA = a.split("-")
    const tokensArrayB = b.split("-")
    const gameIdA = parseInt(tokensArrayA[0])
    const gameIdB = parseInt(tokensArrayB[0])

    return gameIdA - gameIdB
  })
  let count = 1
  for (const savedGame of savedGameArray) {
    if (savedGame.includes("AIROP") || savedGame.includes("FLEETMOVE")) {
      localStorage.removeItem("fam-#" + savedGame)
    }
    if (count >= numToDelete) {
      break
    }
    count++
  }
  GlobalGameState.updateGlobalState()
}

export function getDateStamp() {
  const date = new Date()
  const datevalues = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
  return `${datevalues.year}-${datevalues.month}-${datevalues.day}`
}
