import GlobalGameState from "../../../model/GlobalGameState"
import JapanHumanSetupAirState from "./JapanHumanSetupAirState"

function mapGameStateToJapanHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new JapanHumanSetupAirState()

    default:
  }
}

export default mapGameStateToJapanHumanHandlerState
