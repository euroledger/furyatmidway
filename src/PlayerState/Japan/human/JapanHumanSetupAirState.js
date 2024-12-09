import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"


class JapanHumanSetupState {
  async doAction(stateObject) {
    
  }

  async nextState() {
    if (GlobalGameState.currentCarrier <= 2) {
      GlobalGameState.currentCarrier++
      GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
      GlobalInit.controller.drawJapanCards(3, true)
      GlobalGameState.jpCardsDrawn = true
    }
    GlobalGameState.phaseCompleted = false
    GlobalGameState.setupPhase++
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_SETUP
  }
}

export default JapanHumanSetupState
