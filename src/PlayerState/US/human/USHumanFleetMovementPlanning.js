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
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USHumanFleetMovementPlanningState
