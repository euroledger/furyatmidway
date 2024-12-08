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
    console.log("NEXT STATE BOOGERING FROM JAPAN MIDWAY DECLARATION")
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_CARD_DRAW
  }
}

export default JapanAIMidwayDeclarationState
