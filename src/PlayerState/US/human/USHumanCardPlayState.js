import GlobalGameState from "../../../model/GlobalGameState"
import USHumanAirSearchState from "./USHumanAirSearchState"
import { calcAirOpsPoints } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import JapanHumanAirSearchState from "../../Japan/human/JapanHumanAirSearchState"
import { setNextStateFollowingCardPlay } from "../../StateUtils"

class USHumanCardPlayState {
  async doAction(stateObject) {
    const { cardNumber, setCardAlertPanelShow, setRestoreFunction } = stateObject
    console.log(">>>>>>> US HUMAN CARD PLAY >>>>>>>>>> cardNumber=", cardNumber)

    if (GlobalInit.controller.usHandContainsCard(cardNumber)) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      setRestoreFunction(() => setCardAlertPanelShow)
      setCardAlertPanelShow(true)
    }
  }

  async nextState(stateObject) {
    const { setSearchValuesAlertShow, setSearchValues, setSearchResults, setCardAlertPanelShow, cardNumber } =
      stateObject

    setCardAlertPanelShow(false)

    console.log("PILLAGE NEXT STATE FROM US CARD PLAY cardNumber=", cardNumber)
    // await setNextStateFollowingCardPlay(stateObject)

    calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
    setSearchValuesAlertShow(true)
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    return new USHumanAirSearchState()
  }

  getState() {
    return GlobalGameState.PHASE.AIR_SEARCH
  }
}

export default USHumanCardPlayState
