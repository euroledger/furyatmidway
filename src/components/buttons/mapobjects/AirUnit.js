import BaseUnit from "./BaseUnit"
export default class AirUnit extends BaseUnit {
  constructor(name, longName, position, offsets, image, width, carrier, side, aircraftUnit) {
    super(name, longName, position, offsets, image, width)
    this.carrier = carrier
    this.side = side
    this.aircraftUnit = aircraftUnit
  }

  set carrier(c) {
    this._carrier = c
  }

  get carrier() {
    return this._carrier
  }

  set side(s) {
    this._side = s
  }

  get side() {
    return this._side
  }

  set aircraftUnit(au) {
    this._aircraftUnit = au
  }

  get aircraftUnit() {
    return this._aircraftUnit
  }
}
