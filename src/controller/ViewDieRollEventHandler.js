import GlobalGameState from "../model/GlobalGameState"
import DiceCommand from "../commands/DiceCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import TargetStatusChange from "../commands/TargetStatusChange"
import InitiativeStatusChange from "../commands/InitiativeStatusChange"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import TrackStatusChange from "../commands/TrackStatusChange"

class ViewDieRollEventHandler {
  constructor(controller) {
    this.controller = controller
  }

  handlInitiativeDiceRollEvent(event) {
    // event contains type and data
    const { jpRolls, usRolls } = event.data

    let command = new DiceCommand(event.type, jpRolls, usRolls)

    GlobalGameState.log(`${command.toString()}`)

    command = new InitiativeStatusChange(COMMAND_TYPE.INITIATIVE_STATUS_CHANGE, GlobalGameState.sideWithInitiative)
    
    GlobalGameState.log(`${command.toString()}`)
  }

  handlStatusChangeEvent(event) {
    // event contains type and data
    const { track, level } = event.data

    const command = new TrackStatusChange(COMMAND_TYPE.TRACK_STATUS_CHANGE, track, level)
    
    GlobalGameState.log(`${command.toString()}`)
  }


  handleTargetSelectionDiceRollEvent(event) {
    // event contains type and data
    const { theRoll, target, side } = event.data

    let command = new DiceCommand(event.type, null, null, theRoll, side)

    GlobalGameState.log(`${command.toString()}`)

    command = new TargetStatusChange(COMMAND_TYPE.TARGET_STATUS_CHANGE, side, target)

    GlobalGameState.log(`${command.toString()}`)
  }

  handleCapInterceptionDiceRollEvent(event) {

    // event contains type and data
    const { rolls, side } = event.data


    let jpRolls = null
    let usRolls = null
    if (side === GlobalUnitsModel.Side.US) {
      usRolls = rolls
    } else {
      jpRolls = rolls
    }
    let command = new DiceCommand(event.type, jpRolls, usRolls, null, side, GlobalGameState.capHits)
    GlobalGameState.log(`${command.toString()}`)
  }
  
  handleAAADiceRollEvent(event) {
    // event contains type and data
    const { rolls, side, target } = event.data
    let jpRolls = null
    let usRolls = null
    if (side === GlobalUnitsModel.Side.US) {
      usRolls = rolls
    } else {
      jpRolls = rolls
    }
    let command = new DiceCommand(event.type, jpRolls, usRolls, null, side, GlobalGameState.antiaircraftHits, target)
    GlobalGameState.log(`${command.toString()}`)
  }

  handleAttackResolutionDiceRollEvent(event) {
    const { rolls, side, target, hits } = event.data
    let jpRolls = null
    let usRolls = null
    if (side === GlobalUnitsModel.Side.US) {
      usRolls = rolls
    } else {
      jpRolls = rolls
    }
    let command = new DiceCommand(event.type, jpRolls, usRolls, null, side, hits, target)
    GlobalGameState.log(`${command.toString()}`)
  }
  
  handleEscortCounterAttackDiceRollEvent(event) {

    // event contains type and data
    const { rolls, side } = event.data

    let jpRolls = null
    let usRolls = null
    if (side === GlobalUnitsModel.Side.US) {
      usRolls = rolls
    } else {
      jpRolls = rolls
    }
    let command = new DiceCommand(event.type, jpRolls, usRolls, null, side, GlobalGameState.fighterHits)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewDieRollEventHandler
