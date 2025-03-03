import GlobalGameState from "../../../model/GlobalGameState"

class JapanHumanCapReturnState {
  async doAction(stateObject) {
    console.log(">>>>>>>> JAPAN CAP RETURN")
  }

  async nextState(stateObject) {
    console.log(">>>>> MOVING ON FROM IJN CAP RETURN")
    const { setEndOfAirOpAlertShow } = stateObject
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
    setEndOfAirOpAlertShow(true)
  }

  getState() {
    return GlobalGameState.PHASE.CAP_RETURN
  }
}

export default JapanHumanCapReturnState
