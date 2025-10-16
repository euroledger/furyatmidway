import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { goToDMCVState } from "../../StateUtils"
import { getUSFleetRegions } from "../../StateUtils"
import { doUSFleetMovementAction } from "../../../UIEvents/AI/USFleetMovementBot"
import { convertHexCoords } from "../../../components/HexUtils"
import { createFleetUpdate } from "../../../AirUnitData"
import { delay } from "../../../Utils"
import { DELAY_MS } from "../../StateUtils"

class USAIFleetMovementPlanningState {
  async doAction(stateObject) {
    console.log("DOING US FLEET MOVEMENT PLANNING")

    const { setFleetUnitUpdate } = stateObject
    const { canCSFMoveFleetOffBoard, usCSFRegions } = getUSFleetRegions()

    await delay(GlobalGameState.DELAY)
    let destination = doUSFleetMovementAction(GlobalInit.controller, usCSFRegions, canCSFMoveFleetOffBoard)

    const c = convertHexCoords(destination)
    console.log("US FLEET DESTINATION:", c)

    const usFleetMove = createFleetUpdate("CSF", destination.q, destination.r)
    setFleetUnitUpdate(usFleetMove)

    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    console.log("GOOD POINT")
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
    GlobalGameState.updateGlobalState()
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USAIFleetMovementPlanningState
