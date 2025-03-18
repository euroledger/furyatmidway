import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { endOfAirOperation, midwayOrAirOps, rollZeDice } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class USAIEscortCounterattackState {
  async doAction(stateObject) {
    console.log("++++++++++++++ US ESCORT COUNTERATTACK...")
    await rollZeDice()
  }

  async nextState(stateObject) {
    console.log("END OF ESCORT_COUNTERATTACK")

    if (GlobalGameState.fighterHits > 0) {
      console.log("GOING TO ESCORT DAMAGE ALLOCATION")
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
    } else {
      if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
        if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
        } else {
          console.log("GOING TO ANTI AIRCRAFT FIRE....))))))))))))))))))))))")
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
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
  }

  getState() {
    return GlobalGameState.PHASE.ESCORT_COUNTERATTACK
  }
}

export default USAIEscortCounterattackState
