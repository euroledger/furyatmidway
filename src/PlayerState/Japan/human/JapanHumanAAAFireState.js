import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { moveOnFromAAAFire } from "../../StateTransition"

class JapanHumanAAAFireState {
  async doAction(stateObject) {
    console.log(">>>>>>>> JAPAN AAA FIRE")
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM JAPAN AAA!")
    await moveOnFromAAAFire(GlobalUnitsModel.Side.US, stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
  }
}

export default JapanHumanAAAFireState
