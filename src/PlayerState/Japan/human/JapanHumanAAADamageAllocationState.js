import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { displayAttackTargetPanel } from "../../StateUtils"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"

class JapanHumanAAADamageAllocationState {
  async doAction(stateObject) {
    console.log("++++++++++++++ JAPAN AAA DAMAGE ALLOCATION...num hits to eliminate:", GlobalGameState.antiaircraftHits)

  }

  async nextState(stateObject) {
    const { capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject
    console.log(
      "************************ WOGS !!!!!!!!!!!!!!!! MOVE ON FROM JAPAN AI AAA DAMAGE...attacking steps remaining=",
      GlobalInit.controller.getAttackingStepsRemaining()
    )
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN

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

export default JapanHumanAAADamageAllocationState
