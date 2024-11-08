import Command from "./Command"

class AssignDMCVCarrierCommand extends Command {
  constructor(commandType, side, carrier) {
    super(commandType)
    this.side = side
    this.carrier = carrier
  }
  execute() {}

  toString() {

    return `${this.commandType} ${this.side} assigns carrier to DMCV Fleet: ${this.carrier}`
  }
}

export default AssignDMCVCarrierCommand
