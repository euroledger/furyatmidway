import GlobalGameState from "../../../model/GlobalGameState"
import USHumanAirSearchState from "./USHumanAirSearchState"
import { calcAirOpsPoints } from "../../StateUtils"

class USHumanCardPlayState {
  async doAction(stateObject) {
    const { setJapanStrikePanelEnabled, setUSMapRegions } = stateObject
    
  }

  async nextState(stateObject) {
    const {
        setSearchValuesAlertShow,
        setSearchValues, 
        setSearchResults
      } = stateObject
  
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
    calcAirOpsPoints({ setSearchValues, setSearchResults })
    setSearchValuesAlertShow(true)
    return new USHumanAirSearchState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USHumanCardPlayState
