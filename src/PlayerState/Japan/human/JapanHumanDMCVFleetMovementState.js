import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanDMCVFleetMovementState {
  async doAction(stateObject) {
    const { setUSMapRegions, setJapanFleetRegions, setEnabledUSFleetBoxes } = stateObject

    console.log("++++++++++ DO DMCV FLEET MOVEMENT JAPAN")

    GlobalGameState.jpDMCVFleetMoved = false
    GlobalGameState.phaseCompleted = true // placing DMCV is not mandatory
    setUSMapRegions([])
    setJapanFleetRegions()
    setEnabledUSFleetBoxes(false)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER JAPAN DMCV FLEET MOVEMENT....")
    GlobalGameState.initial1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    GlobalGameState.initialMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
  }
}

export default JapanHumanDMCVFleetMovementState
