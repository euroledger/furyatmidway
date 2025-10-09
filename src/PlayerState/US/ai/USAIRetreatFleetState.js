import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { checkFleetsInSameHex, moveOnFromSeaBattles } from "../../StateUtils"

class USAIRetreatFleetState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate, setPreviousPosition, previousPosition, setUSMapRegions } = stateObject

    await checkFleetsInSameHex(
      GlobalInit.controller,
      setFleetUnitUpdate,
      setPreviousPosition,
      previousPosition,
      setUSMapRegions
    )
    // this.nextState(stateObject)
  }

  async nextState(stateObject) {
    const { setUSMapRegions, setFleetUnitUpdate, setCardNumber } = stateObject

    console.log(">>>>> MOVING ON FROM US FLEET RETREAT")

    if (GlobalGameState.gameTurn === 4) {
      await moveOnFromSeaBattles({
        setUSMapRegions,
        setFleetUnitUpdate,
        setCardNumber,
      })
    } else {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.isFirstAirOp = true
      console.log(">>>>>>>>>>>>>> POOOOOO 1 change to air search")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
    }
  }

  getState() {
    return GlobalGameState.PHASE.RETREAT_US_FLEET
  }
}

export default USAIRetreatFleetState
