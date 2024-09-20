import GlobalGameState from "../model/GlobalGameState"
import SelectTargetCommand from "../commands/SelectTargetCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE";


class ViewEventSelectionHandler {
  constructor(controller) {
    this.controller = controller
  }

  handleBowDamageEvent(event) {
    const { side, carrier } = event.data

    let command = new SelectTargetCommand(COMMAND_TYPE.SELECT_TARGET, target, side)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventSelectionHandler
