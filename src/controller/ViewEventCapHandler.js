import GlobalGameState from "../model/GlobalGameState"
import SelectCapCommand from "../commands/SelectCapCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE";


class ViewEventCapHandler {
  constructor(controller) {
    this.controller = controller
  }

  handleCapSelectionEvent(event) {
    const { side, capUnits } = event.data

    let command = new SelectCapCommand(COMMAND_TYPE.SELECT_CAP_UNITS, side, capUnits)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventCapHandler
