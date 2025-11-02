import GlobalGameState from "../../../model/GlobalGameState"

import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { setNextStateFollowingCardPlay } from "../../StateUtils"

class JapanHumanCardPlayState {
  async doAction(stateObject) {
    const { cardNumber, setCardAlertPanelShow } = stateObject
    console.log(">>>>>>> JAPAN HUMAN CARD PLAY >>>>>>>>>> cardNumber=", cardNumber)

        console.log("\t=>GlobalInit.controller.japanHandContainsCard(cardNumber)=", GlobalInit.controller.japanHandContainsCard(cardNumber))

    if (GlobalInit.controller.japanHandContainsCard(cardNumber)) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      setCardAlertPanelShow(true)
    }
  }

  async nextState(stateObject) {
    console.trace()
    const { cardNumber, setCardAlertPanelShow } = stateObject

    setCardAlertPanelShow(false)

    console.log("GRABBAGE NEXT STATE FROM JAPAN CARD PLAY cardNumber=", cardNumber)
    await setNextStateFollowingCardPlay(stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.CARD_PLAY
  }
}

export default JapanHumanCardPlayState
