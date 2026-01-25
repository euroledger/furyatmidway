import GlobalGameState from "../../../model/GlobalGameState"
import { delay } from "../../../Utils"
import { DELAY_MS, goToMidwayAttackOrUSFleetMovement } from "../../StateUtils"
import { createFleetUpdate } from "../../../AirUnitData"
import { moveJapan1AFFleetAction } from "../../../UIEvents/AI/JapanFleetMovementBot"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanAIFleetMovementState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate } = stateObject

    const startingPosition = moveJapan1AFFleetAction()
    const jpFleetMove = createFleetUpdate("1AF", startingPosition.q, startingPosition.r)
    setFleetUnitUpdate(jpFleetMove)
    await delay(DELAY_MS)
  }

  async nextState(stateObject) {
    GlobalGameState.initial1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    
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

export default JapanAIFleetMovementState
