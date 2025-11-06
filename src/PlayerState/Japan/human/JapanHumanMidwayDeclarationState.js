import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { midwayPossible, goToDMCVState } from "../../StateUtils"

class JapanHumanMidwayDeclarationState {
  async doAction(stateObject) {
    const { setMidwayWarningShow, setMidwayDialogShow } = stateObject
    console.log("DO (HUMAN) MIDWAY DECLARATION ACTION")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    midwayPossible(GlobalInit.controller, setMidwayWarningShow, setMidwayDialogShow)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER human MIDWAY....US FLEET MOVEMENT")

    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US

    // // See if we should go to US DMCV Fleet Planning first
    if (goToDMCVState(GlobalUnitsModel.Side.US) && !GlobalGameState.dmcvChecked) {
      GlobalGameState.dmcvChecked = true
      console.log("++++++++++++++++++++++++++++ GO TO US DMCV FLEET PLANNING")

      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
    } else {
      console.log(">>>>>>>>> SET PHASE TO US_FLEET_MOVEMENT_PLANNING")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
    }
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_MIDWAY
  }
}

export default JapanHumanMidwayDeclarationState
