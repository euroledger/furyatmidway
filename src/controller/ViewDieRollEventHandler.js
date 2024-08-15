import GlobalGameState from "../model/GlobalGameState";
import DiceCommand from "../commands/DiceCommand";

class ViewDieRollEventHandler {
  constructor(controller) {
    this.controller = controller;
  }
  handleEvent(event) {
    // event contains type and data
    const { jpRolls, usRolls, } = event.data

    let command = new DiceCommand(event.type, jpRolls, usRolls)
  
    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewDieRollEventHandler;
