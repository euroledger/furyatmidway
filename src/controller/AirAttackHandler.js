// this should be a state (box) flow model

import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

export function setUpAirAttack(controller, location, strikeGroup) {
  // @TODO if this is an attack on a DMCV skip to FLEET_TARGET_SELECTION
  // (new state). In that state, there will be a screen for multiple fleets
  // in the same location.

  // if not multiple fleets in the same location, skip to AAA fire.

  // create a separate function for attacks on DMCV
  const side = GlobalGameState.sideWithInitiative
  const fleets = controller.getAllFleetsInLocation(location, side, true)
  if (fleets.length >= 2) {
    if (controller.japanHandContainsCard(11)) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      setCardNumber(() => 11)
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.FLEET_TARGET_SELECTION
    }
  } else {
    controller.setAirOpAttacked(strikeGroup)

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      if (controller.japanHandContainsCard(9)) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        setCardNumber(() => 9)
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      }
      GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.MIDWAY
    } else {
      if (controller.japanHandContainsCard(11)) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        setCardNumber(() => 11)
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.TARGET_DETERMINATION
      }
    }
  }
  controller.resetTargetMap()
  GlobalGameState.carrierTarget1 = ""
  GlobalGameState.carrierTarget2 = ""
  strikeGroup.attacked = true
  GlobalGameState.attackingStrikeGroup = strikeGroup
}
