import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { midwayPossible } from "../../StateUtils"

class JapanHumanMidwayDeclarationState {
  async doAction(stateObject) {
    const { setMidwayWarningShow, setMidwayDialogShow } = stateObject
    console.log("DO (HUMAN) MIDWAY DECLARATION ACTION")
    midwayPossible(GlobalInit.controller, setMidwayWarningShow, setMidwayDialogShow)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER human MIDWAY....US FLEET MOVEMENT")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_MIDWAY
  }
}

export default JapanHumanMidwayDeclarationState
