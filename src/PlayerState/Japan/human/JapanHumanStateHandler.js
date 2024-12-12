import GlobalGameState from "../../../model/GlobalGameState"
import PlayerStateHandler from "../../PlayerStateHandler"
import JapanAISetupState from "../ai/JapanAISetupAirState"

class JapanHumanStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject, new JapanAISetupState(), )
  }
  getState() {
    return GlobalGameState.PHASE.JAPAN_SETUP
  }

  async doAction() {
    // do nothing (human does stuff)
    console.log("HUMAN STATE HANDLER now firing do action for state", this.currentState)
    await this.currentState.doAction(this.stateObject)

  }

  async doNextState() {
    console.log("POPCORN: this.currentState=", this.currentState)
    this.currentState = await this.currentState.nextState(this.stateObject)
    console.log("POPCORN 2 AFTER: this.currentState=", this.currentState)

  }
}

export default JapanHumanStateHandler
