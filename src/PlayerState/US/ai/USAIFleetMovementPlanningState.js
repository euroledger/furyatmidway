import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { goToDMCVState } from "../../StateUtils"
import { getUSFleetRegions } from "../../StateUtils"
import { doUSFleetMovementAction } from "../../../UIEvents/AI/USFleetMovementBot"

class USAIFleetMovementPlanningState {
  async doAction(stateObject) {
    const  { canCSFMoveFleetOffBoard, usCSFRegions } = getUSFleetRegions()

    console.log(">>>>>>>>>> HEX REGIONS FOR CSF:", usCSFRegions)
    const destinatio = doUSFleetMovementAction(usCSFRegions, canCSFMoveFleetOffBoard)
    console.log("US FLEET DESTINATION:", destination)
  }

  dmcvState(side) {
    if (GlobalGameState.jpDMCVCarrier === undefined) {
      return false
    }
    const jpDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
  
    if (jpDMCVLocation !== undefined && jpDMCVLocation.boxName === HexCommand.FLEET_BOX) {
      return false
    }
    return (
      (GlobalInit.controller.getDamagedCarriers(side).length > 0 && GlobalGameState.jpDMCVFleetPlaced === false) ||
      (jpDMCVLocation !== undefined && GlobalGameState.jpDMCVFleetPlaced === true)
    )
  }
  async nextState(stateObject) {
    if (goToDMCVState(GlobalUnitsModel.Side.JAPAN)) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
    } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
    }
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USAIFleetMovementPlanningState
