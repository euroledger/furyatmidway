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
  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    gameId = `fam-#${GlobalGameState.gameSaveId}-${date}-GT${GlobalGameState.gameTurn}-END-MIDWAY-AIROP${
      GlobalGameState.airOpJapan + 1
    }`
  } else {
    if (side === GlobalUnitsModel.Side.US) {
      gameId = `fam-#${GlobalGameState.gameSaveId}-${date}-GT${GlobalGameState.gameTurn}-END-USAIROP${GlobalGameState.airOpUS}`
    } else {
      gameId = `fam-#${GlobalGameState.gameSaveId}-${date}-GT${GlobalGameState.gameTurn}-END-IJNAIROP${GlobalGameState.airOpJapan}`
    }
  }
  GlobalGameState.gameSaveId++

  saveGameState(controller, gameId)

  deleteAllAutoSavedGames(3)
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

    console.log(">>>> gameIdA=", gameIdA, "gameIdB=", gameIdB)
    return gameIdA - gameIdB
  })
  console.log("QUACK !!!!!!numToDelete=", numToDelete, "savedGameArray=", savedGameArray)
  let count = 1
  for (const savedGame of savedGameArray) {
    if (savedGame.includes("AIROP")) {
      console.log("REMOVE", "fam-#" + savedGame)
      localStorage.removeItem("fam-#" + savedGame)
    }
    console.log("NOW COUNT IS", count, "numToDelete IS", numToDelete)
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
