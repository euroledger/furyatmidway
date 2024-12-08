import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { usCSFStartHexes } from "../../components/MapRegions"

class JapanCardDrawState {
  async doAction(stateObject) {
    console.log("DO CARD ACTION")
    this.nextState(stateObject)
  }

  nextState(stateObject) {
    console.log("NEXT STATE FROM JAPAN CARD DRAW")
    const { setUSMapRegions, setCSFAlertShow} = stateObject

    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_FLEET
    GlobalGameState.currentCarrier = 0
    // if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
    //     setUSMapRegions(usCSFStartHexes)
    //     setCSFAlertShow(true)
    // }
    GlobalGameState.phaseCompleted = false
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_CARD_DRAW
  }
}

export default JapanCardDrawState
