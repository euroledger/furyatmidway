import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { goToDMCVState } from "../../StateUtils"
import { getUSFleetRegions } from "../../StateUtils"
import { doUSFleetMovementAction } from "../../../UIEvents/AI/USFleetMovementBot"
import { convertHexCoords } from "../../../components/HexUtils"
import { createFleetUpdate } from "../../../AirUnitData"
import { delay } from "../../../Utils"

class USAIFleetMovementPlanningState {
  async doAction(stateObject) {
    console.trace()
    console.log("DOING US FLEET MOVEMENT PLANNING")

    const { setFleetUnitUpdate } = stateObject
    const { canCSFMoveFleetOffBoard, usCSFRegions } = getUSFleetRegions()

    await delay(GlobalGameState.DELAY)
    let destination = doUSFleetMovementAction(GlobalInit.controller, usCSFRegions, canCSFMoveFleetOffBoard)
    console.log("US FLEET DESTINATION:", destination)

    const c = convertHexCoords(destination)
    console.log("US FLEET DESTINATION:", c)

    const usFleetMove = createFleetUpdate("CSF", destination.q, destination.r)
    setFleetUnitUpdate(usFleetMove)

    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    // See if we should go to US DMCV Fleet Planning first
    console.log("POOOOOOOOOOOOOOOOO CHECK IJN DMCV ??????????????????????????")
    if (goToDMCVState(GlobalUnitsModel.Side.JAPAN) && !GlobalGameState.dmcvChecked) {
      console.log("********** DO JAPAN DMCV FLEET PLANNING FIRST ************ ")
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
    } else {
      console.log(">>>>>>>>> SET PHASE TO JAPAN FLEET MOVEMENT PLANNING")
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.initial1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
    }
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USAIFleetMovementPlanningState
