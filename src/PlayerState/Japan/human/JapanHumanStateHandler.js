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

  async doAction(stateObject) {
    // do nothing (human does stuff)
    console.log("HUMAN STATE HANDLER now firing do action for stateObject", stateObject)
    await this.currentState.doAction(stateObject)
    this.stateObject = stateObject

  }

  async doNextState(stateObject) {
    this.stateObject = stateObject ?? this.stateObject
    console.log("POPCORN: this.currentState=", this.currentState, "State Object=", this.stateObject)
    this.currentState = await this.currentState.nextState(this.stateObject) ?? this.currentState
    console.log("POPCORN 2 AFTER: this.currentState=", this.currentState)

  }
}

export default JapanHumanStateHandler
