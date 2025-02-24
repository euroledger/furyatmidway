import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { delay } from "../../../Utils"
import { endOfAirOperation } from "../../StateUtils"
import { removeDMCVFleetForCarrier } from "../../StateUtils"


class USAIAttackDamageResolutionState {
  async doAction(stateObject) {
    console.log("++++++++++++++ US Attack Damage Resolution")

    if (GlobalGameState.carrierAttackHits === 1) {
      // roll one die
      await delay(100)
      GlobalGameState.rollDice = false
      GlobalGameState.updateGlobalState()

      await delay(300)
      GlobalGameState.rollDice = true
      GlobalGameState.updateGlobalState()
      await delay(300)
    }
  }

  async nextState(stateObject) {
    const { capAirUnits,  setAirUnitUpdate, setEliminatedUnitsPanelShow, setFleetUnitUpdate } = stateObject
    console.log("MOVE ON FROM US AI ATTACK DAMGE RESOLUTION")

    // check for card 13 critical hit
    const carrierName = GlobalGameState.currentCarrierAttackTarget
    const carrier = GlobalInit.controller.getCarrier(carrierName)

    // if carrier is in DMCV fleet and sunk - remove DMCV fleets from map
    if (
      GlobalGameState.carrierAttackHitsThisAttack > 0 &&
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
      GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.JAPAN_DMCV &&
      GlobalInit.controller.getDamagedCarriersOneOrTwoHits().length > 0 &&
      GlobalInit.controller.usHandContainsCard(13)
    ) {
      setCardNumber(() => 13)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    } else {
      if (carrier.dmcv && GlobalInit.controller.isSunk(carrierName)) {
        await removeDMCVFleetForCarrier(GlobalUnitsModel.Side.JAPAN, setFleetUnitUpdate)
        await delay(1)
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
        await endOfAirOperation(
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
      }
    }
  }

  getState() {
    return GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
  }
}

export default USAIAttackDamageResolutionState
