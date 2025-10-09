import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { playCardAction } from "../../../UIEvents/AI/JapanCardPlayBot"
import GlobalInit from "../../../model/GlobalInit"
import { displayScreen, setNextStateFollowingCardPlay } from "../../StateUtils"

class JapanAICardPlayState {
  displayCardPlayedPanel(stateObject) {

    // this will vary for different cards played
    const { cardNumber, setShowCardFooter, setHeaderText, setCardPlayedPanelShow } = stateObject
    const msg = `CARD #${cardNumber} PLAYED`
    setHeaderText(msg)

    setCardPlayedPanelShow(() => true)
    setShowCardFooter(() => true)
  }

  async doAction(stateObject) {
    const { cardNumber } = stateObject

    const playThisCard = playCardAction(cardNumber)

    if (playThisCard) {
      GlobalInit.controller.setCardPlayed(cardNumber, GlobalUnitsModel.Side.JAPAN)

      if (displayScreen) {
        this.displayCardPlayedPanel(stateObject)
      }
    }
  

    // this.nextState(stateObject)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE FROM JAPAN CARD PLAY")
    await setNextStateFollowingCardPlay(stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.CARD_PLAY
  }
}

export default JapanAICardPlayState
