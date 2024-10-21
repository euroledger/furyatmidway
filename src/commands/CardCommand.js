import Command from "./Command"

class CardCommand extends Command {
  constructor(commandType, cardNumber, title, side) {
    super(commandType)
    this.cardNumber = cardNumber
    this.title = title
    this.side = side
  }
  execute() {}

  toString() {
    return `${this.commandType} ${this.side} Plays Card#${this.cardNumber} - ${this.title}`
  }
}

export default CardCommand
