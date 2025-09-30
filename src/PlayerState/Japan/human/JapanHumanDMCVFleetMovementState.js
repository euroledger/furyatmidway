import GlobalGameState from "../../../model/GlobalGameState"
import { japanDMCVPlanningHandler } from "../../StateUtils"

class JapanHumanDMCVFleetMovementState {
  async doAction(stateObject) {
    const { setUSMapRegions, setJapanFleetRegions, setEnabledUSFleetBoxes } = stateObject

    console.log("++++++++++ WANK -> DO DMCV FLEET MOVEMENT JAPAN")

    GlobalGameState.jpDMCVFleetMoved = false
    GlobalGameState.phaseCompleted = true // placing DMCV is not mandatory
    setUSMapRegions([])
    setJapanFleetRegions()
    setEnabledUSFleetBoxes(false)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER JAPAN DMCV FLEET MOVEMENT....")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
  }
}

export default JapanHumanDMCVFleetMovementState
