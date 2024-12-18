import GlobalGameState from "../../../model/GlobalGameState"
import USAIInitiativeDeterminationState from "./USAIInitiativeDeterminationState"

class USAIAirSearchState {
  async doAction(stateObject) {
    // if ai vs ai do the initiative roll here and move the state on
    // ??????
  }

  async nextState(stateObject) {
    
    GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    console.log("LOTS OF US AI POO NOW GLOBAL GAME STATE game phase=", GlobalGameState.gamePhase)
    return new USAIInitiativeDeterminationState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USAIAirSearchState
