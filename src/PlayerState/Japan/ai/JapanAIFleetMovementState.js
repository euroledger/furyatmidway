import GlobalGameState from "../../../model/GlobalGameState"
import { delay } from "../../../DiceHandler"
import { DELAY_MS, goToMidwayAttackOrUSFleetMovement } from "../../StateUtils"
import { createFleetUpdate } from "../../../AirUnitData"
import { moveJapan1AFFleetAction } from "../../../UIEvents/AI/JapanFleetMovementBot"

class JapanAIFleetMovementState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate } = stateObject

    const startingPosition = moveJapan1AFFleetAction()
    const jpFleetMove = createFleetUpdate("1AF", startingPosition.q, startingPosition.r)
    setFleetUnitUpdate(jpFleetMove)
    await delay(DELAY_MS)
  }

  async nextState(stateObject) {
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
