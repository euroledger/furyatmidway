export default class AircraftUnit {
    constructor(name, strength, movement, attack, diveBomber, steps) {
        this.name = name;
        this.strength = strength;
        this.movement = movement;
        this.attack = attack;
        this.diveBomber = diveBomber
        this.steps = steps
    };

    set name(n) {
        this._name = n;
    }

    set strength(s) {
        this._strength = s;
    }
    
    set attack(a) {
        this._attack = a
    }

    set diveBomber(db) {
        this._diveBomber = db
    }

    set steps(s) {
        this._steps = s
    }
    get name() {
        return this._name;
    }

    get strength() {
        return this._strength
    }

    get attack() {
        return this._attack
    }

    get diveBomber() {
        return this._diveBomber
    }

    get steps() {
        return this._steps
    }
}
