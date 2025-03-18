import GlobalGameState from "../../../model/GlobalGameState"

class JapanHumanAttackTargetSelectionState {
  async doAction(stateObject) {
    console.log("++++++++++++++ IJN Attack Target Selection... do nothing")
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM IJN HUMAN ATTACK TARGET SELECTION...")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_1
  }

  getState() {
    return GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
  }
}

export default JapanHumanAttackTargetSelectionState
