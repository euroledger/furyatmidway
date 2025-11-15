import { endOfTurn } from "../../StateUtils"
import GlobalGameState from "../../../model/GlobalGameState"
import { tidyUp } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { autoSave } from "../../../Utils"
import {
  moveOrphanedCAPUnitsToEliminatedBox,
  moveOrphanedAirUnitsInReturn1Boxes,
} from "../../../controller/AirOperationsHandler"
import GlobalInit from "../../../model/GlobalInit"

class USAIEndOfAirOperationState {
  async doAction(stateObject) {
    console.log("STATE USAIEndOfAirOperationState >>>>>>>>>>>>>> CHECK FOR ORPHANS")
    await moveOrphanedCAPUnitsToEliminatedBox(GlobalUnitsModel.Side.US)
    await moveOrphanedAirUnitsInReturn1Boxes(GlobalUnitsModel.Side.US)
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setCardNumber, setFleetUnitUpdate } =
      stateObject

    console.log("CHEESE! NEXT STATE AFTER AIR OPERATION (US)")
    // decrement air ops points, reset strike groups etc
    await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)

    if (endOfTurn()) {
      GlobalGameState.cardsChecked = new Array()
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      setCardNumber(() => -1)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    }
    autoSave(GlobalInit.controller, GlobalUnitsModel.Side.US)
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }
}

export default USAIEndOfAirOperationState
