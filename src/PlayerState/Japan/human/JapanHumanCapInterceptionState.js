import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"

class JapanHumanCapInterceptionState {
  async doAction(stateObject) {
    console.log(">>>>>>>> JAPAN CAP INTERCEPTION")
  }

  async nextState(stateObject) {
    const { capSteps, capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject

    console.log("MOVE ON FROM JAPAN CAP INTERCEPTION! capSteps=", capSteps, "CAP AIR UNITS=", capAirUnits)

    // TODO move logic from GameStateHandler here...
    console.log("STATE CHANGE CAP -> AAA FIRE OR ESCORT COUNTERATTACK OR CAP DAMAGE")
    GlobalGameState.midwayAttackResolved = true

    if (GlobalGameState.capHits > 0) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION
    } else {
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        if (GlobalGameState.attackingStepsRemaining > 0 || GlobalGameState.attackingStepsRemaining === undefined) {
          console.log("QUACK 2 GOING TO AAA FIRE")
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
        if (capSteps > 0) {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
        } else {
          console.log("QUACK 3 GOING TO AAA FIRE")
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        }
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.CAP_INTERCEPTION
  }
}

export default JapanHumanCapInterceptionState
