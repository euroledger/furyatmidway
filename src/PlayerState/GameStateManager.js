import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import JapanAIStateHandler from "./Japan/JapanAIStateHandler"
import JapanHumanStateHandler from "./Japan/JapanHumanStateHandler"
import USAIStateHandler from "./US/USAIStateHandler"
import USHumanStateHandler from "./US/USHumanStateHandler"

class GameStateManager {
  constructor(japanPlayerType, usPlayerType) {
    this.japanPlayerType = japanPlayerType
    this.usPlayerType = usPlayerType
  }

  setStateHandlers(stateObject) {
    this.stateObject = stateObject
    if (this.japanPlayerType == GlobalUnitsModel.TYPE.AI) {
      this.japanStateHandler = new JapanAIStateHandler(stateObject)
    } else {
      this.japanStateHandler = new JapanHumanStateHandler(stateObject)
    }
    if (this.usPlayerType == GlobalUnitsModel.TYPE.AI) {
      this.usStateHandler = new USAIStateHandler(stateObject)
    } else {
      this.usStateHandler = new USHumanStateHandler(stateObject)
    }
  }

  actionComplete(side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return this.japanStateHandler.isActionComplete()
    } else {
      return this.usStateHandler.isActionComplete()
    }
  }

  async doAction(side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
        console.log("japanStateHandler=", this.japanStateHandler)
      await this.japanStateHandler.doAction(this.stateObject)
    } else {
      await this.usStateHandler.doAction(this.stateObject)
    }
  }

  async doNextState(side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      this.japanStateHandler.doNextState()
      this.japanStateHandler.finishStateChange()
    } else {
      this.usStateHandler.doNextState()
      await this.usStateHandler.finishStateChange()
    }
  }
  getPlayerType(side) {
    return side === GlobalUnitsModel.Side.JAPAN ? this.japanPlayerType : this.usPlayerType
  }

  getCurrentPlayer() {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      return GlobalUnitsModel.Side.JAPAN
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
      return GlobalUnitsModel.Side.JAPAN
    }
  }

  getState(player) {
    if (player === GlobalUnitsModel.Side.JAPAN) {
      return this.japanStateHandler.getState()
    } else {
      return this.usStateHandler.getState()
    }
  }
}

export default GameStateManager
