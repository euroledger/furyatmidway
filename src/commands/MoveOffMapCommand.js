import Command from "./Command"
import HexCommand from "./HexCommand"

class MoveOffMapCommand extends Command {
  constructor(commandType, side, unit, box) {
    super(commandType)
    this.side = side
    this.unit = unit
    this.box = box
  }

  execute() {}

  toString() {
    return `MOVE ${this.side} ${this.unit} to OFF MAP FLEET BOX boxIndex ${this.box}`
  }
}

export default MoveOffMapCommand
