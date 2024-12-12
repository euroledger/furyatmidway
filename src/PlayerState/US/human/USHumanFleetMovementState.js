import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { usFleetMovementHandler, usFleetMovementNextStateHandler } from "../../StateUtils"
import USHumanAirSearchState from "./USHumanAirSearchState"
import USHumanCardPlayState from "./USHumanCardPlayState"

class USHumanFleetMovementState {
  async doAction(stateObject) {
    const { setJapanStrikePanelEnabled, setUSMapRegions } = stateObject
    setJapanStrikePanelEnabled(false)
    setUSMapRegions([])
    GlobalGameState.usFleetMoved = false
    GlobalGameState.dieRolls = []
  }

  async nextState(stateObject) {
    const {
      setFleetUnitUpdate,
      setJpFleet,
      setUsFleet,
      setCardNumber,
      setSearchValues,
      setSearchResults,
      setSearchValuesAlertShow,
    } = stateObject

    usFleetMovementHandler({ setFleetUnitUpdate })

    usFleetMovementNextStateHandler({
      setJpFleet,
      setUsFleet,
      setCardNumber,
      setSearchValues,
      setSearchResults,
      setSearchValuesAlertShow,
    })
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
      setSearchValuesAlertShow(true)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      return new USHumanAirSearchState()
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
      console.log("NOW GLOBAL GAME STATE game phase=", GlobalGameState.gamePhase)
      return new USHumanCardPlayState()
    }
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT
  }
}

export default USHumanFleetMovementState
