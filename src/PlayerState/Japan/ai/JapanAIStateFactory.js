import GlobalGameState from "../../../model/GlobalGameState"
import JapanAIMidwayDeclarationState from "./JapanAIMidwayDeclarationState"
import JapanAISetupAirState from "./JapanAISetupAirState"
import JapanAIFleetMovementState from "./JapanAIFleetMovementState"
import JapanAICardPlayState from "./JapanAICardPlayState"
import JapanAIAirOperationsState from "./JapanAIAirOperationsState"
import JapanAIEndOfAirOperationState from "./JapanAIEndOfAirOperationState"

function mapGameStateToJapanAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.JAPAN_SETUP:
      return new JapanAISetupAirState()
    case GlobalGameState.PHASE.JAPAN_MIDWAY:
      return new JapanAIMidwayDeclarationState()
    case GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT:
      return new JapanAIFleetMovementState()
    case GlobalGameState.PHASE.CARD_PLAY:
      return new JapanAICardPlayState()
    case GlobalGameState.PHASE.AIR_OPERATIONS:
      return new JapanAIAirOperationsState()
    case GlobalGameState.PHASE.END_OF_AIR_OPERATION:
      return new JapanAIEndOfAirOperationState()

    default:
      console.log("+++++ ERRROR +++++ NO JAPAN AI STATE FOUND FOR PHASE", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToJapanAIHandlerState
