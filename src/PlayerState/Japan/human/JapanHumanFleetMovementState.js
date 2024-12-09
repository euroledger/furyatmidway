import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import midwayAttackDecision from "../../../UIEvents/AI/MidwayAttackDeclarationBot"

class JapanHumanFleetMovementState {
  async doAction(stateObject) {
    const { setUSMapRegions, setJapanMapRegions, setJapanMIFMapRegions, setJpAlertShow, setEnabledJapanFleetBoxes } =
      stateObject
    console.log("DO IJN FLEET MOVEMENT")

    // @TODO call initialiseIJNFleetMovement here
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER FLEET MOVEMENT....")
    // GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }
}

export default JapanHumanFleetMovementState
