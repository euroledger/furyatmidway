import GlobalGameState from "../../../model/GlobalGameState"
import PlayerStateHandler from "../../PlayerStateHandler"
import USHumanSetupAirState from "../human/USHumanSetupAirState"
class USAIStateHandler extends PlayerStateHandler {
  constructor(stateObject) {
    super(stateObject,  new USSetupFleetState())
  }

  async doAction() {
    if (this.getState() === GlobalGameState.PHASE.US_SETUP_FLEET) {
        await this.currentState.doAction(this.stateObject)

        // next state is US Air Setup
        // this.currentState = new JapanCardDrawState()
        console.log("QUACK 4", this.currentState)

        this.currentState = new USHumanSetupAirState()

    } else if (this.getState() === GlobalGameState.PHASE.US_SETUP_AIR) {
      await this.currentState.doAction(this.stateObject)
    }
    this.actionComplete = true
  }
}

export default USAIStateHandler
