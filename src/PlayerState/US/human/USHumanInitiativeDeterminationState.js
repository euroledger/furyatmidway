import GlobalGameState from "../../../model/GlobalGameState"

class USHumanInitiativeDeterminationState {
  async doAction(stateObject) {
    
  }

  async nextState(stateObject) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
  }

  getState() {
    return GlobalGameState.PHASE.INITIATIVE_DETERMINATION
  }
}

export default USHumanInitiativeDeterminationState
