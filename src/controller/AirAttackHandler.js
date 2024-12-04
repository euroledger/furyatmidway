// this should be a state (box) flow model

import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

// QUACK @TODO this function needs to be moved because it is called
// from strike counter drop handler and contains global game state logic

// possible solution:

// call nextAction here and let the GameStateHandler do all this stuff
// better still, get rid of this function and call nextAction from strikecounter drop handler
export function setUpAirAttack(controller, location, strikeGroup, setCardNumber) {
  // create a separate function for attacks on DMCV

  const side = GlobalGameState.sideWithInitiative
  const locationOfStrikeGroup = controller.getStrikeGroupLocation(strikeGroup.name, side)

  const fleets = controller.getAllFleetsInLocation(locationOfStrikeGroup, side, false)

  let fleetTarget
  if (fleets.length === 0) {
    fleetTarget = GlobalUnitsModel.TaskForce.MIDWAY
  } else {
    fleetTarget = fleets[0].name
  }
  controller.setAirOpAttacked(strikeGroup)

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
    // if (controller.japanHandContainsCard(9) && GlobalGameState.gamePhase !== GlobalGameState.PHASE.CARD_PLAY) {
    //   GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    //   setCardNumber(() => 9)
    // } else {
      if (controller.japanHandContainsCard(12)) {
        setCardNumber(() => 12)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      }
    // }
    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.MIDWAY
  } else {
    if (
      controller.japanHandContainsCard(11) &&
      side === GlobalUnitsModel.Side.US && // card 11 only valid for US Strikes
      GlobalGameState.gamePhase !== GlobalGameState.PHASE.CARD_PLAY
    ) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      setCardNumber(() => 11)
    } else {
      if (fleetTarget.includes("DMCV") || fleetTarget.includes("MIF")) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        if (fleetTarget.includes("IJN-DMCV")) {
          GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.JAPAN_DMCV
        } else if (fleetTarget.includes("US-DMCV")) {
          GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.US_DMCV
        } else if (fleetTarget.includes("MIF")) {
          GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.MIF
        }
      } else {
        // may have no targets (all enemy carriers sunk/DMCV)
        const sideBeingAttacked =
          GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
            ? GlobalUnitsModel.Side.JAPAN
            : GlobalUnitsModel.Side.US
        let anyTargets = controller.anyTargets(sideBeingAttacked)
        if (anyTargets) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.TARGET_DETERMINATION
        } else {
          strikeGroup.attacked = true
          return
        }
      }
    }
  }

  controller.resetTargetMap()
  GlobalGameState.carrierTarget1 = ""
  GlobalGameState.carrierTarget2 = ""
  strikeGroup.attacked = true
  GlobalGameState.attackingStrikeGroup = strikeGroup
}
