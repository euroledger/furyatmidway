import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import midwayAttackDecisionAction from "../../../UIEvents/AI/MidwayAttackDeclarationBot"

class JapanAIMidwayDeclarationState {
  async doAction(stateObject) {
    const { setMidwayAIInfoShow } = stateObject
    console.log("DO MIDWAY DECLARATION ACTION")
    midwayAttackDecisionAction(GlobalInit.controller)
    if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
      setMidwayAIInfoShow(true)
    }
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER MIDWAY....")

    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US


    if (goToDMCVState(GlobalUnitsModel.Side.US) && !GlobalGameState.dmcvChecked) {
      console.log("********** DO US DMCV FLEET PLANNING FIRST ************ ")
      GlobalGameState.dmcvChecked = true

          console.log("++++++++++++++++++++++++++++ GO TO DMCV QUACK 4")

      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
    } else {
      console.log(">>>>>>>>> SET PHASE TO US_FLEET_MOVEMENT_PLANNING")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
    }
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_MIDWAY
  }
}

export default JapanAIMidwayDeclarationState
