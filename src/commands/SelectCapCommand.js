import Command from "./Command"

class SelectCapCommand extends Command {
  constructor(commandType, side, capUnits) {
    super(commandType)
    this.side = side
    this.capUnits = capUnits
  }
  execute() {}

  toString() {
    let capIds = ""

    if (this.capUnits.length > 0) {
        for (let unit of this.capUnits) {
            capIds = capIds + unit.name + " "
        }
    } else { 
        capIds = "No CAP Units Selected"
    }
    return `${this.commandType} ${this.side} selected CAP Units: ${capIds}`
  }
}

export default SelectCapCommand
