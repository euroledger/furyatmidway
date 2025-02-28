import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { allocateCAPDamageToAttackingStrikeUnit } from "../../../UIEvents/AI/USAirCombatBot"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"
import { delay } from "../../../Utils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { getNumEscortFighterSteps } from "../../../DiceHandler"


class USAICapDamageAllocationState {
  async doAction(stateObject) {
    console.log("++++++++++++++ US DAMAGE ALLOCATION...num hits to eliminate:", GlobalGameState.capHits)

    if (GlobalGameState.capHits > 0) {
      for (let i = 0; i < GlobalGameState.capHits; i++) {
        await delay(1000)

        GlobalGameState.testStepLossSelection = -1
        GlobalGameState.updateGlobalState()
        await delay(10)
        let strikeUnits = GlobalInit.controller.getAttackingStrikeUnits()

        if (strikeUnits.length === 0) {
          break // all strike units eliminated
        }
        // US Damage Allocation Bot...picks one unit to take this hit
        const { index } = await allocateCAPDamageToAttackingStrikeUnit(strikeUnits)

        GlobalGameState.testStepLossSelection = index
        GlobalGameState.updateGlobalState()
      }
    }
  }

  async nextState(stateObject) {
    const { capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
      if (GlobalGameState.attackingStepsRemaining > 0) {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
      } else {
        await endOfAirOperation(
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        midwayOrAirOps()
      }
    } else {
      if (GlobalGameState.attackingStepsRemaining > 0 || getNumEscortFighterSteps(GlobalInit.controller) > 0) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
      } else {
        await endOfAirOperation(
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        midwayOrAirOps()
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION
  }
}

export default USAICapDamageAllocationState
