import BaseUnit from "./BaseUnit"
export default class AirUnit extends BaseUnit {
  constructor(name, longName, position, offsets, image, width, carrier, side) {
    super(name, longName, position, offsets, image, width)
    this.carrier = carrier
    this.side = side
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
}
