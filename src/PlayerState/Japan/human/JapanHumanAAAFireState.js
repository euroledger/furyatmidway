import GlobalGameState from "../../../model/GlobalGameState"

class JapanHumanAAAFireState {
  async doAction(stateObject) {
    console.log(">>>>>>>> JAPAN AAA FIRE")
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM JAPAN AAA!")   
  }

  getState() {
    return GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
  }
}

export default JapanHumanAAAFireState
