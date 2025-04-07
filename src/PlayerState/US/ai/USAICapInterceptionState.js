import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import { doCapSelection } from "../../../UIEvents/AI/USAirCombatBot"


class USAICapInterceptionState {
  async doAction(stateObject) {
    console.log(">>>>>>>> US AI CAP INTERCEPTION")

    await doCapSelection(GlobalInit.controller)
  }

  async nextState(stateObject) {
    const { capSteps, capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject

    console.log("MOVE ON FROM US AI CAP INTERCEPTION! capSteps=", capSteps, "CAP AIR UNITS=", capAirUnits)

    console.log("STATE CHANGE CAP -> AAA FIRE OR ESCORT COUNTERATTACK OR CAP DAMAGE")
    GlobalGameState.midwayAttackResolved = true

    if (GlobalGameState.capHits > 0) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION
    } else {
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        if (GlobalGameState.attackingStepsRemaining > 0 || GlobalGameState.attackingStepsRemaining === undefined) {
          console.log("QUACK 6 GOING TO AAA FIRE")

          GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        } else {
          await endOfAirOperation(capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow)
          midwayOrAirOps()
        }
      } else {
        if (capSteps > 0) {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
        } else {
          console.log("QUACK 7 GOING TO AAA FIRE")
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        }
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.CAP_INTERCEPTION
  }
}

export default USAICapInterceptionState
