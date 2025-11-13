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
  const date = getDateStamp()
  let gameId
  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    gameId = `fam-${date}-GT${GlobalGameState.gameTurn}-END-MIDWAY-AIROP${GlobalGameState.airOpJapan+1}`
  } else {
    if (side === GlobalUnitsModel.Side.US) {
      gameId = `fam-${date}-GT${GlobalGameState.gameTurn}-END-USAIROP${GlobalGameState.airOpUS}`
    } else {
      gameId = `fam-${date}-GT${GlobalGameState.gameTurn}-END-IJNAIROP${GlobalGameState.airOpJapan}`
    }
  }

  console.log("AUTO SAVE->", gameId)
  saveGameState(controller, gameId)
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
