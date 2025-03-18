import GlobalGameState from "../../../model/GlobalGameState"

class JapanHumanAirAttack2State {
  async doAction(stateObject) {
    console.log("++++++++++++++ JAPAN Air Attack 2")
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM JAPAN AI AIR ATTACK 2")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
  }

  getState() {
    return GlobalGameState.PHASE.AIR_ATTACK_2
  }
}

export default JapanHumanAirAttack2State
