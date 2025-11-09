import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanCapReturnState {
  async doAction(stateObject) {
    console.log(">>>>>>>> JAPAN CAP RETURN")
  }

  async nextState(stateObject) {
    console.log(">>>>> MOVING ON FROM IJN CAP RETURN")
    const { setEndOfAirOpAlertShow } = stateObject
    // If this is IJN CAP RETURN, it is a US Air Operation
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
    setEndOfAirOpAlertShow(true)
  }

  getState() {
    return GlobalGameState.PHASE.CAP_RETURN
  }
}

export default JapanHumanCapReturnState
