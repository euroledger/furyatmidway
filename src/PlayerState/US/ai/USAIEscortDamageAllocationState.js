import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"
import { allocateEscortDamageToDefendingCapUnits } from "../../../UIEvents/AI/USAirCombatBot"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"

class USAIEscortDamageAllocationState {
  async doAction(stateObject) {
    const { setCapSteps, capSteps } = stateObject
    console.log("DO ESCORT DAMAGE ALLOCATION FOR US number hits= ", GlobalGameState.fighterHits)

    // Only fighters so select by combat strength

    // Allocate damage to defending CAP
    let numHitsAllocated = 0
    for (let i = 0; i < GlobalGameState.fighterHits; i++) {
      await delay(1000)

      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(10)
      // let strikeUnits = GlobalInit.controller.getAttackingStrikeUnits()
      // US Damage Allocation Bot...picks one unit to take this hit
      let capUnits = GlobalInit.controller.getAllCAPDefenders(GlobalUnitsModel.Side.US)
      if (capUnits.length === 0) {
        break // all cap units eliminated
      }
      const { unit, index } = await allocateEscortDamageToDefendingCapUnits(capUnits)
      numHitsAllocated++
      GlobalGameState.testStepLossSelection = index
      GlobalGameState.updateGlobalState()
      GlobalInit.controller.removeUnitFromCAPDefenders(unit)
    }

    setCapSteps(() => capSteps - numHitsAllocated)
  }

  async nextState(stateObject) {
    console.log("END OF ESCORT_DAMAGE_ALLOCATION attacking steps remaining=", GlobalGameState.attackingStepsRemaining)
    if (GlobalGameState.attackingStepsRemaining > 0) {
      // if elite pilots and midway attack we did escort counterattack first
      // so transition to CAP_INTERCEPTION
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      } else {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
      }
    } else {
      await endOfAirOperation(capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow)
      midwayOrAirOps()
    }
  }

  getState() {
    return GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
  }
}

export default USAIEscortDamageAllocationState
