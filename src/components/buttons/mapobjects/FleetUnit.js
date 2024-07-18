import BaseUnit from "./BaseUnit"
export default class FleetUnit extends BaseUnit {
  constructor(name, taskForce, hits, side) {
    super(name)
    this.taskForce = taskForce
    this.hits = hits
    this.side = side
  }

  get isSunk() {
    return this._hits === 3
  }

  set hits(h) {
    this._hits = h
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
