import GlobalGameState from "../../../model/GlobalGameState"
import JapanAIMidwayDeclarationState from "./JapanAIMidwayDeclarationState"
import JapanAISetupAirState from "./JapanAISetupAirState"

function mapGameStateToJapanAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.JAPAN_SETUP:
      return new JapanAISetupAirState()

    case GlobalGameState.PHASE.JAPAN_MIDWAY:
      return new JapanAIMidwayDeclarationState()

    default:
  }
}

export default mapGameStateToJapanAIHandlerState
