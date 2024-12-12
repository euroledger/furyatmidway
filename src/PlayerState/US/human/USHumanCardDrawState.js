import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import USHumanFleetMovementPlanningState from "./USHumanFleetMovementPlanning"

class USHumanCardDrawState {
  async doAction(stateObject) {}

  async nextState(stateObject) {

    if (GlobalGameState.gameTurn != 1) {
      if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD

        // todo return object for this
      }
    } else {
      GlobalGameState.usCardsDrawn = true
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      // if (GlobalInit.controller.japanHandContainsCard(6)) {
      //   setCardNumber(() => 6)
      //   GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      // } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
      // }
    }
    GlobalGameState.phaseCompleted = true
    GlobalGameState.setupPhase++
  }

  getState() {
    return GlobalGameState.PHASE.US_CARD_DRAW
  }
}

export default USHumanCardDrawState
