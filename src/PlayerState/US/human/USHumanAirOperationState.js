import GlobalGameState from "../../../model/GlobalGameState"

class USHumanAirOperationState {
  async doAction(stateObject) {
    const { setUsStrikePanelEnabled } = stateObject
    setUsStrikePanelEnabled(true)
  }

  async nextState(stateObject) {
    console.trace()
    const { setEndOfAirOpAlertShow } = stateObject
    console.log("MOVE ON FROM US AIR OPERATIONS!")
    setEndOfAirOpAlertShow(true)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USHumanAirOperationState
