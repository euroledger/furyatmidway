import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { playCardAction } from "../../../UIEvents/AI/JapanCardPlayBot"
import GlobalInit from "../../../model/GlobalInit"
import { setNextStateFollowingCardPlay } from "../../StateUtils"

class JapanHumanCardPlayState {


  async doAction(stateObject) {
    const { cardNumber } = stateObject

   console.log("JAPAN POSSIBLE CARD PLAY HUMAN side, cardNumber=", cardNumber)
  

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

export default JapanHumanCardPlayState
