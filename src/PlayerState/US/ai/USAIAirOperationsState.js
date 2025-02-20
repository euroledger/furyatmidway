import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { tidyUp } from "../../StateUtils"
import {
  generateUSAirOperationsMovesCarriers,
  generateUSAirOperationsMovesMidway,
  moveStrikeGroups,
} from "../../../UIEvents/AI/USAirOperationsBot"

class USAIAirOperationsState {
  constructor() {
    this.endOfAirOp = false
  }
  async doAction(stateObject) {
    console.log("++++++++++++++ DO US AIR UNIT/SG MOVE(S)...")
    const inBattle = await moveStrikeGroups(GlobalInit.controller, stateObject) // strike groups already at sea

    if (!inBattle) {
      // if the previous move has triggered a battle do not move any more SGs
      // the state handler will return to this state after the battle to continue
      // moving the remaining SGs
      await generateUSAirOperationsMovesCarriers(GlobalInit.controller, stateObject)
      await generateUSAirOperationsMovesMidway(GlobalInit.controller, stateObject)
      await moveStrikeGroups(GlobalInit.controller, stateObject) // first op strike groups
      this.endOfAirOp = true
      this.nextState(stateObject)
    }
  }

  async nextState(stateObject) {
    if (!this.endOfAirOp) {
      console.log("AIR OP NOT ENDED YET!")
      return
    }
    const { setCardNumber, setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setEndOfAirOpAlertShow } =
      stateObject
    const unitsInReturnBoxes = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()

    console.log(">>>>>>>>>>>>>>>>>> unitsInReturnBoxes len=", unitsInReturnBoxes.length)
    if (
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
      GlobalInit.controller.japanHandContainsCard(10) &&
      unitsInReturnBoxes.length > 0
    ) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      setCardNumber(() => 10)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    } else {
      console.log("+++++++++++++++++++++++++ DOING TIDY UP...")
      await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
      setEndOfAirOpAlertShow(true)
    }
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USAIAirOperationsState
