import GlobalGameState from "../../../model/GlobalGameState"
import { rollZeDice } from "../../StateUtils"

class USAIAirAttack2State {
  async doAction(stateObject) {
    console.log("++++++++++++++ US Air Attack 2")
    await rollZeDice()
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM US AI AIR ATTACK 2")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
  }

  getState() {
    return GlobalGameState.PHASE.AIR_ATTACK_2
  }
}

export default USAIAirAttack2State
