import GlobalGameState from "../model/GlobalGameState";
import COMMAND_TYPE from "../commands/COMMAND_TYPE";
import HexCommand from "../commands/HexCommand";

class ViewEventFleetUnitSetupHandler {
  constructor(controller) {
    this.controller = controller;
  }
  handleEvent(event) {
    // event contains type and data
    const { initial, id, from, to, side } = event.data

    // to = currentHex
    // add fleet unit to map holding name -> current Hex

    this.controller.setFleetUnitLocation(id, to, side)

    let cmdType = COMMAND_TYPE.MOVE_FLEET_UNIT
    if (initial) {
      cmdType = COMMAND_TYPE.PLACE
    }
    let command = new HexCommand(cmdType, id, from, to, side)
    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventFleetUnitSetupHandler;
