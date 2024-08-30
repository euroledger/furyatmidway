export default class BaseUnit {
    constructor(name, longName, position, offsets, image, width, side) {
        this.name = name;
        this.longName = longName
        this.position = position
        this.offsets = offsets
        this.image = image
        this.width = width
        this.side = side
    };

    set side(s) {
        this._side = s;
    }

    get side() {
        return this._side;
    }
    set name(n) {
        this._name = n;
    }

    get name() {
        return this._name;
    }

    set longName(ln) {
        this._longName = ln;
    }

    get longName() {
        return this._longName;
    }
    set position(p) {
        this._position = p;
    }

    get position() {
        return this._position;
    }

    set offsets(o) {
        this._offsets = o;
    }

    get offsets() {
        return this._offsets;
    }

    set image(i) {
        this._image = i;
    }

    get image() {
        return this._image;
    }

    set width(w) {
        this._width = w;
    }

    get width() {
        return this._width;
    }

}

