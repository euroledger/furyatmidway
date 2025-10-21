import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { getFleetsForDMCVSeaBattle } from "../../StateUtils"
import { moveOnFromSeaBattles } from "../../StateTransition"

class JapanHumanNightBattleState {
  async doAction(stateObject) {
    const { setSeaBattlePanelShow } = stateObject

    console.log(">>>>>>>> JAPAN NIGHT BATTLE <<<<<<<<<< ")
    const { numFleetsInSameHexAsCSF } = GlobalInit.controller.opposingFleetsInSameHex()
    if (numFleetsInSameHexAsCSF == 2) {
      setSeaBattlePanelShow(true)
    }
  }

  async nextState(stateObject) {
    console.log(">>>>> MOVING ON FROM JAPAN NIGHT BATTLE<<<<<<<<<")
    const { setJpFleet, setUsFleet, setUSMapRegions, setFleetUnitUpdate, setCardNumber } = stateObject

    // if the night battle has resulted in a DMCV carrier being sunk, need to remove
    // the DMCV Fleet from the map (could be both)
    // possible second sea battle do something like...
    const { fleetsInSameHexAsUSDMCV } = await getFleetsForDMCVSeaBattle(GlobalInit.controller, setJpFleet, setUsFleet)
    if (fleetsInSameHexAsUSDMCV.length === 2) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_BATTLES_2
    } else {
      const { numFleetsInSameHexAsCSF } = GlobalInit.controller.opposingFleetsInSameHex()
      if (numFleetsInSameHexAsCSF === 2) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.RETREAT_US_FLEET
      } else {
        await moveOnFromSeaBattles({
          setUSMapRegions,
          setFleetUnitUpdate,
          setCardNumber,
        })
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.CAP_RETURN
  }
}

export default JapanHumanNightBattleState
