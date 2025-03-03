import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../Utils"
import { tidyUp } from "../../StateUtils"

class USAICardResponseState {
  async doAction(stateObject) {
    const { cardNumber } = stateObject
    console.log("DO CARD RESPONSE cardNumber=", cardNumber)

    if (cardNumber === 10) {
      await delay(1000)
      const unitsInGroup = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()

      const selection = Math.floor(Math.random() * unitsInGroup.length)

      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
    }

    // TODO Card 11 (US Strike Lost)
    
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setEndOfAirOpAlertShow } = stateObject

    console.log("MOVE ON FROM CARD RESPONSE...")
    await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
    setEndOfAirOpAlertShow(true)
  }

  getState() {
    return GlobalGameState.PHASE.CARD_RESPONSE
  }
}

export default USAICardResponseState
