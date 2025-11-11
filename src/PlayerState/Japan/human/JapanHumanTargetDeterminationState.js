import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { selectTFTarget } from "../../../UIEvents/AI/USAirCombatBot"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import { rollZeDice } from "../../StateUtils"

class JapanHumanTargetDeterminationState {
  async doAction(stateObject) {
    console.log("++++++++++++++ IJN TARGET DETERMINATION")
  }

  async nextState(stateObject) {
    const { setCardNumber } = stateObject
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    GlobalGameState.testCapSelection = -1

    GlobalGameState.doneCapSelection = false
    if (GlobalInit.controller.japanHandContainsCard(12)) {
      setCardNumber(() => 12)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
    }
  }

  getState() {
    return GlobalGameState.PHASE.TARGET_DETERMINATION
  }
}

export default JapanHumanTargetDeterminationState
