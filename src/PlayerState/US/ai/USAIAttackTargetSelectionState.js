import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { doTargetSelection } from "../../../UIEvents/AI/USAirCombatBot"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class USAIAttackTargetSelectionState {
  async doAction(stateObject) {
    const { setAttackAirCounterUpdate } = stateObject
    console.log("++++++++++++++ US Attack Target Selection")
    const strikeUnits = GlobalInit.controller.getAttackingStrikeUnits(true)

    await doTargetSelection(GlobalInit.controller, strikeUnits, GlobalUnitsModel.Side.JAPAN, setAttackAirCounterUpdate)
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM US AI ATTACK TARGET SELECTION...")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_1
  }

  getState() {
    return GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
  }
}

export default USAIAttackTargetSelectionState
