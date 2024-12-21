import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { generateUSAirOperationsMoves } from "../../../UIEvents/AI/USAirOperationsBot"

class USAIAirOperationsState {
 
  async doAction(stateObject) {
    console.log("DO US AIR OPERATION...")
    generateUSAirOperationsMoves(GlobalInit.controller)
  }

  async nextState(stateObject) {
  
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USAIAirOperationsState
