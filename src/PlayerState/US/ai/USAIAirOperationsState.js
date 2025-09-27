import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { tidyUp } from "../../StateUtils"
import {
  generateUSAirOperationsMovesCarriers,
  generateUSAirOperationsMovesMidway,
  moveStrikeGroups,
} from "../../../UIEvents/AI/USAirOperationsBot"
import { setStrikeGroupAirUnitsToNotMoved } from "../../../controller/AirOperationsHandler"

class USAIAirOperationsState {
  constructor() {
    this.endOfAirOp = false
  }
  async doAction(stateObject) {
    console.log("++++++++++++++ DO US AIR UNIT/SG MOVE(S)...")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US

    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US

    const inBattle = await moveStrikeGroups(GlobalInit.controller, stateObject) // strike groups already at sea

    if (!inBattle) {
      // if the previous move has triggered a battle do not move any more SGs
      // the state handler will return to this state after the battle to continue
      // moving the remaining SGs
      console.log("----m QUACK NO COMBAT -> MOVE CARRIER UNITS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      await generateUSAirOperationsMovesCarriers(GlobalInit.controller, stateObject)
      await generateUSAirOperationsMovesMidway(GlobalInit.controller, stateObject)

      const inBattle = await moveStrikeGroups(GlobalInit.controller, stateObject)
      console.log("FUCKING inBattle=", inBattle)
      if (!inBattle) {
        console.log("NOT IN BATTLE, end the fucking air op NOW!!!!!!!!!!!!")
        this.endOfAirOp = true
        // const returningUnitsNotMoved = GlobalInit.controller.getReturningUnitsNotMoved(GlobalUnitsModel.Side.US)

        await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative)
        await generateUSAirOperationsMovesCarriers(GlobalInit.controller, stateObject)
        await generateUSAirOperationsMovesMidway(GlobalInit.controller, stateObject)

        this.nextState(stateObject)
      }
    }
  }

  async nextState(stateObject) {
    if (!this.endOfAirOp) {
      console.log("AIR OP NOT ENDED YET!")
      return
    }
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setEndOfAirOpAlertShow } = stateObject

    // if any CAP need to return -> Go to new state JAPAN_CAP_RETURN

    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.JAPAN)

    if (capUnitsReturning.length > 0) {
      GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_RETURN
    } else {
      console.log("+++++++++++++++++++++++++ DOING TIDY UP...")
      // await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
      setEndOfAirOpAlertShow(true)
    }
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default USAIAirOperationsState
