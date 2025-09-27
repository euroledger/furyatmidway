import GlobalGameState from "../../../model/GlobalGameState"


class JapanHumanEndOfTurnState {
  async doAction(stateObject) {
    console.log("STATE JapanHumanEndOfTurnState >>>>>>>>>>>>>> DO NOTHING")
  }

  async nextState(stateObject) {
    console.log("PISS BOLLOCKS >>>>>>>>>>>>>> set next state here")
  
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_TURN
  }
}

export default JapanHumanEndOfTurnState
