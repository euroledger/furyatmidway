import GlobalGameState from "../../../model/GlobalGameState"
// import USAIInitiativeDeterminationState from "./USAIInitiativeDeterminationState"
import { calcAirOpsPoints } from "../../StateUtils"

class USHumanAirSearchState {
  async doAction(stateObject) {
    const { setSearchValuesAlertShow, setSearchValues, setSearchResults } = stateObject
    calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
    setSearchValuesAlertShow(true)
  }

  async nextState(stateObject) {
    // GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USHumanAirSearchState
