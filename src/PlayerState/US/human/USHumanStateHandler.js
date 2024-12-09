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
    // do nothing (human does stuff)
  }

  async doNextState() {
    this.currentState = await this.currentState.nextState(this.stateObject)
    console.trace()
    console.log("SET NEXT STATE TO", this.currentState)
  }

}

export default USHumanStateHandler
