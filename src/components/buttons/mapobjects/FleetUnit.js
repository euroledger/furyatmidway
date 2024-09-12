import BaseUnit from "./BaseUnit"
export default class FleetUnit extends BaseUnit {
  constructor(name, taskForce, hits, side) {
    super(name)
    this.taskForce = taskForce
    this.hits = hits
    this.side = side
    this.bowDamaged = false
    this.sternDamaged = false
  }

  get isSunk() {
    return this._hits === 3
  }

  // @TODO add functions for bow and stern damage

  set hits(h) {
    this._hits = h

    // add function param bow or stern for flight deck damage
  }

  get bowDamaged() {
    return this._bowDamaged
  }

  get sternDamaged() {
    return this._sternDamaged
  }

  set bowDamaged(bd) {
    this._bowDamaged = bd
  }

  set sternDamaged(sd) {
    this._sternDamaged = sd
  }

  get hits() {
    return this._hits
  }

  set side(s) {
    this._side = s
  }

  get side() {
    return this._side
  }

  set taskForce(tf) {
    this._taskForce = tf
  }

  get taskForce() {
    return this._taskForce
  }
}
