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
    console.log("DO HUMAN STUFF HERE-> :-)")
    await this.currentState.doAction(this.stateObject)
  }

  async doNextState() {
    console.log("BISCUITS: this.currentState=", this.currentState)
    this.currentState = await this.currentState.nextState(this.stateObject)
    console.log("BISCUITS 2 AFTER: this.currentState=", this.currentState)

  }

}

export default USHumanStateHandler
