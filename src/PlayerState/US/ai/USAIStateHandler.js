import GlobalGameState from "../../../model/GlobalGameState"
import PlayerStateHandler from "../../PlayerStateHandler"
import USAISetupFleetState from "./USAISetupFleetState"
import USAISetupAirState from "./USAISetupAirState"

class USAIStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject,  new USAISetupFleetState())
  }

  async doAction() {
    // if (this.getState() === GlobalGameState.PHASE.US_SETUP_FLEET) {
    //     await this.currentState.doAction(this.stateObject)

    //     // next state is US Fleet Setup
    //     this.currentState = new USAISetupFleetState()
    // } else if (this.getState() === GlobalGameState.PHASE.US_SETUP_AIR) {
    //   await this.currentState.doAction(this.stateObject)
    // }
    this.actionComplete = true
    await this.currentState.doAction(this.stateObject)

  }
}

export default USAIStateHandler
