import GlobalGameState from "../../../model/GlobalGameState"
import JapanHumanSetupAirState from "./JapanHumanSetupAirState"

function mapGameStateToJapanHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.JAPAN_SETUP:
      return new JapanHumanSetupAirState()

    default:
  }
}

export default mapGameStateToJapanHumanHandlerState
