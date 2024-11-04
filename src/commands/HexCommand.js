import COMMAND_TYPE from "./COMMAND_TYPE";
import Command from "./Command";

class HexCommand extends Command {
  execute() {}

  toString() {
    if (this.to === HexCommand.OFFBOARD) {
      return `MOVE ${this.side} ${this.unit} to OFFBOARD`;
    } else {
      let from = "OFFBOARD";
      if (this.commandType != COMMAND_TYPE.PLACE) {
        from = `${this.from.currentHex.row}-${this.from.currentHex.col}`;
      }
      return `MOVE ${this.side} ${this.unit} from ${from} to ${this.to.currentHex.row}-${this.to.currentHex.col}`;
    }
  }
}

export default HexCommand;
