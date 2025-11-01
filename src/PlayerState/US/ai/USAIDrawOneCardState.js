import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { isMidwayAttackPossible } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { goToDMCVState } from "../../StateUtils"

class USAIDrawOneCardState {
  async doAction(stateObject) {
    console.log("DO DRAW ONE CARD ACTION")
    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    GlobalGameState.phaseCompleted = true
    GlobalGameState.usCardsDrawn = true
    GlobalInit.controller.drawUSCards(1, false)

    // GlobalInit.controller.drawUSCards(1, true, [3]) // QUACK TESTING

    if (GlobalGameState.gameTurn !== 4 && isMidwayAttackPossible()) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
      return
    } else {
      if (goToDMCVState(GlobalUnitsModel.Side.US) && !GlobalGameState.dmcvChecked) {
        console.log("********** DO US DMCV FLEET PLANNING FIRST ************ ")
        GlobalGameState.dmcvChecked = true

        console.log("++++++++++++++++++++++++++++ GO TO DMCV QUACK 7")

        GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
      } else {
        console.log(">>>>>>>>> SET PHASE TO US_FLEET_MOVEMENT_PLANNING")
        GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.US_DRAWS_ONE_CARD
  }
}

export default USAIDrawOneCardState
