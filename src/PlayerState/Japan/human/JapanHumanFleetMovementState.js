import GlobalGameState from "../../../model/GlobalGameState"
import { goToIJNFleetMovement, goToMidwayAttackOrUSFleetMovement } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanFleetMovementState {
  async doAction(stateObject) {
    const { setUSMapRegions, setJapanMapRegions, setJapanMIFMapRegions, setJpAlertShow, setEnabledJapanFleetBoxes } =
      stateObject
    console.log("DO IJN FLEET MOVEMENT")

    goToIJNFleetMovement({
      setUSMapRegions,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setJpAlertShow,
      setEnabledJapanFleetBoxes,
    })
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER FLEET MOVEMENT....")
    GlobalGameState.distanceBetweenCarrierFleets = GlobalInit.controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )

      console.log(
          "********** IJN FLEET MOVEMENT distance between fleets THIS turn =>",
          GlobalGameState.distanceBetweenCarrierFleets
        )
    const { setMidwayNoAttackAlertShow, setJapanMapRegions, setJapanMIFMapRegions, setFleetUnitUpdate } = stateObject
    await goToMidwayAttackOrUSFleetMovement({
      setMidwayNoAttackAlertShow,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setFleetUnitUpdate,
    })
    GlobalGameState.midwayAirOp = 1
    GlobalGameState.airOpJapan = 1
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }
}

export default JapanHumanFleetMovementState
