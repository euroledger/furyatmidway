import GlobalGameState from "../../../model/GlobalGameState"
import USAIInitiativeDeterminationState from "./USAIInitiativeDeterminationState"

class USAIAirSearchState {
  async doAction(stateObject) {
    // if ai vs ai do the initiative roll here and move the state on
    // ??????
  }

  async nextState(stateObject) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    return new USAIInitiativeDeterminationState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USAIAirSearchState
