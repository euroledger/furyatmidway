import BaseUnit from "./BaseUnit"
export default class StrikeGroupUnit extends BaseUnit {
    constructor(name, longName, position, image, width, location, box, side, offsets, moved, attacked) {
    super(name, longName, position, offsets, image, width)
    this.box = box
    this.location = location
    this.side = side
    this.moved = moved
    this.attacked = attacked
    this.airOpMoved = undefined
    this.airOpAttacked = undefined
  }

  set box(b) {
    this._box = b
  }

  get box() {
    return this._box
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
  
  set attacked(a) {
    this._attacked = a
  }

  get attacked() {
    return this._attacked
  }

  set airOpMoved(tm) {
    this._airOpMoved = tm
  }

  get airOpMoved() {
    return this._airOpMoved
  }
  
  set airOpAttacked(ta) {
    this._airOpAttacked = ta
  }

  get airOpAttacked() {
    return this._airOpAttacked
  }
}
