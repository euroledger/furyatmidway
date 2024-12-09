import GlobalGameState from "../../../model/GlobalGameState"
import { airUnitDataJapan } from "../../../AirUnitTestData"
import GlobalInit from "../../../model/GlobalInit"
import { calcRandomJapanTestData } from "../../../AirUnitTestData"
import JapanAirBoxOffsets from "../../../components/draganddrop/JapanAirBoxOffsets"
import { delay } from "../../../Utils"

class JapanAISetupState {
  async doAction(stateObject) {
    const { setTestUpdate } = stateObject
    let update
    for (const unit of airUnitDataJapan) {
      update = calcRandomJapanTestData(unit, GlobalInit.controller)
      if (!update) {
        continue
      }
      update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
      let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
      update.position = position1.offsets[update.index]

      setTestUpdate(update)
      await delay(GlobalGameState.DELAY)
      if (update.nextAction) {
        await this.nextState()
      }
      await delay(GlobalGameState.DELAY)
    }
  }

  async nextState() {
    if (GlobalGameState.currentCarrier <= 2) {
      GlobalGameState.currentCarrier++
      GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
      GlobalInit.controller.drawJapanCards(3, true)
      GlobalGameState.jpCardsDrawn = true
    }
    GlobalGameState.phaseCompleted = false
    GlobalGameState.setupPhase++
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_SETUP
  }
}

export default JapanAISetupState
