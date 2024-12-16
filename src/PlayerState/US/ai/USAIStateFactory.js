import GlobalGameState from "../../../model/GlobalGameState"
import USAISetupAirState from "./USAISetupAirState"
import USAICardDrawState from "./USAICardDrawState"
import USAIFleetMovementPlanningState from "./USAIFleetMovementPlanningState"

function mapGameStateToUSAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USAISetupAirState()
    case GlobalGameState.PHASE.US_CARD_DRAW:
      return new USAICardDrawState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
      return new USAIFleetMovementPlanningState()
    default:
      console.log("ERROR unexpected game state", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToUSAIHandlerState
