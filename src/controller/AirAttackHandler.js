// this should be a state (box) flow model

import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

export function setUpAirAttack(controller, location, strikeGroup) {
  // create a separate function for attacks on DMCV
  const side = GlobalGameState.sideWithInitiative
  const fleets = controller.getAllFleetsInLocation(location, side, true)

  // @TODO QUACK
  // There can never be two fleets in same location during air operations
  // this can be taken out in due course
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
