import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import JapanHumanCardDrawState from "./JapanHumanCardDrawState"

class JapanHumanSetupAirState {
  async doAction(stateObject) {
    console.log("JAPAN SETUP AIR STATE")
    const { getJapanEnabledAirBoxes, setEnabledJapanBoxes } = stateObject

    const enabledBoxes = getJapanEnabledAirBoxes()
    setEnabledJapanBoxes(() => enabledBoxes)
  }

  async nextState() {
    if (GlobalGameState.currentCarrier <= 2) {
      GlobalGameState.currentCarrier++
      GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW

      // GlobalInit.controller.drawJapanCards(3, true, [9, 10, 12]) // QUACK TESTING ONLY

      GlobalInit.controller.drawJapanCards(3, true)
      GlobalGameState.jpCardsDrawn = true
      GlobalGameState.setupPhase++
      GlobalGameState.phaseCompleted = false
      return new JapanHumanCardDrawState()
    }
    GlobalGameState.phaseCompleted = false
    GlobalGameState.setupPhase++
    return this
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_SETUP
  }
}

export default JapanHumanSetupAirState
