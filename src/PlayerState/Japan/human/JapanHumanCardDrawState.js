import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanCardDrawState {
  async doAction(stateObject) {}

  async nextState(stateObject) {

    console.log("MOVE ON FROM JAPAN CARDS!")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_FLEET
    GlobalGameState.currentCarrier = 0
    GlobalGameState.phaseCompleted = false
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_CARD_DRAW
  }
}

export default JapanHumanCardDrawState
