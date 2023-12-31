import COMMAND_TYPE from "./COMMAND_TYPE";
import Command from "./Command";

class HexCommand extends Command {
  execute() {}

  toString() {
    console.log(JSON.stringify(this.to));
    let from = "OFFBOARD";
    if (this.commandType != COMMAND_TYPE.PLACE) {
      from = `${this.from.currentHex.row}-${this.from.currentHex.col}`;
    }
    return `${this.commandType} ${this.unit} from ${from} to ${this.to.currentHex.row}-${this.to.currentHex.col}`;
  }
}

export default HexCommand;
