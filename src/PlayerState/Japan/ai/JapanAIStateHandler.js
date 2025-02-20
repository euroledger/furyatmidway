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

  async doAction(stateObject) {
    await this.currentState.doAction(stateObject)
    this.stateObject = stateObject
    if (this.getState() === GlobalGameState.PHASE.JAPAN_SETUP) {
      this.currentState = new JapanAICardDrawState()
    }
    this.actionComplete = true
    this.finishStateChange()
  }

  async doNextState() {
    console.log("MARSHMALLOWS: this.currentState=", this.currentState)
    this.currentState.nextState(this.stateObject)
    console.log("MARSHMALLOWS 2 AFTER: this.currentState=", this.currentState)
  }
}

export default JapanAIStateHandler
