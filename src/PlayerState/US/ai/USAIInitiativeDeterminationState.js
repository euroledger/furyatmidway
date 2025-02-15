import GlobalGameState from "../../../model/GlobalGameState"

class USAIInitiativeDeterminationState {
  async doAction(stateObject) {
    
  }

  async nextState(stateObject) {
    // console.log("TRIGGER STATE CHANGE TO AIR_OPERATIONS")
    // GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
  }

  getState() {
    return GlobalGameState.PHASE.INITIATIVE_DETERMINATION
  }
}

export default USAIInitiativeDeterminationState
