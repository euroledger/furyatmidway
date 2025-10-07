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
        await moveAirUnit(controller, unit, setTestUpdate)
      }
    }

    let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.US)
    if (unitsReturn2.length > 0) {
      const steps = GlobalInit.controller.getTotalSteps(unitsReturn2)
      setNightSteps(steps)
      setNightAirUnits(unitsReturn2)
      setNightLandingPanelShow(true)

      // TODO
      // 1. Add state to state factory - state transition in Japan Night Ops DONE
      // 2. Fix card play for 3 and 4
      // 3. auto roll dice on this panel DONE
      // 4. Do US Returns - CAP -> Hangar, Return2 -> Return1, Return1 -> Hangar DONE
      // 5. Check for possible reorganization DONE
      // 5. US air movement at end of night operations (Hangar -> CAP/Flight Deck)

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
      if (
        GlobalInit.controller.usHandContainsCard(1) &&
        GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0
      ) {
        setCardNumber(() => 1)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2)) {
        setCardNumber(() => 2)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      console.log("END OF TURN BABY!!!!!!! current state=", GlobalGameState.gamePhase)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      setEndOfTurnSummaryShow(true)
    }
  }

  getState() {
    return GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
  }
}

export default USAINightAirOperationsState
