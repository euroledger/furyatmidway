import Command from "./Command"

class SelectCapDamageCommand extends Command {
  constructor(commandType, side, eliminatedSteps) {
    super(commandType)
    this.side = side
    this.eliminatedSteps = eliminatedSteps
  }
  execute() {}

  toString() {
   
    return `${this.commandType} ${this.side} Eliminated Steps: ${this.eliminatedSteps}`
  }
}

export default SelectCapDamageCommand
