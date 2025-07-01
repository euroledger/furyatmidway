import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanAirOperationsState {
  async doAction(stateObject) {
    console.log("JAPAN AIR OPERATIONS SPAGHETTI ))))")
  }

  async nextState(stateObject) {
    const { setEndOfAirOpAlertShow } = stateObject
    console.log("MOVE ON FROM JAPAN AIR OPERATIONS! _____________ SHOW THE FUCKING ALERT _____________")
    setEndOfAirOpAlertShow(true)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default JapanHumanAirOperationsState
