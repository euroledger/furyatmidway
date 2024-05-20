import BaseUnit from "./BaseUnit"
export default class AirUnit extends BaseUnit {
    constructor(name, longName, position, offsets, image, width, carrier) {
        super(name, longName, position, offsets, image, width)
        this.carrier = carrier
    };

    set carrier(c) {
        this._carrier = c;
    }

    get carrier() {
        return this._carrier;
    }
}