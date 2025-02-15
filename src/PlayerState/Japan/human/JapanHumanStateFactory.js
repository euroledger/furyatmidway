import GlobalGameState from "../../../model/GlobalGameState"
import JapanHumanSetupAirState from "./JapanHumanSetupAirState"
import JapanHumanMidwayDeclarationState from "./JapanHumanMidwayDeclarationState"
import JapanHumanCardPlayState from "./JapanHumanCardPlayState"
import JapanHumanCardDrawState from "./JapanHumanCardDrawState"
import JapanHumanFleetMovementState from "./JapanHumanFleetMovementState"
import JapanHumanEndOfAirOperationState from "./JapanHumanEndOfAirOperationState"

function mapGameStateToJapanHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.JAPAN_SETUP:
      return new JapanHumanSetupAirState()

    case GlobalGameState.PHASE.JAPAN_CARD_DRAW:
      return new JapanHumanCardDrawState()

    case GlobalGameState.PHASE.JAPAN_MIDWAY:
      return new JapanHumanMidwayDeclarationState()

    case GlobalGameState.PHASE.CARD_PLAY:
      return new JapanHumanCardPlayState()

    case GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT:
      return new JapanHumanFleetMovementState()

    case GlobalGameState.PHASE.END_OF_AIR_OPERATION:
      return new JapanHumanEndOfAirOperationState()
    default:
  }
}

export default mapGameStateToJapanHumanHandlerState
