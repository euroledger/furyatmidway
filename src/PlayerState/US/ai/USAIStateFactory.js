import GlobalGameState from "../../../model/GlobalGameState"
import USAISetupAirState from "./USAISetupAirState"
import USAICardDrawState from "./USAICardDrawState"
import USAIFleetMovementPlanningState from "./USAIFleetMovementPlanningState"
import USAIFleetMovementState from "./USAIFleetMovementState"
import USAICardPlayState from "./USAICardPlayState"
import USAIAirOperationsState from "./USAIAirOperationsState"

function mapGameStateToUSAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USAISetupAirState()
    case GlobalGameState.PHASE.US_CARD_DRAW:
      return new USAICardDrawState()
    case GlobalGameState.PHASE.CARD_PLAY:
      return new USAICardPlayState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
      return new USAIFleetMovementPlanningState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT:
      return new USAIFleetMovementState()
    case GlobalGameState.PHASE.AIR_OPERATIONS:
      return new USAIAirOperationsState()

    default:
      console.log("ERROR unexpected game state", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToUSAIHandlerState
