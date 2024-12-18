import GlobalGameState from "../../../model/GlobalGameState"
import PlayerStateHandler from "../../PlayerStateHandler"
import USAISetupFleetState from "./USAISetupFleetState"
import USAISetupAirState from "./USAISetupAirState"

class USAIStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject,  new USAISetupFleetState())
  }

  async doAction(stateObject) {
    // if (this.getState() === GlobalGameState.PHASE.US_SETUP_FLEET) {
    //     await this.currentState.doAction(this.stateObject)

    //     // next state is US Fleet Setup
    //     this.currentState = new USAISetupFleetState()
    if (this.getState() === GlobalGameState.PHASE.US_SETUP_AIR) {
      await this.currentState.doAction(stateObject)
      await this.currentState.nextState(stateObject)
      return
    }
    this.actionComplete = true
    await this.currentState.doAction(stateObject)

  }

  async doNextState() {
    console.log("CRISPS: this.currentState=", this.currentState)
    this.currentState = await this.currentState.nextState(this.stateObject)
    console.log("CRISPS 2 AFTER: this.currentState=", this.currentState)

  }
}

export default USAIStateHandler
