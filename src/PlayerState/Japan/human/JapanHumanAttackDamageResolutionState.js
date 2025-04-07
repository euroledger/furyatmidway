import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { endOfAirOperation } from "../../StateUtils"
import { removeDMCVFleetForCarrier } from "../../StateUtils"

class JapanHumanAttackDamageResolutionState {
  async doAction(stateObject) {
    console.log("++++++++++++++ JAPAN Attack Damage Resolution")
  }

  async nextState(stateObject) {
    const { capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow, setFleetUnitUpdate } = stateObject
    console.log("MOVE ON FROM JAPAN ATTACK DAMGE RESOLUTION")

    // check for card 13 critical hit
    const carrierName = GlobalGameState.currentCarrierAttackTarget
    const carrier = GlobalInit.controller.getCarrier(carrierName)

    // if carrier is in DMCV fleet and sunk - remove DMCV fleets from map

    if (carrier.dmcv && GlobalInit.controller.isSunk(carrierName)) {
      await removeDMCVFleetForCarrier(GlobalUnitsModel.Side.US, setFleetUnitUpdate)
      carrier.dmcv = false
      if (sideBeingAttacked === GlobalUnitsModel.Side.US) {
        GlobalGameState.usDMCVCarrier = undefined
      } else {
        GlobalGameState.jpDMCVCarrier = undefined
      }
      setFleetUnitUpdate({
        name: "",
        position: {},
      }) // reset to avoid updates causing problems for other markers
    }
    if (GlobalGameState.carrierTarget2 !== "" && GlobalGameState.carrierTarget2 !== undefined) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_2
    } else {
      await endOfAirOperation(capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow)
      const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.US)

      console.log("\t\t=>NUM US CAP UNITS RETURNING=", capUnitsReturning.length)
      if (capUnitsReturning.length > 0) {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_RETURN
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
  }
}

export default JapanHumanAttackDamageResolutionState
