import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import USHumanCardDrawState from "./USHumanCardDrawState"
import { usCSFStartHexes } from "../../../components/MapRegions"

class USHumanSetupAirState {
  async doAction(stateObject) {
   
  }

  nextState(stateObject) {
    GlobalGameState.currentCarrier++
    GlobalGameState.setupPhase++
    GlobalGameState.currentTaskForce =
      GlobalGameState.currentCarrier <= 1 ? 1 : GlobalGameState.currentCarrier === 2 ? 2 : 3 // 3 is Midway
    if (GlobalGameState.currentCarrier === 4) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_CARD_DRAW
      
      GlobalGameState.usSetUpComplete = true
      GlobalInit.controller.drawUSCards(2, true)
      GlobalGameState.usCardsDrawn = true
      GlobalGameState.phaseCompleted = false
      return new USHumanCardDrawState()
    }
    GlobalGameState.phaseCompleted = false
    return this
  }

  getState() {
    return GlobalGameState.PHASE.US_SETUP_AIR
  }
}

export default USHumanSetupAirState
