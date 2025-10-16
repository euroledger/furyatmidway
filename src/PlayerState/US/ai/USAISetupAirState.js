import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { getAirSetupBoxes } from "../../../UIEvents/AI/USAirUnitSetupBots"
import { airUnitSetupDataUS } from "../../../AirUnitData"
import { usAirBoxArray } from "../../../AirUnitData"
import USAirBoxOffsets from "../../../components/draganddrop/USAirBoxOffsets"
import { delay } from "../../../Utils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import USAICardDrawState from "./USAICardDrawState"

class USAISetupAirState {
  constructor() {
    GlobalGameState.setupPhase = 6
  }
  async doAction(stateObject) {
    const { setTestUpdate } = stateObject

    let i = 0
    for (let unit of airUnitSetupDataUS) {
      let airBoxes = getAirSetupBoxes(GlobalGameState.US_CARRIERS[GlobalGameState.currentCarrier])

      let update = {
        name: unit.name,
        boxName: "",
        index: -1,
      }
      let boxName
      await delay(GlobalGameState.DELAY)

      if (unit.name.includes(GlobalUnitsModel.Carrier.MIDWAY)) {
        let airBoxes = getAirSetupBoxes(GlobalUnitsModel.Carrier.MIDWAY)
        boxName = usAirBoxArray[airBoxes[i]]
      } else {
        boxName = usAirBoxArray[airBoxes[i]]
      }
      update.boxName = boxName
      const boxIndex = GlobalInit.controller.getFirstAvailableZone(boxName)
      update.index = boxIndex

      let position1 = USAirBoxOffsets.find((box) => box.name === boxName)
      update.position = position1.offsets[update.index]

      console.log("DEBUG air unit:", unit.name, "update=", update)
      setTestUpdate(update)

      i++
      if (unit.nextAction) {
        await this.nextState()
        i = 0
      }
      await delay(GlobalGameState.DELAY)
    }
  }

  async nextState(stateObject) {
    GlobalGameState.currentCarrier++
    GlobalGameState.setupPhase++
    GlobalGameState.currentTaskForce =
      GlobalGameState.currentCarrier <= 1 ? 1 : GlobalGameState.currentCarrier === 2 ? 2 : 3 // 3 is Midway
    if (GlobalGameState.currentCarrier === 4) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_CARD_DRAW
      GlobalGameState.updateGlobalState()
      GlobalGameState.usSetUpComplete = true
      GlobalInit.controller.drawUSCards(2, true) 

      // GlobalInit.controller.drawUSCards(2, true, [8, 7]) TEST

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
