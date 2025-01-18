import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { generateUSAirOperationsMovesCarriers } from "../../../UIEvents/AI/USAirOperationsBot"

class USAIAirOperationsState {
 
  async doAction(stateObject) {
    console.log("DO US AIR OPERATION...")
    await generateUSAirOperationsMovesCarriers(GlobalInit.controller, stateObject)
  }

  async nextState(stateObject) {
  
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USAIAirOperationsState
