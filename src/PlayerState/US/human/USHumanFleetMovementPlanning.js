import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { goToDMCVState } from "../../StateUtils"

class USHumanFleetMovementPlanningState {
  async doAction(stateObject) {
    const { setUsFleetRegions } = stateObject

    setUsFleetRegions()
  }

  async nextState(stateObject) {
    const { setUSMapRegions} = stateObject
    setUSMapRegions([])
    // if (goToDMCVState(GlobalUnitsModel.Side.JAPAN)) {
    //     GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
    // } else {
        GlobalGameState.initial1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
    // }
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USHumanFleetMovementPlanningState
