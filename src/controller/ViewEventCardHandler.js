import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "../commands/COMMAND_TYPE";
import CardCommand from "../commands/CardCommand";


class ViewEventCardHandler {
  constructor(controller) {
    this.controller = controller
  }

  handleCardEvent(event) {
    const { number, title, side } = event.data

    let command = new CardCommand(COMMAND_TYPE.PLAY_EVENT_CARD, number, title, side)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventCardHandler
