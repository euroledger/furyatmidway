import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { midwayPossible } from "../../StateUtils"

class JapanHumanMidwayInvasionState {
  async doAction(stateObject) {
    const { setMidwayInvasionPanelShow } = stateObject
    console.log("DO (HUMAN) MIDWAY INVASION ACTION")
    setMidwayInvasionPanelShow(true)
  }

  async nextState(stateObject) {
    const { setEndOfTurnSummaryShow } = stateObject
    console.log("NEXT STATE AFTER human MIDWAY INVASION....END OF GAME...? GlobalGameState.endOfGame=", GlobalGameState.endOfGame)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_GAME
    if (!GlobalGameState.endOfGame) {
      setEndOfTurnSummaryShow(true)
    }
  }

  getState() {
    return GlobalGameState.PHASE.MIDWAY_INVASION
  }
}

export default JapanHumanMidwayInvasionState
