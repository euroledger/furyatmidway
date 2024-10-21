import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "./COMMAND_TYPE"
import Command from "./Command"

class EventCardDiceCommand extends Command {
  constructor(eventType, roll, side, message) {
    super(COMMAND_TYPE.DIE_ROLLS, null, null, null, null)
    this.eventType = eventType
    this.roll = roll
    this.side = side
    this.message = message
  }

  execute() {}
  toString() {
    return `${this.commandType} ${this.eventType} ${this.side} rolls ${this.roll} - ${this.message}`
  }
}

export default EventCardDiceCommand
