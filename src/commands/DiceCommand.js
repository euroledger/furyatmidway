import { faCarSide } from "@fortawesome/free-solid-svg-icons"
import COMMAND_TYPE from "./COMMAND_TYPE"
import Command from "./Command"

class DiceCommand extends Command {
  constructor(eventType, jpRolls, usRolls, theRoll, side, hits, target) {
    super(COMMAND_TYPE.DIE_ROLLS, null, null, null, null)

    this.jpRolls = jpRolls
    this.usRolls = usRolls
    this.theRoll = theRoll
    this.side = side
    this.eventType = eventType
    this.hits = hits
    this.target = target
  }

  set target(t) {
    this._target = t
  }
  get target() {
    return this._target
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

  set hits(h) {
    this._hits = h
  }
  get hits() {
    return this._hits
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
    let hitsStr = this.hits === null || this.hits === undefined ? "": `Hits: ${this.hits}`
    let jpString = ""
    let usString = ""
    let targetStr = this.target === null || this.target === undefined ? "" : `Target: ${this.target}`
    if (this.jpRolls !== null) {
      jpString = `Japan Rolls:  ${this.jpRolls}`
    }
    if (this.usRolls !== null) {
      usString = `US Rolls:  ${this.usRolls}`
    }
    if (this.theRoll) {
      return `${this.commandType} ${this.eventType} ${this.side} Die Roll:  ${this.theRoll} ${hitsStr}`    
    } 
    return `${this.commandType} ${this.eventType} ${targetStr} ${jpString} ${usString} ${hitsStr}`
  }
}

export default DiceCommand
