import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import { displayAttackTargetPanel, endOfAirOperation, midwayOrAirOps } from "./StateUtils"

export async function moveOnFromAAAFire(currentPlayer, stateObject) {
  const { capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject

  GlobalGameState.currentPlayer = currentPlayer
  if (GlobalGameState.antiaircraftHits > 0) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
  } else if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
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
