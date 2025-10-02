import GlobalGameState from "../../../model/GlobalGameState"
import JapanHumanSetupAirState from "./JapanHumanSetupAirState"
import JapanHumanMidwayDeclarationState from "./JapanHumanMidwayDeclarationState"
import JapanHumanCardPlayState from "./JapanHumanCardPlayState"
import JapanHumanCardDrawState from "./JapanHumanCardDrawState"
import JapanHumanFleetMovementState from "./JapanHumanFleetMovementState"
import JapanHumanEndOfAirOperationState from "./JapanHumanEndOfAirOperationState"
import JapanHumanCapInterceptionState from "./JapanHumanCapInterceptionState"
import JapanHumanAAAFireState from "./JapanHumanAAAFireState"
import JapanHumanEscortDamageAllocationState from "./JapanHumanEscortDamageAllocationState"
import JapanHumanAirOperationsState from "./JapanHumanAirOperationsState"
import JapanHumanCapReturnState from "./JapanHumanCapReturnState"
import JapanHumanTargetDeterminationState from "./JapanHumanTargetDeterminationState"
import JapanHumanCapDamageAllocationState from "./JapanHumanCapDamageAllocationState"
import JapanHumanEscortCounterattackState from "./JapanHumanEscortCounterattackState"
import JapanHumanAttackTargetSelectionState from "./JapanHumanAttackTargetSelectionState"
import JapanHumanAirAttack1State from "./JapanHumanAirAttack1State"
import JapanHumanAttackDamageResolutionState from "./JapanHumanAttackDamageResolutionState"
import JapanHumanAAADamageAllocationState from "./JapanHumanAAADamageAllocationState"
import JapanHumanEndOfTurnState from "./JapanHumanEndOfTurnState"
import JapanHumanDMCVFleetMovementState from "./JapanHumanDMCVFleetMovementState"
import JapanHumanNightBattleState from "./JapanHumanNightBattleState"
import JapanHumanNightAirOperationsState from "./JapanHumanNightAirOperationsState"

function mapGameStateToJapanHumanHandlerState() {
  switch (GlobalGameState.gamePhase) {
    case GlobalGameState.PHASE.JAPAN_SETUP:
      return new JapanHumanSetupAirState()
    case GlobalGameState.PHASE.JAPAN_CARD_DRAW:
      return new JapanHumanCardDrawState()
    case GlobalGameState.PHASE.JAPAN_MIDWAY:
      return new JapanHumanMidwayDeclarationState()
    case GlobalGameState.PHASE.CARD_PLAY:
      return new JapanHumanCardPlayState()
    case GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT:
      return new JapanHumanFleetMovementState()
    case GlobalGameState.PHASE.END_OF_AIR_OPERATION:
      return new JapanHumanEndOfAirOperationState()
    case GlobalGameState.PHASE.CAP_INTERCEPTION:
      return new JapanHumanCapInterceptionState()
    case GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE:
      return new JapanHumanAAAFireState()
    case GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION:
      return new JapanHumanEscortDamageAllocationState()
    case GlobalGameState.PHASE.AIR_OPERATIONS:
      return new JapanHumanAirOperationsState()
    case GlobalGameState.PHASE.CAP_RETURN:
      return new JapanHumanCapReturnState()
    case GlobalGameState.PHASE.TARGET_DETERMINATION:
      return new JapanHumanTargetDeterminationState()
    case GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION:
      return new JapanHumanCapDamageAllocationState()
    case GlobalGameState.PHASE.ESCORT_COUNTERATTACK:
      return new JapanHumanEscortCounterattackState()
    case GlobalGameState.PHASE.ATTACK_TARGET_SELECTION:
      return new JapanHumanAttackTargetSelectionState()
    case GlobalGameState.PHASE.AIR_ATTACK_1:
      return new JapanHumanAirAttack1State()
    case GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION:
      return new JapanHumanAttackDamageResolutionState()
    case GlobalGameState.PHASE.END_OF_TURN:
      return new JapanHumanEndOfTurnState()
    case GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION:
      return new JapanHumanAAADamageAllocationState()
    case GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT:
      return new JapanHumanDMCVFleetMovementState()
    case GlobalGameState.PHASE.NIGHT_BATTLES_1:
      return new JapanHumanNightBattleState()
    case GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN:
      return new JapanHumanNightAirOperationsState()

    default:
      console.log("+++++ ERRROR +++++ NO JAPAN HUMAN STATE FOUND FOR PHASE", GlobalGameState.gamePhase)
  }
}

export default mapGameStateToJapanHumanHandlerState
