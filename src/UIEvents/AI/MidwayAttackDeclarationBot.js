import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"

function midwayAttackDecision(controller) {
  
  // AI DECISION, whether to attack Midway

    if (GlobalGameState.gameTurn === 1) {
        GlobalGameState.midwayAttackDeclaration = false
    }
  // Factors to take into account (for Midway attack)
  // 1. Game turn (NEVER on turn1)
  // 2. IJN Strategy
  // 3. Remaining US CVs
  // 4. Random Factor
}

export default midwayAttackDecision
