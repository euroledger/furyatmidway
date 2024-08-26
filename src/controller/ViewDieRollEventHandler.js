import GlobalGameState from "../model/GlobalGameState"
import DiceCommand from "../commands/DiceCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import TargetStatusChange from "../commands/TargetStatusChange"
import InitiativeStatusChange from "../commands/InitiativeStatusChange"

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

  handleTargetSelectionDiceRollEvent(event) {
    // event contains type and data
    const { theRoll, target, side } = event.data


    let command = new DiceCommand(event.type, null, null, theRoll, side)

    GlobalGameState.log(`${command.toString()}`)

    command = new TargetStatusChange(COMMAND_TYPE.TARGET_STATUS_CHANGE, side, target)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewDieRollEventHandler
