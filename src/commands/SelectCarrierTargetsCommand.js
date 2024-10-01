import Command from "./Command"

class SelectCarrierTargetsCommand extends Command {
  constructor(commandType, side, carrier1, carrier1Attackers, carrier2, carrier2Attackers) {
    super(commandType)
    this.side = side
    this.carrier1 = carrier1
    this.carrier1Attackers = carrier1Attackers
    this.carrier2 = carrier2
    this.carrier2Attackers = carrier2Attackers
  }

  execute() {}

  toString() {
  
    const carrier1Str = `${this.carrier1}:`
    const carrier2Str = this.carrier2 === undefined || this.carrier2 === "" ? "" : `; ${this.carrier2}:`

    let c1Units = ""
    for (const unit of this.carrier1Attackers) {
        if (c1Units !== "") {
            c1Units = c1Units + ", "
        }
        c1Units = c1Units + unit.name +` (${unit.aircraftUnit.steps}) ` 
    }
    let c2Units = ""
    for (const unit of this.carrier2Attackers) {
        if (c2Units !== "") {
            c2Units = c2Units + ", "
        }
        c2Units = c2Units + unit.name +` (${unit.aircraftUnit.steps}) ` 
    }
    return `${this.commandType} (${this.side}) - ${carrier1Str} ${c1Units}${carrier2Str} ${c2Units}`
  }
}

export default SelectCarrierTargetsCommand
