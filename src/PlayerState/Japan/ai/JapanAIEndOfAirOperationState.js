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

class JapanAIEndOfAirOperationState {
  async doAction(stateObject) {
    console.log("STATE JapanAIEndOfAirOperationState >>>>>>>>>>>>>> CHECK FOR ORPHANS")
    await moveOrphanedCAPUnitsToEliminatedBox(GlobalUnitsModel.Side.JAPAN)
    await moveOrphanedAirUnitsInReturn1Boxes(GlobalUnitsModel.Side.JAPAN)
  }

  async nextState(stateObject) {
    console.log("DO NEXT STATE AFTER END OF JAPAN AIR OPERATION...")
    // const { setAirUnitUpdate, setStrikeGroupUpdate, setCardNumber, setFleetUnitUpdate } = stateObject

    console.log("CHEESE! NEXT STATE AFTER AIR OPERATION (JAPAN)")
    // const unitsInReturnBoxes = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()

    // if (
    //   GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
    //   GlobalInit.controller.japanHandContainsCard(10) &&
    //   unitsInReturnBoxes.length > 0
    // ) {
    //   GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    //   setCardNumber(() => 10)
    //   GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    //   GlobalGameState.updateGlobalState()
    //   return
    // }
    // // decrement air ops points, reset strike groups etc
    // await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)

    // if (endOfTurn()) {
    //   GlobalGameState.cardsChecked = new Array()
    //   GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    //   setCardNumber(() => -1)
    //   GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
    // } else {
    //   GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    // }
    // autoSave(GlobalInit.controller, GlobalUnitsModel.Side.US)
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }
}

export default JapanAIEndOfAirOperationState
