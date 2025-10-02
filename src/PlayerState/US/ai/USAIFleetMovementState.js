import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { usFleetMovementNextStateHandler, usFleetMovementHandler } from "../../StateUtils"
import { displayScreen } from "../../StateUtils"
import USAIAirSearchState from "./USAIAirSearchState"
import USAICardPlayState from "./USAICardPlayState"

class USAIFleetMovementState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate } = stateObject
    console.log("------------> QUACK 1 DO US FLEET MOVEMENT")
    await usFleetMovementHandler({
      setFleetUnitUpdate,
    })
    // this.nextState(stateObject)
  }

  async nextState(stateObject) {
    const { setJpFleet, setUsFleet, setCardNumber, setSearchValues, setSearchResults, setSearchValuesAlertShow } =
      stateObject
    console.log("NEXT STATE AFTER US AI FLEET MOVEMENT")

        console.log("------------> QUACK 2 DO US FLEET NEXT STATE")

    await usFleetMovementNextStateHandler({
      setJpFleet,
      setUsFleet,
      setCardNumber,
      setSearchValues,
      setSearchResults,
    })
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
      if (displayScreen()) {
        setSearchValuesAlertShow(true)
      }

      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      return new USAIAirSearchState()
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
      console.log("NOW GLOBAL GAME STATE game phase=", GlobalGameState.gamePhase)
      return new USAICardPlayState()
    }
  }

  getState() {
    return GlobalGameState.PHASE.US_FLEET_MOVEMENT
  }
}

export default USAIFleetMovementState
