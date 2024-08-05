import BaseUnit from "./BaseUnit"
export default class StrikeGroupUnit extends BaseUnit {
    constructor(name, longName, position, image, width, units) {
    super(name, longName, position, null, image, width)
    this.units = units
  }

  set units(u) {
    this._units = u
  }

  get units() {
    return this._units
  }
}
