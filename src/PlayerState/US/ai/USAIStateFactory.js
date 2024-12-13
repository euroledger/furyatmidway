import GlobalGameState from "../../../model/GlobalGameState"
import USAISetupAirState from "./USAISetupAirState"
import USAICardDrawState from "./USAICardDrawState"

function mapGameStateToUSAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USAISetupAirState()
    case GlobalGameState.PHASE.US_CARD_DRAW:
      return new USAICardDrawState()

    default:
  }
}

export default mapGameStateToUSAIHandlerState
