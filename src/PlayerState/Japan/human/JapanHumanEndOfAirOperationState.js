import { endOfTurn } from "../../StateUtils"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { tidyUp } from "../../StateUtils"

class JapanHumanEndOfAirOperationState {
  async doAction(stateObject) {
    console.log("STATE JapanHumanEndOfAirOperationState >>>>>>>>>>>>>> DO NOTHING")
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setCardNumber, setEndOfTurnSummaryShow } =
      stateObject

    console.log("NEXT STATE AFTER AIR OPERATION (japan)")
    const unitsInReturnBoxes = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()

    if (
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
      GlobalInit.controller.japanHandContainsCard(10) &&
      unitsInReturnBoxes.length > 0
    ) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      setCardNumber(() => 10)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      return
    }

    // Add this to decrement air ops points, reset strike groups etc

    console.log("PASTA going to decrement the Japan Air Ops points here...")
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

export default JapanHumanEndOfAirOperationState
