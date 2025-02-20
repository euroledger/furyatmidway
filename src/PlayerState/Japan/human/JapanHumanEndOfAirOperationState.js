import { endOfTurn } from "../../StateUtils"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"

class JapanHumanEndOfAirOperationState {
  async doAction(stateObject) {}

  async nextState(stateObject) {
    const { setCardNumber, setEndOfTurnSummaryShow } = stateObject

    console.log("NEXT STATE AFTER AIR OPERATION (japan)")
    if (endOfTurn()) {
      if (GlobalGameState.gameTurn === 7) {
        determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
        if (
          GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION ||
          GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY
        ) {
          return
        }
      }
      if (
        GlobalInit.controller.usHandContainsCard(1) &&
        GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0
      ) {
        setCardNumber(() => 1)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2)) {
        setCardNumber(() => 2)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      setEndOfTurnSummaryShow(true)
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    }
  }

  getState() {}
}

export default JapanHumanEndOfAirOperationState
