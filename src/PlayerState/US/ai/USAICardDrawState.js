import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class USAICardDrawState {
  async doAction(stateObject) {
    console.log("DO CARD ACTION")
    if (GlobalInit.controller.japanHandContainsCard(6) && GlobalGameState.gameTurn !== 4) {
      GlobalGameState.phaseCompleted = true // ensure next action button enabled
    } else {
      this.nextState(stateObject)
    }
  }

  async nextState(stateObject) {
    const { setCardNumber } = stateObject

    if (GlobalGameState.gameTurn !== 1) {
      if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
      }
    } else {
      GlobalGameState.usCardsDrawn = true
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      if (GlobalInit.controller.japanHandContainsCard(6) && GlobalGameState.gameTurn !== 4) {
        // card 6 cannot be played at night
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        if (GlobalGameState.gameTurn !== 4) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
          GlobalGameState.updateGlobalState()
        } else {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
              console.log("++++++++++++++++++++++++++++ GO TO DMCV QUACK 6")

          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
          GlobalGameState.usFleetMoved = false
          GlobalGameState.phaseCompleted = true
        }
      }
    }
    GlobalGameState.setupPhase++
  }

  getState() {
    return GlobalGameState.PHASE.US_CARD_DRAW
  }
}

export default USAICardDrawState
