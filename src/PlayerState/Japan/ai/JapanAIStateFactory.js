import GlobalGameState from "../../../model/GlobalGameState"
import JapanAIMidwayDeclarationState from "./JapanAIMidwayDeclarationState"
import JapanAISetupAirState from "./JapanAISetupAirState"
import JapanAIFleetMovementState from "./JapanAIFleetMovementState"

function mapGameStateToJapanAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.JAPAN_SETUP:
      return new JapanAISetupAirState()

    case GlobalGameState.PHASE.JAPAN_MIDWAY:
      return new JapanAIMidwayDeclarationState()

    case GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT:
      return new JapanAIFleetMovementState()
    default:
  }
}

export default mapGameStateToJapanAIHandlerState
