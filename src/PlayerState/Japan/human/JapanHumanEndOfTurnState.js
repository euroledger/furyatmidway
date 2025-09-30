import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { determineMidwayInvasion } from "../../StateUtils"

class JapanHumanEndOfTurnState {
  async doAction(stateObject) {
    console.log("STATE JapanHumanEndOfTurnState >>>>>>>>>>>>>> DO NOTHING")
  }

  async nextState(stateObject) {
    const { setCardNumber } = stateObject

    // if this is the end of turn 7 - possible Midway Invasion

    // check if MIF fleet is one hex away from Midway
    // if so -> go to MIDWAY_INVASION

    if (GlobalGameState.gameTurn === 7) {
      if (GlobalInit.controller.japanHandContainsCard(6)) {
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
      }
    } else {
      GlobalGameState.gameTurn++

      if (GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 7) {
        if (GlobalInit.controller.japanHandContainsCard(5)) {
          GlobalGameState.dieRolls = []
          setCardNumber(() => 5)
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
          return
        }
      }
      // else ... START OF NEW TURN
      await GlobalInit.controller.setAllUnitsToNotMoved()

      GlobalGameState.airOpJapan = 0
      GlobalGameState.airOpUS = 0
      if (GlobalInit.controller.japanHandContainsCard(6) && GlobalGameState.gameTurn !== 4) {
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
        }
        if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 5 || GlobalGameState.gameTurn === 7) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
        }
      }
      GlobalGameState.phaseCompleted = false
    }
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_TURN
  }
}

export default JapanHumanEndOfTurnState
