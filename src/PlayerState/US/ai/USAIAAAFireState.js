import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { moveOnFromAAAFire } from "../../StateTransition"
import { delay } from "../../../Utils"

class USAIAAAFireState {
  async doAction(stateObject) {
    console.log(">>>>>>>> US AAA FIRE")
    // ANIT AIRCRAFT FIRE
    GlobalGameState.rollDice = false
    GlobalGameState.updateGlobalState()
    await delay(800)
    GlobalGameState.rollDice = true
    await delay(10)
    GlobalGameState.updateGlobalState()
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM US AAA!")
    await moveOnFromAAAFire(GlobalUnitsModel.Side.JAPAN, stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
  }
}

export default USAIAAAFireState
