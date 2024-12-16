import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"

export function selectLossesFromCAPAction(controller, stateObject) {
  let numStrikeUnits = GlobalInit.controller.getAttackingStrikeUnits()
  // AI DECISION, which units to take losses from
  let hitsToAllocate = GlobalGameState.capHits

  // Factors to take into account (for Midway attack)
  // 1. If any fighters, take from those first
  // 2. Take one loss from 2-step units before taking any from 1-step attackers
  // 3. Random Factor
}
