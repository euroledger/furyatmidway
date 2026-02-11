import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { tidyUp } from "../../StateUtils"
import {
  generateJapanAirOperationsMovesCarriers,
  moveStrikeGroups,
} from "../../../UIEvents/AI/JapanAirOperationsBot"
import { setStrikeGroupAirUnitsToNotMoved } from "../../../controller/AirOperationsHandler"

class JapanAIAirOperationsState {
  constructor() {
    this.endOfAirOp = false
  }
  async doAction(stateObject) {
    console.log("++++++++++++++ FUNK!!!!!!!!!! DO JAPAN AIR UNIT/SG MOVE(S)...")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN

    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN

    const inBattle = await moveStrikeGroups(GlobalInit.controller, stateObject) // strike groups already at sea

    if (!inBattle) {
      // if the previous move has triggered a battle do not move any more SGs
      // the state handler will return to this state after the battle to continue
      // moving the remaining SGs
      console.log("----m QUACK NO COMBAT IJN -> MOVE CARRIER UNITS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      await generateJapanAirOperationsMovesCarriers(GlobalInit.controller, stateObject)

      const inBattle = await moveStrikeGroups(GlobalInit.controller, stateObject)
      console.log("QUACK inBattle=", inBattle)
      if (!inBattle) {
        console.log("NOT IN BATTLE, end the air op NOW!!!!!!!!!!!!")
        this.endOfAirOp = true

        await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative)
        // await generateJapanAirOperationsMovesCarriers(GlobalInit.controller, stateObject)

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

    // if any CAP need to return -> Go to new state US_CAP_RETURN

    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.US)

    if (capUnitsReturning.length > 0) {
      GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_RETURN
      GlobalGameState.updateGlobalState()
    } else {
      console.log("+++++++++++++++++++++++++ DOING TIDY UP...")

      // No idea why this is commented out
      // await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
      GlobalGameState.updateGlobalState()
      setEndOfAirOpAlertShow(true)
    }
  }

  getState() {
    return GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

export default JapanAIAirOperationsState
