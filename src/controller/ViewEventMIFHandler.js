import GlobalGameState from "../model/GlobalGameState"
import MIFHitsCommand from "../commands/SelectCapCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE";


class ViewEventMIFHandler {
  constructor(controller) {
    this.controller = controller
  }

  handleMIFDamageEvent(event) {
    const { side, hits } = event.data

   
    const mif = GlobalGameState.midwayInvasionLevel
    let command = new MIFHitsCommand(COMMAND_TYPE.MIF_DAMAGE, side, hits)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventMIFHandler
