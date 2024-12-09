import GlobalGameState from "../../../model/GlobalGameState"
import USHumanSetupAirState from "./USHumanSetupAirState"
import USHumanFleetMovementPlanningState from "./USHumanFleetMovementPlanning"

function mapGameStateToUSHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USHumanSetupAirState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
      return new USHumanFleetMovementPlanningState()
    default:
  }
}

export default mapGameStateToUSHumanHandlerState
