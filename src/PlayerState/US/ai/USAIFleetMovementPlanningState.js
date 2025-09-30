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
    console.log("%%%%%%%%%%%%%%%%%%%% DOING US FLEET MOVEMENT PLANNING%%%%%%%%%%%%%%%%%%%%%")

    const { setFleetUnitUpdate } = stateObject
    const { canCSFMoveFleetOffBoard, usCSFRegions } = getUSFleetRegions()

    // @TODO vary the start location and opening move according to
    // Fleet Strategy, game state and IJN Fleet Location

    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    console.log("FOOOOOOOOOOK turn=", GlobalGameState.gameTurn)
    // if (GlobalGameState.gameTurn === 2) { // QUACK FOR TESTING
    //   this.nextState(stateObject)
    //   return
    // }
    const destination = doUSFleetMovementAction(GlobalInit.controller, usCSFRegions, canCSFMoveFleetOffBoard)

    const c = convertHexCoords(destination)
    console.log("US FLEET DESTINATION:", c)

    const usFleetMove = createFleetUpdate("CSF", destination.q, destination.r)
    setFleetUnitUpdate(usFleetMove)

    await delay(DELAY_MS)

    this.nextState(stateObject)
  }

  dmcvState(side) {
    if (GlobalGameState.jpDMCVCarrier === undefined) {
      return false
    }
    const jpDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

    if (jpDMCVLocation !== undefined && jpDMCVLocation.boxName === HexCommand.FLEET_BOX) {
      return false
    }
    return (
      (GlobalInit.controller.getDamagedCarriers(side).length > 0 && GlobalGameState.jpDMCVFleetPlaced === false) ||
      (jpDMCVLocation !== undefined && GlobalGameState.jpDMCVFleetPlaced === true)
    )
  }
  async nextState(stateObject) {
    console.log("GOOD POINT")
    if (goToDMCVState(GlobalUnitsModel.Side.JAPAN)) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
    }
    GlobalGameState.updateGlobalState()
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USAIFleetMovementPlanningState
