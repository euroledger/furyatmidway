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
    const { setCardNumber } = stateObject
    console.log("USAITargetDetermination -> nextState() !!!!!!!!!!!!!!!")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    GlobalGameState.doneCapSelection = false
    if (GlobalInit.controller.japanHandContainsCard(9)) {
      setCardNumber(() => 9)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    } else if (GlobalInit.controller.japanHandContainsCard(12)) {
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

export default USAITargetDeterminationState
