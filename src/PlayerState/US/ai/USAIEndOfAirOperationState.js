import { endOfTurn } from "../../StateUtils"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { tidyUp } from "../../StateUtils"

class USAIEndOfAirOperationState {
  async doAction(stateObject) {
    console.log("STATE USAIEndOfAirOperationState >>>>>>>>>>>>>> DO NOTHING")
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setCardNumber, setEndOfTurnSummaryShow } =
      stateObject

    console.log("NEXT STATE AFTER AIR OPERATION (US)")
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

    // Add this to decrement air ops points, reset strike groups etc

    console.log("POTATOES going to decrement the US Air Ops points here...")
    await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)

    if (endOfTurn()) {
      // if (GlobalGameState.gameTurn === 7) {
      //   determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
      //   if (
      //     GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION ||
      //     GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY
      //   ) {
      //     return
      //   }
      // }
      GlobalGameState.currentPlayer = GlobalGameState.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      setEndOfTurnSummaryShow(true)
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    }
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }
}

export default USAIEndOfAirOperationState
