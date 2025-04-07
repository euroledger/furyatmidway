import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { getNumEscortFighterSteps } from "../../../DiceHandler"


class JapanHumanCapDamageAllocationState {
  async doAction(stateObject) {
    console.log("++++++++++++++ JAPAN DAMAGE ALLOCATION...num hits to eliminate:", GlobalGameState.capHits)

  }

  async nextState(stateObject) {
    const { capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
      if (GlobalGameState.attackingStepsRemaining > 0) {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        console.log("QUACK 1 GOING TO AAA FIRE")
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

export default JapanHumanCapDamageAllocationState
