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
    console.log("QUACK this.stateObject=", this.stateObject)
    await this.currentState.doAction(this.stateObject)
    if (this.getState() === GlobalGameState.PHASE.JAPAN_SETUP) {
      console.log("QUACK 3", this.currentState)

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
