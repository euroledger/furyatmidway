import GameStateManager from '../PlayerState/GameStateManager';
import GlobalGameState from './GlobalGameState';

export default class StateManager {
  static gameStateManager = new GameStateManager(GlobalGameState.jpPlayerType, GlobalGameState.usPlayerType)
}
