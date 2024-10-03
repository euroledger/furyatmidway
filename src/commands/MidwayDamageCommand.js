import Command from "./Command"

class MidwayDamageCommand extends Command {
  constructor(commandType, damage) {
    super(commandType)
    this.damage = damage
  }
  execute() {}

  toString() {
    return `${this.commandType} - ${this.damage}`
  }
}

export default MidwayDamageCommand
