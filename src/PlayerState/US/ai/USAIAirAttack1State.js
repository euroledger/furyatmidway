import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../Utils"
import { endOfAirOperation } from "../../StateUtils"

class USAIAirAttack1State {
  async doAction(stateObject) {
    console.log("++++++++++++++ US Air Attack")
    await delay(1000)
    GlobalGameState.rollDice = false
    GlobalGameState.updateGlobalState()

    await delay(1000)
    GlobalGameState.rollDice = true
    GlobalGameState.updateGlobalState()
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject
    console.log("MOVE ON FROM US AI AIR ATTACK")

    if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
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

export default USAIAirAttack1State
