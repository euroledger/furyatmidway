import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { selectTFTarget } from "../../../UIEvents/AI/USAirCombatBot"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import { rollZeDice } from "../../StateUtils"

class JapanHumanTargetDeterminationState {
  async doAction(stateObject) {
    // GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    console.log("++++++++++++++ IJN TARGET DETERMINATION")
    // await selectTFTarget(GlobalInit.controller, stateObject)
    // rollZeDice()
  }

  async nextState(stateObject) {
    console.log("JapanHumanTargetDeterminationState -> nextState() !!!!!!!!!!!!!!!")


    // TODO -> USAICapInterception state
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
  }

  getState() {
    return GlobalGameState.PHASE.TARGET_DETERMINATION
  }
}

export default JapanHumanTargetDeterminationState
