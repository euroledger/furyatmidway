import BaseUnit from "./BaseUnit"
export default class StrikeGroupUnit extends BaseUnit {
    constructor(name, longName, position, image, width, units, location, side, offsets, moved) {
    super(name, longName, position, offsets, image, width)
    this.units = units
    this.location = location
    this.side = side
    this.moved = moved
  }

  set units(u) {
    this._units = u
  }

  get units() {
    return this._units
  }

  set location(l) {
    this._location = l
  }

  get location() {
    return this._location
  }

  set side(s) {
    this._side = s
  }

  get side() {
    return this._side
  }

  set moved(m) {
    this._moved = m
  }

  get moved() {
    return this._moved
  }
}
