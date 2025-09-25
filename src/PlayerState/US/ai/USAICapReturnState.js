import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { moveCAPUnitsFromReturnBoxToCarrier } from "../../StateUtils"

class USAICapReturnState {
  async doAction(stateObject) {
    const { setTestUpdate } = stateObject

    console.log(">>>>>>>> US CAP RETURN!!!!!!!!!!!!!!!!! return CAP units to parent carrier")
    await moveCAPUnitsFromReturnBoxToCarrier(GlobalInit.controller, GlobalUnitsModel.Side.US, setTestUpdate)
  }

  async nextState(stateObject) {
    console.log("CURRENT GAME STATE=", GlobalGameState.gamePhase)
    console.log(">>>>> MOVING ON FROM US CAP RETURN")
    // const { setEndOfAirOpAlertShow } = stateObject
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
    // setEndOfAirOpAlertShow(true)
  }

  getState() {
    return GlobalGameState.PHASE.CAP_RETURN
  }
}

export default USAICapReturnState
