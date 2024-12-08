import GlobalGameState from "../../model/GlobalGameState"
import PlayerStateHandler from "../PlayerStateHandler"

class USAIStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject,  new USSetupFleetState())
  }

  async doAction() {
    if (this.getState() === GlobalGameState.PHASE.US_SETUP_FLEET) {
        await this.currentState.doAction(this.stateObject)

        // next state is US Air Setup
        // this.currentState = new JapanCardDrawState()
        this.currentState = new USSetupAirState()

    } else if (this.getState() === GlobalGameState.PHASE.US_SETUP_AIR) {
      await this.currentState.doAction(this.stateObject)

      // next state is US Air Setup
      // this.currentState = new JapanCardDrawState()
      // this.currentState = new USSetupAirState()
    }
    this.actionComplete = true
  }
}

export default USAIStateHandler
