import GlobalGameState from "../../../model/GlobalGameState"

class JapanCardDrawState {
  async doAction(stateObject) {
    console.log("DO CARD ACTION")
    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE FROM JAPAN CARD DRAW")

    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_FLEET
    GlobalGameState.currentCarrier = 0
    GlobalGameState.phaseCompleted = false
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_CARD_DRAW
  }
}

export default JapanCardDrawState
