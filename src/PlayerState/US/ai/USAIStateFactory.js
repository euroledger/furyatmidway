import GlobalGameState from "../../../model/GlobalGameState"
import USAISetupAirState from "./USSetupAirState"

function mapGameStateToUSAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USAISetupAirState()


    default:
  }
}

export default mapGameStateToUSAIHandlerState
