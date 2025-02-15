import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { playCardAction } from "../../../UIEvents/AI/JapanCardPlayBot"
import GlobalInit from "../../../model/GlobalInit"
import { setNextStateFollowingCardPlay } from "../../StateUtils"

class JapanHumanCardPlayState {
  async doAction(stateObject) {
    const { cardNumber, setCardAlertPanelShow } = stateObject
    setCardAlertPanelShow(true)

    // this.nextState(stateObject)
  }

  async nextState(stateObject) {
    const { cardNumber, setCardAlertPanelShow } = stateObject

    console.log("GRABBAGE NEXT STATE FROM JAPAN CARD PLAY cardNumber=", cardNumber)
    await setNextStateFollowingCardPlay(stateObject)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
  }

  getState() {
    return GlobalGameState.PHASE.CARD_PLAY
  }
}

export default JapanHumanCardPlayState
