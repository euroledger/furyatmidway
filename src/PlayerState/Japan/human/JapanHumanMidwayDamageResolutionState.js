import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation, midwayOrAirOps } from "../../StateUtils"

class JapanHumanMidwayDamageResolutionState {
  async doAction(stateObject) {
    const { setAttackResolutionPanelShow, setDamageDone, setMidwayDamagePanelShow, setAttackResolved } = stateObject

    console.log("(HUMAN) MIDWAY DAMAGE RESOLUTION DO ACTION")
    GlobalGameState.dieRolls = []
    setAttackResolutionPanelShow(false)
    setDamageDone(false)
    setMidwayDamagePanelShow(true)
    setAttackResolved(false)
  }

  async nextState(stateObject) {
    const { capAirUnits, setAirUnitUpdate } = stateObject
    console.log("NEXT STATE AFTER human MIDWAY DAMAGE RESOLUTION")
    await endOfAirOperation(capAirUnits, setAirUnitUpdate)
    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.US)

    console.log("\t\t=>NUM US CAP UNITS RETURNING=", capUnitsReturning.length)
    if (capUnitsReturning.length > 0) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      console.log("SET STATE TO US CAP RETURN")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_RETURN
      GlobalGameState.updateGlobalState()
    } else {
      midwayOrAirOps()
    }
  }

  getState() {
    return GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION
  }
}

export default JapanHumanMidwayDamageResolutionState
