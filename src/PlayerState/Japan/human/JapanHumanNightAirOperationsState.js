import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanNightAirOperationsState {
  async doAction(stateObject) {
    const { setNightLandingDone, setNightSteps, setNightAirUnits, setNightLandingPanelShow } = stateObject
    console.log(">>>>>>>> JAPAN NIGHT AIR OPERATIONS <<<<<<<<<< ")

    setNightLandingDone(false)
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN // needed in view event handler

    let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.JAPAN)
    if (unitsReturn2.length > 0) {
      const steps = GlobalInit.controller.getTotalSteps(unitsReturn2)
      setNightSteps(steps)
      setNightAirUnits(unitsReturn2)
      setNightLandingPanelShow(true)
    }

    GlobalGameState.phaseCompleted = false
  }

  async nextState(stateObject) {
    console.log(">>>>> MOVING ON FROM JAPAN NIGHT AIR OPERATIONS<<<<<<<<<")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
  }

  getState() {
    return GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
  }
}

export default JapanHumanNightAirOperationsState
