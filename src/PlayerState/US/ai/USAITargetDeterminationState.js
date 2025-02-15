import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../DiceHandler"
import { DELAY_MS } from "../../StateUtils"

class USAITargetDeterminationState {
  async doAction(stateObject) {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    console.log("++++++++++++++ US TARGET DETERMINATION")
    GlobalGameState.testTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    GlobalGameState.updateGlobalState()

    await delay(1000)

    GlobalGameState.rollDice = true
    GlobalGameState.updateGlobalState()
  }

  async nextState(stateObject) {
     GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
  }

  getState() {
    return GlobalGameState.PHASE.TARGET_DETERMINATION
  }
}

export default USAITargetDeterminationState
