import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { isMidwayAttackPossible } from "../../StateUtils"

class USAIDrawOneCardState {
  async doAction(stateObject) {
    console.log("DO DRAW ONE CARD ACTION")
    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    GlobalGameState.phaseCompleted = true
    GlobalGameState.usCardsDrawn = true
    GlobalInit.controller.drawUSCards(1, false)

    if (GlobalGameState.gameTurn !== 4 && isMidwayAttackPossible()) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
      return
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
      GlobalGameState.usFleetMoved = false
      GlobalGameState.phaseCompleted = true
    }
  }

  getState() {
    return GlobalGameState.PHASE.US_DRAWS_ONE_CARD
  }
}

export default USAIDrawOneCardState
