import Command from "./Command"

class SelectTargetCommand extends Command {
  constructor(commandType, target, side) {
    super(commandType)
    this.side = side
    this.target=target
  }
  execute() {}

  toString() {
    return `${this.commandType} ${this.side} selects air attack target: ${this.target}`
  }
}

export default SelectTargetCommand
