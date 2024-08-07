import COMMAND_TYPE from "./COMMAND_TYPE"
import Command from "./Command"

class DiceCommand extends Command {
  constructor(eventType, jpRolls, usRolls) {
    super(COMMAND_TYPE.DIE_ROLLS, null, null, null, null)

    this.jpRolls = jpRolls
    this.usRolls = usRolls
    this.eventType = eventType
  }

  set jpRolls(jp) {
    this._jpRolls = jp
  }
  get jpRolls() {
    return this._jpRolls
  }

  set usRolls(us) {
    this._usRolls = us
  }
  get usRolls() {
    return this._usRolls
  }

  execute() {}

  toString() {
    return `${this.commandType} ${this.eventType} Japan Rolls:  ${this.jpRolls} US Rolls: ${this.usRolls}`
  }
}

export default DiceCommand
