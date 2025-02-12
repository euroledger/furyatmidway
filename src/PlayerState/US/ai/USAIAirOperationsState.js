import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import {
  generateUSAirOperationsMovesCarriers,
  generateUSAirOperationsMovesMidway,
  moveStrikeGroups
} from "../../../UIEvents/AI/USAirOperationsBot"

class USAIAirOperationsState {
  async doAction(stateObject) {
    console.log("DO US AIR OPERATION...")
    await generateUSAirOperationsMovesCarriers(GlobalInit.controller, stateObject)
    await generateUSAirOperationsMovesMidway(GlobalInit.controller, stateObject)
    await moveStrikeGroups(GlobalInit.controller, stateObject)
  }

  async nextState(stateObject) {}

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USAIAirOperationsState
