import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation } from "../../StateUtils"

class JapanHumanAirAttack1State {
  async doAction(stateObject) {
    console.log("++++++++++++++ JAPAN Air Attack (1)... do nothing ++++++++++++")
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject
    console.log("MOVE ON FROM JAPAN AI AIR ATTACK")

    console.log("DEBUG GlobalGameState.currentCarrierAttackTarget=", GlobalGameState.currentCarrierAttackTarget)

    if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
      console.log("GO TO DAMAGE RESOLUTION")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION
    } else {
      if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.MIF) {
        await endOfAirOperation(
          undefined, // MIF has no CAP units
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.AIR_ATTACK_1
  }
}

export default JapanHumanAirAttack1State
