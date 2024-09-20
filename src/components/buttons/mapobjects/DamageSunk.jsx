export default class DamageSunk {
  constructor(name, image, width, position) {
    this.name = name
    this.image = image
    this.width = width
    this.position = position
  }

  set name(n) {
    this._name = n
  }

  get name() {
    return this._name
  }

  set image(i) {
    this._image = i
  }

  get image() {
    return this._image
  }

  set position(p) {
    this._position = p
  }

  get position() {
    return this._position
  }
}
