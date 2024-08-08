import GlobalGameState from "../model/GlobalGameState";
import COMMAND_TYPE from "../commands/COMMAND_TYPE";
import HexCommand from "../commands/HexCommand";

class ViewStrikeGroupMoveHandler {
  constructor(controller) {
    this.controller = controller
  }
  handleEvent(event) {
    const { initial, counterData, from, to, side, loading } = event.data

    // to = currentHex

    // add strike group to map holding name -> current Hex

    this.controller.setStrikeGroupLocation(counterData.name, to, side)

    let cmdType = COMMAND_TYPE.MOVE
    if (initial) {
      cmdType = COMMAND_TYPE.PLACE
    }
    let command = new HexCommand(cmdType, counterData.longName, from, to, side)
   

    GlobalGameState.log(`Command: ${command.toString()}`)

    if (!loading) {
      counterData.moved = true
    }

    // check if all stike groups moved - can that be done here?
    GlobalGameState.phaseCompleted = true

  }
}
export default ViewStrikeGroupMoveHandler
