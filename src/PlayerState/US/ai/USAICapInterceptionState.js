import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"
import { doCapSelection } from "../../../UIEvents/AI/USAirCombatBot"
import { delay } from "../../../Utils"

class USAICapInterceptionState {
  async doAction(stateObject) {
    const { capSteps } = stateObject

    console.log(">>>>>>>> US AI CAP INTERCEPTION GlobalGameState.doneCapSelection=", GlobalGameState.doneCapSelection)

    if (!GlobalGameState.doneCapSelection) {
      GlobalGameState.dieRolls = []
      await doCapSelection(GlobalInit.controller)
      this.capDiceRolled = false
    } else {
      // already done cap steps (elite pilots) -> just roll the dice
      console.log(
        "DEBUG: second CAP interception, no selection, just roll dice, GlobalGameState.rollDice=",
        GlobalGameState.rollDice
      )
      GlobalGameState.rollDice = false
      GlobalGameState.testCapSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(1000)
      GlobalGameState.rollDice = true
      GlobalGameState.updateGlobalState()
      this.capDiceRolled = true
    }
  }

  async nextState(stateObject) {
    const { capSteps, capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject

    console.log("MOVE ON FROM US AI CAP INTERCEPTION! capSteps=", capSteps, "CAP AIR UNITS=", capAirUnits)

    console.log("STATE CHANGE CAP -> AAA FIRE OR ESCORT COUNTERATTACK OR CAP DAMAGE")
    if (
      !this.capDiceRolled &&
      GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY &&
      GlobalGameState.elitePilots
    ) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
      return
    }
    GlobalGameState.midwayAttackResolved = true

    if (GlobalGameState.capHits > 0) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION
    } else {
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        if (GlobalGameState.attackingStepsRemaining > 0 || GlobalGameState.attackingStepsRemaining === undefined) {
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
