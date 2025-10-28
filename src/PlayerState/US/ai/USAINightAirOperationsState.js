import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../Utils"
import { endOfNightAirOperation } from "../../StateUtils"
import { moveAirUnit } from "../../../UIEvents/AI/USAirOperationsBot"

class USAINightAirOperationsState {
  async doAction(stateObject) {
    const { setNightLandingDone, setNightSteps, setNightAirUnits, setNightLandingPanelShow, setTestUpdate } =
      stateObject
    console.log(">>>>>>>> US NIGHT AIR OPERATIONS <<<<<<<<<< ")

    setNightLandingDone(false)
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US // needed in view event handler

    // Move all Units in Strike Groups to return2

    // Get all air units in Return Boxes - do this first to free up strike boxes
    let units = GlobalInit.controller.getAirUnitsInStrikeBoxesReadyToReturn(GlobalUnitsModel.Side.US)
    if (units.length > 0) {
      for (let unit of units) {
        if (unit.aircraftUnit.moved) {
          continue
        }
        await delay(10)
        await moveAirUnit(GlobalInit.controller, unit, setTestUpdate, true)
      }
    }

    let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.US)
    if (unitsReturn2.length > 0) {
      const steps = GlobalInit.controller.getTotalSteps(unitsReturn2)
      setNightSteps(steps)
      setNightAirUnits(unitsReturn2)
      GlobalGameState.closePanel = false
      GlobalGameState.updateGlobalState()
      setNightLandingPanelShow(true)

      GlobalGameState.rollDice = false
      GlobalGameState.updateGlobalState()
      await delay(800)
      GlobalGameState.rollDice = true
      await delay(10)
      GlobalGameState.updateGlobalState()
    }
  }

  async nextState(stateObject) {
    const { setTestUpdate, setEliminatedUnitsPanelShow, setCardNumber, setEndOfTurnSummaryShow } = stateObject

    // Return units to carriers and move to hangar then flight deck or CAP
    await endOfNightAirOperation(GlobalInit.controller, setTestUpdate, GlobalUnitsModel.Side.US)
    console.log(">>>>> MOVING ON FROM US NIGHT AIR OPERATIONS<<<<<<<<<")
    if (GlobalGameState.orphanedAirUnits.length > 0) {
      setEliminatedUnitsPanelShow(true)
    } else {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.cardsChecked = new Array()
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      GlobalGameState.updateGlobalState()
    }
  }

  getState() {
    return GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
  }
}

export default USAINightAirOperationsState
