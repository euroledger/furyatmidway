import { endOfTurn } from "../../StateUtils"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { tidyUp } from "../../StateUtils"
import { autoSave } from "../../../Utils"

class JapanHumanEndOfAirOperationState {
  async doAction(stateObject) {
    console.log("STATE JapanHumanEndOfAirOperationState >>>>>>>>>>>>>> DO NOTHING")
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setCardNumber, setEndOfTurnSummaryShow } =
      stateObject

    console.log("NEXT STATE AFTER AIR OPERATION (japan)")


    // Add this to decrement air ops points, reset strike groups etc

    console.log("PASTA going to decrement the Japan Air Ops points here...")
    await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)

    if (endOfTurn()) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.cardsChecked = new Array()
      setCardNumber(() => -1)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    }
    autoSave(GlobalInit.controller, GlobalUnitsModel.Side.JAPAN)
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }
}

export default JapanHumanEndOfAirOperationState
