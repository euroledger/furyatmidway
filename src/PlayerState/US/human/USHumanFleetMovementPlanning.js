import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { goToDMCVState } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"

class USHumanFleetMovementPlanningState {
  async doAction(stateObject) {
    const { setUsFleetRegions } = stateObject

    setUsFleetRegions()
  }

  async nextState(stateObject) {
    const { setUSMapRegions } = stateObject
    setUSMapRegions([])

    GlobalGameState.initial1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    GlobalGameState.initialMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
    GlobalGameState.initialDMCVLocation = GlobalInit.controller.getFleetLocation(
      "IJN-DMCV",
      GlobalUnitsModel.Side.JAPAN
    )
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USHumanFleetMovementPlanningState
