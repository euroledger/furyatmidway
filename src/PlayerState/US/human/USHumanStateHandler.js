import PlayerStateHandler from "../../PlayerStateHandler"
import USSetupFleetState from "./USHumanSetupFleetState"

class USHumanStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject, new USSetupFleetState(), )
  }
  getState() {
    return this.currentState.getState()
  }
  
  async doAction() {
    // human stuff here, e.g., set map regions, display dialog etc
    this.currentState.doAction(this.stateObject)
  }

  async doNextState() {
    this.currentState = await this.currentState.nextState(this.stateObject)
  }

}

export default USHumanStateHandler
