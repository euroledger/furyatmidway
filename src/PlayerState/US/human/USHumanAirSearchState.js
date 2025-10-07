import GlobalGameState from "../../../model/GlobalGameState"
import USHumanInitiativeDeterminationState from "./USHumanInitiativeDeterminationState"

class USHumanAirSearchState {
  async doAction(stateObject) {
    
  }

  async nextState(stateObject) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    return new USHumanInitiativeDeterminationState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USHumanAirSearchState
