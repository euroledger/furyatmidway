import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { midwayPossible, midwayDeclarationHandler } from "../../StateUtils"

class JapanHumanDrawOneCardState {
  async doAction(stateObject) {
    const { setCardNumber } = stateObject

    console.log("DO JAPAN DRAW ONE CARD ACTION ---- CHECK FOR CARDS 5 AND 6 FIRST GAME TURN=", GlobalGameState.gameTurn)
    // this.nextState(stateObject)
    GlobalGameState.phaseCompleted = false

    if (GlobalGameState.gameTurn === 7) {
      if (GlobalInit.controller.japanHandContainsCard(5)) {
        GlobalGameState.dieRolls = []
        setCardNumber(() => 5)
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
    }
    if (GlobalGameState.gameTurn !== 4) {
      // only check card 6 if not already checked ie it was just drawn
      if (!GlobalGameState.checkedCard6 && GlobalInit.controller.japanHandContainsCard(6)) {
        setCardNumber(() => 6)
        console.log("TURN 7 GO TO CARD PLAY")
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        GlobalGameState.updateGlobalState()
      }
      GlobalGameState.phaseCompleted = true
    }
  }

  async nextState(stateObject) {
    console.log(">>>>>>>>>>>>>>>>>> NEXT STATE AFTER JAPAN CARD DRAW QUACK!!!!!!!!!!!!!")
    const { setMidwayWarningShow, setMidwayDialogShow, nextAction } = stateObject

    // Check for Cards 5 and 6 (if they were just drawn they can be played here)

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
