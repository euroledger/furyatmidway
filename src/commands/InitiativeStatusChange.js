import Command from "./Command"

class InitiativeStatusChange extends Command {
  constructor(commandType, initiative) {
    super(commandType)
    this.initiative = initiative
  }
  execute() {}


  toString() {
    if (this.initiative === null) {
      this.initiative = "TIE - ReRoll"
    }

    return `${this.commandType} Side With Initiative: ${this.initiative}`
  }
}

export default InitiativeStatusChange
