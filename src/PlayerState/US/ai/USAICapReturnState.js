import GlobalGameState from "../../../model/GlobalGameState"

class USAICapReturnState {
  async doAction(stateObject) {
    console.log(">>>>>>>> US CAP RETURN!!!!!!!!!!!!!!!!!")
  }

  async nextState(stateObject) {
    console.log(">>>>> MOVING ON FROM US CAP RETURN")
    const { setEndOfAirOpAlertShow } = stateObject
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
    setEndOfAirOpAlertShow(true)
  }

  getState() {
    return GlobalGameState.PHASE.CAP_RETURN
  }
}

export default USAICapReturnState
