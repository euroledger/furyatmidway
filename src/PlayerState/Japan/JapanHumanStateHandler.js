import GlobalGameState from "../../model/GlobalGameState"
import PlayerStateHandler from "../PlayerStateHandler"
import JapanSetupState from "./JapanSetupState"

class JapanHumanStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject, new JapanSetupState(), )
  }
  getState() {
    return GlobalGameState.PHASE.JAPAN_SETUP
  }

  async doAction() {
    // do nothing (human does stuff)
  }
}

export default JapanHumanStateHandler
