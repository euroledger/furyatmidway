import Command from "./Command"

class TargetStatusChange extends Command {
  constructor(commandType, side, target) {
    super(commandType)
    this.side = side
    this.target = target
  }
  execute() {}

  toString() {
    return `${this.commandType} ${this.side} actual target for strike: ${this.target}`
  }
}

export default TargetStatusChange
