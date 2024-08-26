import Command from "./Command"

class InitiativeStatusChange extends Command {
  constructor(commandType, initiative) {
    super(commandType)
    this.initiative = initiative
  }
  execute() {}

  toString() {
    return `${this.commandType} Side With Initiative: ${this.initiative}`
  }
}

export default InitiativeStatusChange
