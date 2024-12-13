import GlobalGameState from "../../../model/GlobalGameState"

class USAICardDrawState {
  async doAction(stateObject) {
    console.log("DO CARD ACTION")
    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE FROM US CARD DRAW")
  }

  getState() {
    return GlobalGameState.PHASE.US_CARD_DRAW
  }
}

export default USAICardDrawState
