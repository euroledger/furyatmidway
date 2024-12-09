import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import midwayAttackDecision from "../../../UIEvents/AI/MidwayAttackDeclarationBot"

class JapanAIMidwayDeclarationState {
  async doAction(stateObject) {
    const { setMidwayAIInfoShow } = stateObject
    console.log("DO MIDWAY DECLARATION ACTION")
    midwayAttackDecision(GlobalInit.controller)
    setMidwayAIInfoShow(true)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER MIDWAY....")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_MIDWAY
  }
}

export default JapanAIMidwayDeclarationState
