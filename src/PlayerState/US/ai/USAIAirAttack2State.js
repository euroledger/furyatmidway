import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../Utils"
import { endOfAirOperation } from "../../StateUtils"

class USAIAirAttack2State {
  async doAction(stateObject) {
    console.log("++++++++++++++ US Air Attack 2")
    await delay(1000)
    GlobalGameState.rollDice = false
    GlobalGameState.updateGlobalState()

    await delay(1000)
    GlobalGameState.rollDice = true
    GlobalGameState.updateGlobalState()
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setEliminatedUnitsPanelShow } = stateObject
    console.log("MOVE ON FROM US AI AIR ATTACK 2")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
   
  }

  getState() {
    return GlobalGameState.PHASE.AIR_ATTACK_2
  }
}

export default USAIAirAttack2State
