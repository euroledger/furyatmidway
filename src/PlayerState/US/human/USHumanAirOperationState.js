
import GlobalGameState from "../../../model/GlobalGameState"


class USHumanAirOperationState {
  async doAction(stateObject) {
    const { setUsStrikePanelEnabled } = stateObject
    setUsStrikePanelEnabled(true)
  }

  async nextState(stateObject) {
   
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USHumanAirOperationState
