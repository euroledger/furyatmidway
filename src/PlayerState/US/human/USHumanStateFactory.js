import GlobalGameState from "../../../model/GlobalGameState"
import USHumanSetupAirState from "./USHumanSetupAirState"

function mapGameStateToUSHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USHumanSetupAirState()

    default:
  }
}

export default mapGameStateToUSHumanHandlerState
