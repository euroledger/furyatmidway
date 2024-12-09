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
    if (this.getState() === GlobalGameState.PHASE.JAPAN_SETUP) {
        await this.currentState.doAction(this.stateObject)
        this.currentState = new JapanAICardDrawState()
    } else if (this.getState() === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
      await this.currentState.doAction(this.stateObject)
    }
    this.actionComplete = true
    this.finishStateChange()
  }
}

export default JapanAIStateHandler
