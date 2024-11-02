import BaseUnit from "./BaseUnit"
export default class FleetUnit extends BaseUnit {
  constructor(name, taskForce, hits, side) {
    super(name)
    this.taskForce = taskForce
    this.hits = hits
    this.side = side
    this.bowDamaged = false
    this.sternDamaged = false
    this.towed = false
    this.dmcv = false
  }

  get isSunk() {
    return this._hits >= 3
  }

  // @TODO add functions for bow and stern damage

  set hits(h) {
    this._hits = h
  }

  set dmcv (d) {
    this._dmcv = d
  }

  get dmcv() {
    return this._dmcv
  }
  
  set towed (t) {
    this._towed = t
  }

  get towed() {
    return this._towed
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
