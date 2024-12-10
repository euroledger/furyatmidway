import GlobalGameState from "../../../model/GlobalGameState"
import USHumanSetupAirState from "./USHumanSetupAirState"
import USHumanFleetMovementPlanningState from "./USHumanFleetMovementPlanning"
import USHumanFleetMovementState from "./USHumanFleetMovementState"
import USHumanAirSearchState from "./USHumanAirSearchState"
import USHumanAirOperationState from "./USHumanAirOperationState"

function mapGameStateToUSHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USHumanSetupAirState()

    case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
      return new USHumanFleetMovementPlanningState()

    case GlobalGameState.PHASE.US_FLEET_MOVEMENT:
      return new USHumanFleetMovementState()

    case GlobalGameState.PHASE.AIR_SEARCH:
      return new USHumanAirSearchState()

    case GlobalGameState.PHASE.AIR_OPERATIONS:
      return new USHumanAirOperationState()
      
    default:
  }
}

export default mapGameStateToUSHumanHandlerState
