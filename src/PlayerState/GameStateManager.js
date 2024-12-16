import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import JapanAIStateHandler from "./Japan/ai/JapanAIStateHandler"
import JapanHumanStateHandler from "./Japan/human/JapanHumanStateHandler"
import USAIStateHandler from "./US/ai/USAIStateHandler"
import USHumanStateHandler from "./US/human/USHumanStateHandler"
import mapGameStateToUSHumanHandlerState from "./US/human/USHumanStateFactory"
import mapGameStateToUSAIHandlerState from "./US/ai/USAIStateFactory"
import mapGameStateToJapanHumanHandlerState from "./Japan/human/JapanHumanStateFactory"
import mapGameStateToJapanAIHandlerState from "./Japan/ai/JapanAIStateFactory"

class GameStateManager {

  setPlayerStates(japanPlayerType, usPlayerType) {
    console.log("SET US PLAYER TYPE TO", usPlayerType)
    this.japanPlayerType = japanPlayerType
    this.usPlayerType = usPlayerType
  }

  setJapanState(stateObject) {
    this.stateObject = stateObject
    console.log("NANNY POOP 2 stateObject=", this.stateObject)
    let state
    console.log("MAP game state:", GlobalGameState.gamePhase)
    if (this.japanPlayerType === GlobalUnitsModel.TYPE.AI) {
        state = mapGameStateToJapanAIHandlerState()
    } else {
        state = mapGameStateToJapanHumanHandlerState()
    }
    console.log("+++++ NEW Japan STATE OBJECT->", state)

    if (state) {
      this.japanStateHandler.setState(state)
    }
  }

  setUSState(stateObject) {
    this.stateObject = stateObject

    let state
    if (this.usPlayerType === GlobalUnitsModel.TYPE.AI) {
        state = mapGameStateToUSAIHandlerState()
    } else {
        state = mapGameStateToUSHumanHandlerState()
    }
    console.log("+++++ NEW US STATE OBJECT->", state)
    if (state) {
      this.usStateHandler.setState(state)
    }
  }

  setStateHandlers(stateObject) {
    // Japan Handlers and Current State
    console.log("BAD JAPAN set stateObject to", stateObject)
    this.stateObject = stateObject
    if (this.japanPlayerType == GlobalUnitsModel.TYPE.AI) {
      this.japanStateHandler = new JapanAIStateHandler(stateObject)
    } else {
      this.japanStateHandler = new JapanHumanStateHandler(stateObject)
    }
    console.log("WOOF 99")

    this.setJapanState()

    // US Handlers and Current State
    if (this.usPlayerType == GlobalUnitsModel.TYPE.AI) {
      this.usStateHandler = new USAIStateHandler(stateObject)
    } else {
      this.usStateHandler = new USHumanStateHandler(stateObject)
    }
    this.setUSState()
  }

  actionComplete(side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return this.japanStateHandler.isActionComplete()
    } else {
      return this.usStateHandler.isActionComplete()
    }
  }

  async doAction(side, stateObject) {
    this.stateObject = stateObject
    if (side === GlobalUnitsModel.Side.JAPAN) {
      console.log("++++ doAction firing +++ this.stateObject=", this.stateObject)
      await this.japanStateHandler.doAction(this.stateObject)
    } else {
      await this.usStateHandler.doAction(this.stateObject)
    }
  }

  async doNextState(side) {
    console.log("NEXT STATE FOR SIDE", side)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      await this.japanStateHandler.doNextState()
      await this.japanStateHandler.finishStateChange()
    } else {
      await this.usStateHandler.doNextState()
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
