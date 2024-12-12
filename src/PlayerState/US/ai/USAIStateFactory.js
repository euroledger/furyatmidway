import GlobalGameState from "../../../model/GlobalGameState"
import USAISetupAirState from "./USAISetupAirState"

function mapGameStateToUSAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USAISetupAirState()


    default:
  }
}

export default mapGameStateToUSAIHandlerState
