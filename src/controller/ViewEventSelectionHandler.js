import GlobalGameState from "../model/GlobalGameState"
import SelectTargetCommand from "../commands/SelectTargetCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE";
import SelectCapDamageCommand from "../commands/SelectCapDamageCommand";

class ViewEventSelectionHandler {
  constructor(controller) {
    this.controller = controller
  }

  handleSelectTargetEvent(event) {
    const { target, side } = event.data

    let command = new SelectTargetCommand(COMMAND_TYPE.SELECT_TARGET, target, side)

    GlobalGameState.log(`${command.toString()}`)
  }

  handleDamageEvent(event) {
    const { eliminatedSteps, side } = event.data

    let command = new SelectCapDamageCommand(COMMAND_TYPE.ALLOCATE_DAMAGE, side, eliminatedSteps)

    GlobalGameState.log(`${command.toString()}`)
  }
}

export default ViewEventSelectionHandler
