import GlobalGameState from "../../../model/GlobalGameState"

import GlobalInit from "../../../model/GlobalInit"
import { setNextStateFollowingCardPlay } from "../../StateUtils"

class JapanHumanCardPlayState {
  async doAction(stateObject) {
    const { cardNumber, setCardAlertPanelShow } = stateObject
    console.log(">>>>>>> JAPAN HUMAN CARD PLAY >>>>>>>>>>")
    if (GlobalInit.controller.japanHandContainsCard(cardNumber)) {
      setCardAlertPanelShow(true)
    }
  }

  async nextState(stateObject) {
    const { cardNumber, setCardNumber, setCardAlertPanelShow } = stateObject

    setCardNumber(0)
    setCardAlertPanelShow(false)

    console.log("GRABBAGE NEXT STATE FROM JAPAN CARD PLAY cardNumber=", cardNumber)
    await setNextStateFollowingCardPlay(stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.CARD_PLAY
  }
}

export default JapanHumanCardPlayState
