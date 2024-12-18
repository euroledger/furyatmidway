import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import midwayAttackDecision from "../../../UIEvents/AI/MidwayAttackDeclarationBot"

class JapanHumanDMCVFleetMovementState {
  async doAction(stateObject) {
    const { setUSMapRegions, setJapanMapRegions, setJapanMIFMapRegions, setJpAlertShow, setEnabledJapanFleetBoxes } =
      stateObject

      console.log("DO DMCV FLEET MOVEMENT JAPAN")
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER JAPAN DMCV FLEET MOVEMENT....")
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
  }
}

export default JapanHumanDMCVFleetMovementState
