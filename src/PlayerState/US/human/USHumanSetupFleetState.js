import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import USHumanSetupAirState from "./USHumanSetupAirState"

class USHumanSetupFleetState {
  async doAction(stateObject) {
    // const { setTestUpdate } = stateObject
    // let update
    // for (const unit of airUnitDataJapan) {
    //   update = calcRandomJapanTestData(unit, GlobalInit.controller)
    //   if (!update) {
    //     continue
    //   }
    //   update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
    //   let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
    //   update.position = position1.offsets[update.index]
    //   setTestUpdate(update)
    //   await delay(GlobalGameState.DELAY)
    //   if (update.nextAction) {
    //     this.nextState()
    //   }
    // }
  }

  nextState(stateObject) {
    const { setUSMapRegions } = stateObject
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
    GlobalGameState.usFleetPlaced = true
    setUSMapRegions([])
    GlobalGameState.phaseCompleted = false
    GlobalGameState.setupPhase = 6
    return new USHumanSetupAirState()
  }

  getState() {
    return GlobalGameState.PHASE.US_SETUP_FLEET
  }
}

export default USHumanSetupFleetState
