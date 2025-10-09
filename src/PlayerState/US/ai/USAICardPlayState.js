import GlobalGameState from "../../../model/GlobalGameState"
import { displayScreen, setNextStateFollowingCardPlay } from "../../StateUtils"
import { playCardAction } from "../../../UIEvents/AI/USCardPlayBot"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import USAIAirSearchState from "./USAIAirSearchState"

class USAICardPlayState {
  displayCardPlayedPanel(stateObject) {
    // this will vary for different cards played
    const { cardNumber, setShowCardFooter, setHeaderText, setCardPlayedPanelShow } = stateObject
    const msg = `CARD #${cardNumber} PLAYED`
    setHeaderText(msg)
    setCardPlayedPanelShow(() => true)
    setShowCardFooter(() => true)
  }

  async doAction(stateObject) {
    const { cardNumber, setCardNumber } = stateObject
    this.cardNumber = cardNumber

    console.log("US AI Card Play: DETERMINE WHETHER OR NOT TO PLAY CARD NUMBER", cardNumber)
    const playThisCard = playCardAction(GlobalInit.controller, cardNumber)

    console.log("playThisCard=", playThisCard)
    if (playThisCard) {
      GlobalInit.controller.setCardPlayed(cardNumber, GlobalUnitsModel.Side.US)

      if (displayScreen) {
        this.displayCardPlayedPanel(stateObject)
      }
    } else {
      setCardNumber(0)
      this.nextState(stateObject)
    }
  }

  async nextState(stateObject) {
    const { setSearchValuesAlertShow } = stateObject

    console.log("NEXT STATE FROM US CARD PLAY cardNumber=", this.cardNumber)
    stateObject.cardNumber = this.cardNumber
    await setNextStateFollowingCardPlay(stateObject)
    if (displayScreen()) {
      setSearchValuesAlertShow(true)
    }
  }

  getState() {
    return GlobalGameState.PHASE.CARD_PLAY
  }
}

export default USAICardPlayState
