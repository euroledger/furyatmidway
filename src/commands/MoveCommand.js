import COMMAND_TYPE from "./COMMAND_TYPE";
import Command from "./Command";

class MoveCommand extends Command {
  execute() {}

  toString() {
    return `${this.commandType} ${this.unit} from ${this.from} to ${this.to}`;
  }
}

export default MoveCommand;
