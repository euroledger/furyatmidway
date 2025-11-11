import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalInit from "../../../model/GlobalInit"
import { getUSFleetRegions } from "../../StateUtils"
import { doUSDMCVFleetMovementAction } from "../../../UIEvents/AI/USFleetMovementBot"
import { convertHexCoords } from "../../../components/HexUtils"
import { createFleetUpdate, createRemoveDMCVFleetUpdate } from "../../../AirUnitData"
import { getRandomElementFrom } from "../../../Utils"
import HexCommand from "../../../commands/HexCommand"
import { checkRemoveFleet } from "../../StateUtils"
import { delay } from "../../../Utils"


class USAIDMCVFleetMovementPlanningState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate, doAIDMCVShipMarkerUpdate } = stateObject

    const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

    const damagedCarriers = GlobalInit.controller.getDamagedCarriers(GlobalUnitsModel.Side.US)

    if (damagedCarriers.length === 0 || (usDMCVLocation !== undefined && usDMCVLocation === HexCommand.OFFBOARD)) {
      this.nextState(stateObject)
    }
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

        const usFleetMove = createFleetUpdate("US-DMCV", destination.q, destination.r)
        GlobalGameState.usDMCVFleetPlaced = true

        setFleetUnitUpdate(usFleetMove)
        await delay(10)
        // Set the damaged carrier
        // 1. get the list of damaged carriers

        console.log(">>>> DEBUG damagedCarriers=", damagedCarriers)
        // 2. select a carrier
        const cv = getRandomElementFrom(damagedCarriers)

        console.log(">>>> DEBUG cv=", cv)

        // 3. do the DMCV marker update
        let carrierUnit = GlobalInit.controller.getCarrier(cv)

        console.log(">>>> DEBUG carrierUnit=", carrierUnit)

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
    const { setFleetUnitUpdate } = stateObject

    console.log("MOVING ON FROM US DMCV FLEET MOVEMENT PLANNING")
    // Check to see if placing DMCV means there are no (non-sunk) carriers left in CSF
    checkRemoveFleet(GlobalUnitsModel.Side.US, setFleetUnitUpdate)

    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
    GlobalGameState.dmcvChecked = false // ready for the IJN check
    GlobalGameState.updateGlobalState()
  }

  getState() {
    return GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
  }
}

export default USAIDMCVFleetMovementPlanningState
