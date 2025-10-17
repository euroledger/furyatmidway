import GlobalGameState from "../../../model/GlobalGameState"
import { displayScreen, setNextStateFollowingCardPlay } from "../../StateUtils"
import { playCardAction } from "../../../UIEvents/AI/USCardPlayBot"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../Utils"

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
    const { cardNumber, setAttackResolved, setTowedToFriendlyPortPanelShow, setAirReplacementsPanelShow } = stateObject
    this.cardNumber = cardNumber

    console.log("US AI Card Play: DETERMINE WHETHER OR NOT TO PLAY CARD NUMBER", cardNumber)
    const playThisCard = playCardAction(GlobalInit.controller, cardNumber, setAttackResolved, GlobalUnitsModel.Side.US)

    console.log("playThisCard=", playThisCard)
    if (playThisCard) {
      GlobalInit.controller.setCardPlayed(cardNumber, GlobalUnitsModel.Side.US)
      if (cardNumber === 1) {
        GlobalGameState.testCapSelection = -1
        GlobalGameState.updateGlobalState()
        setTowedToFriendlyPortPanelShow(true)
        await delay(1500)
        const usCVsSunk = GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US)

        // select random number between 0 and number of sunk CVs (will usually be 1)
        // Returns a random integer from 0 to 9:
        const cv = Math.floor(Math.random() * usCVsSunk.length)

        GlobalGameState.testCapSelection = cv
        GlobalGameState.updateGlobalState()
      } else if (cardNumber === 3) {
        GlobalGameState.testCapSelection = -1
        GlobalGameState.updateGlobalState()
        setAirReplacementsPanelShow(true)
        await delay(1500)

        // TODO select air replacement
      } else {
        if (displayScreen) {
          this.displayCardPlayedPanel(stateObject)
        }
      }
    } else {
      this.nextState(stateObject)
    }
  }

  async nextState(stateObject) {
    const { setSearchValuesAlertShow, setSearchValues, setSearchResults, cardNumber } = stateObject

    console.log("NEXT STATE FROM US CARD PLAY cardNumber=", cardNumber)
    await setNextStateFollowingCardPlay(stateObject)

    // This should be done in next state (eg AIR SEARCH)
    // See Card 7 in above function for example
    // if (displayScreen()) {
    //   calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
    //   GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    //   setSearchValuesAlertShow(true)
    // }
  }

  getState() {
    return GlobalGameState.PHASE.CARD_PLAY
  }
}

export default USAICardPlayState
