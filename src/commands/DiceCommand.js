import { faCarSide } from "@fortawesome/free-solid-svg-icons"
import COMMAND_TYPE from "./COMMAND_TYPE"
import Command from "./Command"

class DiceCommand extends Command {
  constructor(eventType, jpRolls, usRolls, theRoll, side) {
    super(COMMAND_TYPE.DIE_ROLLS, null, null, null, null)

    this.jpRolls = jpRolls
    this.usRolls = usRolls
    this.theRoll = theRoll
    this.side = side
    this.eventType = eventType
  }

  set jpRolls(jp) {
    this._jpRolls = jp
  }
  get jpRolls() {
    return this._jpRolls
  }
  set theRoll(tr) {
    this._theRoll = tr
  }
  get theRoll() {
    return this._theRoll
  }
  set side(s) {
    this._side = s
  }
  get side() {
    return this._side
  }
  set usRolls(us) {
    this._usRolls = us
  }
  get usRolls() {
    return this._usRolls
  }

  execute() {}
  toString() {
    if (this.theRoll) {
      return `${this.commandType} ${this.eventType} ${this.side} Die Roll:  ${this.theRoll}`    
    } 
    return `${this.commandType} ${this.eventType} Japan Rolls:  ${this.jpRolls} US Rolls: ${this.usRolls}`
  }
}

export default DiceCommand
