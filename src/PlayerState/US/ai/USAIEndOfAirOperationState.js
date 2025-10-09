import { endOfTurn } from "../../StateUtils"
import GlobalGameState from "../../../model/GlobalGameState"
import { tidyUp } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import {
  moveOrphanedCAPUnitsToEliminatedBox,
  moveOrphanedAirUnitsInReturn1Boxes,
} from "../../../controller/AirOperationsHandler"

class USAIEndOfAirOperationState {
  async doAction(stateObject) {
    console.log("STATE USAIEndOfAirOperationState >>>>>>>>>>>>>> CHECK FOR ORPHANS")
    await moveOrphanedCAPUnitsToEliminatedBox(GlobalUnitsModel.Side.US)
    await moveOrphanedAirUnitsInReturn1Boxes(GlobalUnitsModel.Side.US)
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setCardNumber, setEndOfTurnSummaryShow } =
      stateObject

    console.log("CHEESE! NEXT STATE AFTER AIR OPERATION (US)")
    // const unitsInReturnBoxes = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()

    // if (
    //   GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
    //   GlobalInit.controller.japanHandContainsCard(10) &&
    //   unitsInReturnBoxes.length > 0
    // ) {
    //   GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    //   setCardNumber(() => 10)
    //   GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    //   return
    // }

    // decrement air ops points, reset strike groups etc
    await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)

    if (endOfTurn()) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.cardsChecked = new Array()
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    }
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }
}

export default USAIEndOfAirOperationState
