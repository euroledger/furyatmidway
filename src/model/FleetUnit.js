export default class FleetUnit {
    constructor(name, damaged) {
        this.name = name;
        this.damaged = damaged;
    };

    set name(n) {
        this._name = n;
    }

    set damaged(d) {
        this._damaged = d;
    }

    get name() {
        return this._name;
    }

    get damaged() {
        return this._damaged
    }
}
