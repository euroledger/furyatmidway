import GlobalGameState from "../../../model/GlobalGameState"
import PlayerStateHandler from "../../PlayerStateHandler"
import JapanSetupState from "./JapanAISetupAirState"
import JapanAICardDrawState from "./JapanAICardDrawState"

class JapanAIStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject, new JapanSetupState())
  }

  getState() {
    return this.currentState.getState()
  }

  async doAction() {
    await this.currentState.doAction(this.stateObject)
    if (this.getState() === GlobalGameState.PHASE.JAPAN_SETUP) {
      this.currentState = new JapanAICardDrawState()
    }
    this.actionComplete = true
    this.finishStateChange()
  }

  async doNextState() {
    this.currentState.nextState(this.stateObject)
  }
}

export default JapanAIStateHandler
