import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { selectTFTarget } from "../../../UIEvents/AI/USAirCombatBot"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import { rollZeDice } from "../../StateUtils"

class USAITargetDeterminationState {
  async doAction(stateObject) {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    console.log("++++++++++++++ US TARGET DETERMINATION")
    await selectTFTarget(GlobalInit.controller, stateObject)
    rollZeDice()
    await delay(10)
    GlobalGameState.testTarget = undefined
  }

  async nextState(stateObject) {
    console.log("USAITargetDetermination -> nextState() !!!!!!!!!!!!!!!")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    GlobalGameState.doneCapSelection = false
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
  }

  getState() {
    return GlobalGameState.PHASE.TARGET_DETERMINATION
  }
}

export default USAITargetDeterminationState
