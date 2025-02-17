import GlobalGameState from "../../../model/GlobalGameState"

class JapanHumanCapInterceptionState {
  async doAction(stateObject) {
    console.log(">>>>>>>> JAPAN CAP INTERCEPTION")
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM JAPAN CAP INTERCEPTION!")

    // TODO move logic from GameStateHandler here...
  }

  getState() {
    return GlobalGameState.PHASE.CAP_INTERCEPTION
  }
}

export default JapanHumanCapInterceptionState
