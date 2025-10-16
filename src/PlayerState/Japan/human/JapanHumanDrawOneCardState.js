import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { midwayPossible, midwayDeclarationHandler } from "../../StateUtils"

class JapanHumanDrawOneCardState {
  async doAction(stateObject) {
    console.log("DO JAPAN DRAW ONE CARD ACTION")
    // this.nextState(stateObject)
    GlobalGameState.phaseCompleted = false
  }

  async nextState(stateObject) {
    const { setMidwayWarningShow, setMidwayDialogShow, nextAction } = stateObject
    if (GlobalGameState.gameTurn !== 4) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
      midwayPossible(GlobalInit.controller, setMidwayWarningShow, setMidwayDialogShow)
    } else {
      nextAction()
    }
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
  }
}

export default JapanHumanDrawOneCardState
