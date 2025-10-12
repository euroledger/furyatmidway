import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { allocateAAADamageToAttackingStrikeUnit } from "../../../UIEvents/AI/USAirCombatBot"
import { displayAttackTargetPanel } from "../../StateUtils"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"
import { delay } from "../../../Utils"

class USAIAAADamageAllocationState {
  async doAction(stateObject) {
    console.log("++++++++++++++ US AAA DAMAGE ALLOCATION...num hits to eliminate:", GlobalGameState.antiaircraftHits)

    if (GlobalGameState.antiaircraftHits > 0) {
      for (let i = 0; i < GlobalGameState.antiaircraftHits; i++) {
        await delay(1000)

        GlobalGameState.testStepLossSelection = -1
        GlobalGameState.updateGlobalState()
        await delay(10)
        let strikeUnits = GlobalInit.controller.getAttackingStrikeUnits(true) // exclude fighters for AAA Fire

        console.log("POOOOOOOOOOO strikeUnits=", strikeUnits)
        if (strikeUnits.length === 0) {
          return // all strike units gone (if more than one '1' rolled this can happen)
        }
        // US AAA Damage Allocation Bot...picks one unit to take this hit
        const { index } = await allocateAAADamageToAttackingStrikeUnit(strikeUnits)

        GlobalGameState.testStepLossSelection = index
        GlobalGameState.updateGlobalState()
      }
    }
  }

  async nextState(stateObject) {
    const { capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject
    console.log(
      "MOVE ON FROM US AI AAA DAMAGE...attacking steps remaining=",
      GlobalInit.controller.getAttackingStepsRemaining()
    )
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US

    if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
      let display = displayAttackTargetPanel(GlobalInit.controller)
      if (display) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
      } else {
        const anyTargets = GlobalInit.controller.autoAssignTargets()
        if (anyTargets === null) {
          // no targets (all units sunk)
          await endOfAirOperation(capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow)
          midwayOrAirOps()
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_1
        }
      }
    } else {
      await endOfAirOperation(capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow)
      midwayOrAirOps()
    }
  }

  getState() {
    return GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
  }
}

export default USAIAAADamageAllocationState
