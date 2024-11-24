import COMMAND_TYPE from "./COMMAND_TYPE";

class Command {
  static OFFBOARD = "OFFBOARD"
  static FLEET_BOX = "OFFMAP FLEET BOX"
  
  constructor(commandType, unit, from, to, side) {
    this.commandType = commandType;
    this.unit = unit;
    this.from = from;
    this.to = to;
    this.side = side
  }
  set commandType(ct) {
    this._commandType = ct;
  }
  get commandType() {
    return this._commandType;
  }
  set to(to) {
    this._to = to;
  }
  get to() {
    return this._to;
  }
  set from(from) {
    this._from = from;
  }
  get from() {
    return this._from;
  }

  set side(s) {
    this._side = s
  }
  get side() {
    return this._side
  }

  set unit(u) {
    this._unit = u;
  }
  get unit() {
    return this._unit;
  }


  execute() {}

  toString() {
    return `${this.commandType} ${unit} from ${this.from} to ${this.to}`
  }
}

export default Command;
