import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation } from "../../StateUtils"
import GlobalInit from "../../../model/GlobalInit"
import { midwayTidyUp } from "../../StateUtils"

class JapanHumanMidwayAirAttackState {
  async doAction(stateObject) {
    const { setJapanStrikePanelEnabled } = stateObject
    console.log("++++++++++++++ JAPAN MIDWAY Air Attack ++++++++++++")
    setJapanStrikePanelEnabled(true)
    GlobalGameState.phaseCompleted = false
  }

  async nextState(stateObject) {
    const { setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate, setJapanMapRegions } =
      stateObject
    if (GlobalInit.controller.getDistanceBetween1AFAndMidway() <= 2) {
      await midwayTidyUp(setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate)
      return
    }
    if (GlobalGameState.midwayAirOp === 1) {
      setJapanMapRegions([])
      GlobalGameState.midwayAirOp = 2
      GlobalGameState.airOpJapan = 2
      GlobalGameState.airOperationPoints.japan = 1
    } else {
      await midwayTidyUp(setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate)
    }
    GlobalGameState.updateGlobalState()
  }

  getState() {
    return GlobalGameState.PHASE.MIDWAY_ATTACK
  }
}

export default JapanHumanMidwayAirAttackState
