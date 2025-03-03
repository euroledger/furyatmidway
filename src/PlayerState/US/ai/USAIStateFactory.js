import GlobalGameState from "../../../model/GlobalGameState"
import USAISetupAirState from "./USAISetupAirState"
import USAICardDrawState from "./USAICardDrawState"
import USAIFleetMovementPlanningState from "./USAIFleetMovementPlanningState"
import USAIFleetMovementState from "./USAIFleetMovementState"
import USAICardPlayState from "./USAICardPlayState"
import USAIAirOperationsState from "./USAIAirOperationsState"
import USAITargetDeterminationState from "./USAITargetDeterminationState"
import USAICapDamageAllocationState from "./USAICapDamageAllocationState"
import USAIEscortCounterattackState from "./USAIEscortCounterattackState"
import USAIAAADamageAllocationState from "./USAIAAADamageAllocationState"
import USAIAttackTargetSelectionState from "./USAIAttackTargetSelectionState"
import USAIAirAttack1State from "./USAIAirAttack1State"
import USAIAirAttack2State from "./USAIAirAttack2State"
import USAIAirSearchState from "./USAIAirSearchState"
import USAIAttackDamageResolutionState from "./USAIAttackDamageResolutionState"
import USAICardResponseState from "./USAICardResponseState"

function mapGameStateToUSAIHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.US_SETUP_AIR:
      return new USAISetupAirState()
    case GlobalGameState.PHASE.US_CARD_DRAW:
      return new USAICardDrawState()
    case GlobalGameState.PHASE.CARD_PLAY:
      return new USAICardPlayState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
      return new USAIFleetMovementPlanningState()
    case GlobalGameState.PHASE.US_FLEET_MOVEMENT:
      return new USAIFleetMovementState()
    case GlobalGameState.PHASE.AIR_OPERATIONS:
      return new USAIAirOperationsState()
    case GlobalGameState.PHASE.AIR_SEARCH:
      return new USAIAirSearchState()
    case GlobalGameState.PHASE.TARGET_DETERMINATION:
      return new USAITargetDeterminationState()
    case GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION:
      return new USAICapDamageAllocationState()
    case GlobalGameState.PHASE.ESCORT_COUNTERATTACK:
      return new USAIEscortCounterattackState()
    case GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION:
      return new USAIAAADamageAllocationState()
    case GlobalGameState.PHASE.ATTACK_TARGET_SELECTION:
      return new USAIAttackTargetSelectionState()
    case GlobalGameState.PHASE.AIR_ATTACK_1:
      return new USAIAirAttack1State()
    case GlobalGameState.PHASE.AIR_ATTACK_2:
      return new USAIAirAttack2State()
    case GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION:
      return new USAIAttackDamageResolutionState()
    case GlobalGameState.PHASE.CARD_RESPONSE:
      return new USAICardResponseState()

    default:
      console.log("ERROR unexpected game state", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToUSAIHandlerState
