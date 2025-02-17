import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { selectTFTarget } from "../../../UIEvents/AI/USAirCombatBot"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"

class USAITargetDeterminationState {
  async doAction(stateObject) {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    console.log("++++++++++++++ US TARGET DETERMINATION")
    await selectTFTarget(GlobalInit.controller, stateObject)
    await delay(1000)
    GlobalGameState.rollDice = true
    GlobalGameState.updateGlobalState()
  }

  async nextState(stateObject) {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
  }

  getState() {
    return GlobalGameState.PHASE.TARGET_DETERMINATION
  }
}

export default USAITargetDeterminationState
