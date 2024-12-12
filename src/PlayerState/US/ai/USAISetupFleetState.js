import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import USAISetupAirState from "./USAISetupAirState"
import { moveUSCSFFleet } from "../../../UIEvents/AI/USFleetMovementBot"
import { getFleetUnitUpdateUS } from "../../../AirUnitData"

class USAISetupFleetState {
  async doAction(stateObject) {
    const { setFleetUnitUpdate } = stateObject
    console.log("US FLEET SETUP -> NOW FOR THE US AI TO EARN ITS MONEY -> AIR SETUP TIME!!!!!!!!!!!")

    // let update = getFleetUnitUpdateUS("CSF")
    const startingPosition = moveUSCSFFleet()
    let usFleetMove = getFleetUnitUpdateUS("CSF", startingPosition.q, startingPosition.r)
    setFleetUnitUpdate(usFleetMove)
  
    await delay(GlobalGameState.DELAY)

    // update = getFleetUnitUpdateUS("CSF-JPMAP")
    usFleetMove = getFleetUnitUpdateUS("CSF-JPMAP", startingPosition.q, startingPosition.r)
    setFleetUnitUpdate(usFleetMove)

    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
    GlobalGameState.usFleetPlaced = true
  }

  nextState(stateObject) {
    return new USAISetupAirState()
  }

  getState() {
    return GlobalGameState.PHASE.US_SETUP_FLEET
  }
}

export default USAISetupFleetState
