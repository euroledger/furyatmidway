import GlobalGameState from "../../../model/GlobalGameState"
import USHumanInitiativeDeterminationState from "./USHumanInitiativeDeterminationState"

class USHumanAirSearchState {
  async doAction(stateObject) {
    
  }

  async nextState(stateObject) {
    
    GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    console.log("LOTS OF POO NOW GLOBAL GAME STATE game phase=", GlobalGameState.gamePhase)
    return new USHumanInitiativeDeterminationState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USHumanAirSearchState
