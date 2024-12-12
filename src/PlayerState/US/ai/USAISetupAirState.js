import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { airUnitDataUS } from "../../../AirUnitData"

class USAISetupAirState {
  constructor() {
    GlobalGameState.setupPhase = 6
  }
  async doAction(stateObject) {
    console.log("US AI do air setup...for carrier:", GlobalGameState.US_CARRIERS[GlobalGameState.currentCarrier])
    // for (const unit of airUnitDataUS) {
    //   update = calcTestDataUS(unit, GlobalInit.controller)
    //   if (!update) {
    //     continue
    //   }
    //   update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)

    //   let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)

    //   update.position = position1.offsets[update.index]

    //   setTestUpdate(update)

    //   await delay(DELAY)
    //   if (update.nextAction) {
    //     nextAction(e)
    //   }
    // }
  }

  nextState(stateObject) {
    GlobalGameState.currentCarrier++
    GlobalGameState.setupPhase++
    GlobalGameState.currentTaskForce =
      GlobalGameState.currentCarrier <= 1 ? 1 : GlobalGameState.currentCarrier === 2 ? 2 : 3 // 3 is Midway
    if (GlobalGameState.currentCarrier === 4) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_CARD_DRAW

      GlobalGameState.usSetUpComplete = true
      GlobalInit.controller.drawUSCards(2, true)
      GlobalGameState.usCardsDrawn = true
      GlobalGameState.phaseCompleted = false
      return new USAICardDrawState()
    }
    GlobalGameState.phaseCompleted = false
    return this
  }

  getState() {
    return GlobalGameState.PHASE.US_SETUP_AIR
  }
}

export default USAISetupAirState
