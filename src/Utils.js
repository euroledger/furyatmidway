import GlobalGameState from "./model/GlobalGameState"
import GlobalUnitsModel from "./model/GlobalUnitsModel"

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
