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
  }
}

export default JapanHumanStateHandler
