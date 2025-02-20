import GlobalGameState from "../../../model/GlobalGameState"
import JapanHumanSetupAirState from "./JapanHumanSetupAirState"
import JapanHumanMidwayDeclarationState from "./JapanHumanMidwayDeclarationState"
import JapanHumanCardPlayState from "./JapanHumanCardPlayState"
import JapanHumanCardDrawState from "./JapanHumanCardDrawState"
import JapanHumanFleetMovementState from "./JapanHumanFleetMovementState"
import JapanHumanEndOfAirOperationState from "./JapanHumanEndOfAirOperationState"
import JapanHumanCapInterceptionState from "./JapanHumanCapInterceptionState"
import JapanHumanAAAFireState from "./JapanHumanAAAFireState"

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

    case GlobalGameState.PHASE.CAP_INTERCEPTION:
      return new JapanHumanCapInterceptionState()

    case GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE:
      return new JapanHumanAAAFireState()
      
    default:
      console.log("NO JAPAN HUMAN STATE FOUND FOR PHASE", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToJapanHumanHandlerState
