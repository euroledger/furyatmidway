import GlobalGameState from "../../../model/GlobalGameState"
// import USAIInitiativeDeterminationState from "./USAIInitiativeDeterminationState"
import { calcAirOpsPoints } from "../../StateUtils"

class JapanHumanAirSearchState {
  async doAction(stateObject) {
    const { setSearchValuesAlertShow, setSearchValues, setSearchResults } = stateObject
    calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
    setSearchValuesAlertShow(true)
  }

  async nextState(stateObject) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    // return new USAIInitiativeDeterminationState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default JapanHumanAirSearchState
