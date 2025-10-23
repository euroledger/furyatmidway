import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { getUSFleetRegions } from "../../StateUtils"
import { doUSDMCVFleetMovementAction } from "../../../UIEvents/AI/USFleetMovementBot"
import { convertHexCoords } from "../../../components/HexUtils"
import { createFleetUpdate, createRemoveDMCVFleetUpdate } from "../../../AirUnitData"
import { getRandomElementFrom } from "../../../Utils"

class USAIDMCVFleetMovementPlanningState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate, doAIDMCVShipMarkerUpdate } = stateObject
    console.log("DOING US DMCV FLEET MOVEMENT PLANNING")

    const { canUSDMCVMoveFleetOffBoard, usDMCVRegions } = getUSFleetRegions()

    // If DMCV fleet can move offboard it always does so
    // Otherwise it heads for the board edge
    if (canUSDMCVMoveFleetOffBoard) {
      const update = createRemoveDMCVFleetUpdate(GlobalUnitsModel.Side.US)
      setFleetUnitUpdate(update)
    } else {
      const destination = doUSDMCVFleetMovementAction(GlobalInit.controller, usDMCVRegions)

      if (destination !== undefined) {
        const c = convertHexCoords(destination)
        console.log("US DMCV FLEET DESTINATION:", c)

        const usFleetMove = createFleetUpdate("US-DMCV", destination.q, destination.r)
        GlobalGameState.usDMCVFleetPlaced = true
        setFleetUnitUpdate(usFleetMove)

        // Set the damaged carrier
        // 1. get the list of damaged carriers
        const damagedCarriers = GlobalInit.controller.getDamagedCarriers(GlobalUnitsModel.Side.US)

        // 2. select a carrier
        const cv = getRandomElementFrom(damagedCarriers)

        // 3. do the DMCV marker update
        let carrierUnit = GlobalInit.controller.getCarrier(cv)
        GlobalGameState.usDMCVCarrier = carrierUnit.name
        GlobalGameState.updateGlobalState()

        if (!carrierUnit.dmcv) {
          console.log(">>>>>>>>>>>>>>>>>>> DO DMCV SHIP MARKER UPDATE !!")
          doAIDMCVShipMarkerUpdate(GlobalUnitsModel.Side.US)
        }

        carrierUnit.dmcv = true
      }
    }

    this.nextState(stateObject)
  }

  async nextState(stateObject) {
    console.log("MOVING ON FROM US DMCV FLEET MOVEMENT PLANNING")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
    GlobalGameState.dmcvChecked = false // ready for the IJN check
    GlobalGameState.updateGlobalState()
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }
}

export default USAIDMCVFleetMovementPlanningState
