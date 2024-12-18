import GlobalGameState from "../../../model/GlobalGameState"
import { goToIJNFleetMovement, goToMidwayAttackOrUSFleetMovement } from "../../StateUtils"


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
    const { setMidwayNoAttackAlertShow, setJapanMapRegions, setJapanMIFMapRegions, setFleetUnitUpdate } = stateObject
    await goToMidwayAttackOrUSFleetMovement({
      setMidwayNoAttackAlertShow,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setFleetUnitUpdate,
    })
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }
}

export default JapanHumanFleetMovementState
