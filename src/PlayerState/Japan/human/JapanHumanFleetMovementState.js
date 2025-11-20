import GlobalGameState from "../../../model/GlobalGameState"
import { goToIJNFleetMovement, goToMidwayAttackOrUSFleetMovement } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { autoSave } from "../../../Utils"

class JapanHumanFleetMovementState {
  async doAction(stateObject) {
    const { setUSMapRegions, setJapanMapRegions, setJapanMIFMapRegions, setJpAlertShow, setEnabledJapanFleetBoxes } =
      stateObject
    console.log("DO IJN FLEET MOVEMENT -> IJN 1AF LOCATION =", GlobalGameState.initial1AFLocation)

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

    console.log(GlobalGameState.distanceBetweenCarrierFleets)
    const { setMidwayNoAttackAlertShow, setJapanMapRegions, setJapanMIFMapRegions, setFleetUnitUpdate } = stateObject
    autoSave(GlobalInit.controller, GlobalUnitsModel.Side.JAPAN)

    await goToMidwayAttackOrUSFleetMovement({
      setMidwayNoAttackAlertShow,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setFleetUnitUpdate,
    })
    GlobalGameState.midwayAirOp = 1
    GlobalGameState.airOpJapan = 0
  }

  getState() {
    return
  }
}

export default JapanHumanFleetMovementState
