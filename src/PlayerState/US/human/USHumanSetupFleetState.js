import GlobalGameState from "../../../model/GlobalGameState"
import USHumanSetupAirState from "./USHumanSetupAirState"
import { usCSFStartHexes } from "../../../components/MapRegions"

class USHumanSetupFleetState {
  async doAction(stateObject) {
    const { setUSMapRegions, setCSFAlertShow } = stateObject

    setUSMapRegions(usCSFStartHexes)
    setCSFAlertShow(true)
  }

  nextState(stateObject) {
    const { setUSMapRegions } = stateObject
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
    GlobalGameState.usFleetPlaced = true
    setUSMapRegions([])
    GlobalGameState.phaseCompleted = false
    GlobalGameState.setupPhase = 6
    return new USHumanSetupAirState()
  }

  getState() {
    return GlobalGameState.PHASE.US_SETUP_FLEET
  }
}

export default USHumanSetupFleetState
