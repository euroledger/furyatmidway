import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
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
    await moveOnFromSeaBattles({
      setUSMapRegions,
      setFleetUnitUpdate,
      setCardNumber,
    })
  }

  getState() {
    return GlobalGameState.PHASE.RETREAT_US_FLEET
  }
}

export default USAIRetreatFleetState
