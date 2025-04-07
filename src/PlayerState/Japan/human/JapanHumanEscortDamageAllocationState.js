import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"

class JapanHumanEscortDamageAllocationState {
  async doAction(stateObject) {
    console.log("DO ESCORT DAMAGE ALLOCATION FOR IJN ")
  }

  async nextState(stateObject) {
    console.log("END OF ESCORT_DAMAGE_ALLOCATION attacking steps remaining=", GlobalGameState.attackingStepsRemaining)
    if (GlobalGameState.attackingStepsRemaining > 0) {
      // if elite pilots and midway attack we did escort counterattack first
      // so transition to CAP_INTERCEPTION
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      } else {
        console.log("QUACK 5 GOING TO AAA FIRE")
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
      }
    } else {
      await endOfAirOperation(
        capAirUnits,
        setAirUnitUpdate,
        setEliminatedUnitsPanelShow
      )
      midwayOrAirOps()
    }
  }

  getState() {
    return GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
  }
}

export default JapanHumanEscortDamageAllocationState
