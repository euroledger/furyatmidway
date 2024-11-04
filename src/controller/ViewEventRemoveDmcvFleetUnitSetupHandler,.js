import GlobalGameState from "../model/GlobalGameState";
import COMMAND_TYPE from "../commands/COMMAND_TYPE";
import HexCommand from "../commands/HexCommand";

class ViewEventRemoveDMCVFleetUnitSetupHandler {
  constructor(controller) {
    this.controller = controller;
  }
  handleEvent(event) {
    // event contains type and data
    const { id, side } = event.data

    // to = currentHex
    // add fleet unit to map holding name -> current Hex

    const to = HexCommand.OFFBOARD
    this.controller.setFleetUnitLocation(id, HexCommand.OFFBOARD, side)

    let cmdType = COMMAND_TYPE.MOVE_FLEET_UNIT
  
    let command = new HexCommand(cmdType, id, null, to, side)
    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventRemoveDMCVFleetUnitSetupHandler;
