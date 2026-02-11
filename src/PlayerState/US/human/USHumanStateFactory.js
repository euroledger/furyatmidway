import GlobalGameState from "../../../model/GlobalGameState"
import USHumanSetupAirState from "./USHumanSetupAirState"
import USHumanFleetMovementPlanningState from "./USHumanFleetMovementPlanning"
import USHumanFleetMovementState from "./USHumanFleetMovementState"
import USHumanAirSearchState from "./USHumanAirSearchState"
import USHumanAirOperationState from "./USHumanAirOperationState"
import USHumanCardDrawState from "./USHumanCardDrawState"
import USHumanSetupFleetState from "./USHumanSetupFleetState"
import USHumanCardPlayState from "./USHumanCardPlayState"
import USHumanEndOfAirOperationState from "./USHumanEndOfAirOperationState"

function mapGameStateToUSHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USHumanSetupAirState()
    case GlobalGameState.PHASE.US_SETUP_FLEET:
      return new USHumanSetupFleetState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
      return new USHumanFleetMovementPlanningState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT:
      return new USHumanFleetMovementState()
    case GlobalGameState.PHASE.AIR_SEARCH:
      return new USHumanAirSearchState()
    case GlobalGameState.PHASE.AIR_OPERATIONS:
      return new USHumanAirOperationState()
    case GlobalGameState.PHASE.US_CARD_DRAW:
      return new USHumanCardDrawState()
    case GlobalGameState.PHASE.CARD_PLAY:
      return new USHumanCardPlayState()
    case GlobalGameState.PHASE.END_OF_AIR_OPERATION:
      return new USHumanEndOfAirOperationState()
    default:
      console.log("+++++ ERRROR +++++ NO US HUMAN STATE FOUND FOR PHASE", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToUSHumanHandlerState
