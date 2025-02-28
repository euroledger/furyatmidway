import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanAirOperationsState {
  async doAction(stateObject) {
    console.log("JAPAN AIR OPERATIONS SPAGHETTI ))))")
  }

  async nextState(stateObject) {
    const { setEndOfAirOpAlertShow } = stateObject
    console.log("MOVE ON FROM JAPAN AIR OPERATIONS!")
    // GlobalGameState.currentPlayer = GlobalGameState.sideWithInitiative
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
    setEndOfAirOpAlertShow(true)
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default JapanHumanAirOperationsState
