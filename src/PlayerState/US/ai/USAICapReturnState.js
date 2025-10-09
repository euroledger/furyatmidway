import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { moveCAPUnitsFromReturnBoxToCarrier, midwayOrAirOps } from "../../StateUtils"

class USAICapReturnState {
  async doAction(stateObject) {
    const { setTestUpdate } = stateObject

    console.log(">>>>>>>> US CAP RETURN!!!!!!!!!!!!!!!!! return CAP units to parent carrier")
    await moveCAPUnitsFromReturnBoxToCarrier(GlobalInit.controller, GlobalUnitsModel.Side.US, setTestUpdate)
    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    console.log(">>>>> MOVING ON FROM US CAP RETURN")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    midwayOrAirOps()
    GlobalGameState.updateGlobalState()
  }

  getState() {
    return GlobalGameState.PHASE.CAP_RETURN
  }
}

export default USAICapReturnState
