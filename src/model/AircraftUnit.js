export default class AircraftUnit {
    constructor(name, strength, movement, attack, diveBomber, steps, moved, intercepting) {
        this.name = name;
        this.strength = strength;
        this.movement = movement;
        this.attack = attack;
        this.diveBomber = diveBomber
        this.steps = steps,
        this.moved = moved
        this.intercepting = intercepting
        this.hitsScored = 0
    };

    get movement() {
        return this._movement
    }

    set movement(mv) {
        this._movement = mv
    }

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

    get moved() {
        return this._moved
    }

    set moved(m) {
        this._moved = m
    }

    get intercepting() {
        return this._intercepting
    }

    set intercepting(i) {
        this._intercepting = i
    }

    get hitsScored() {
        return this._hitsScored
    }

    set hitsScored(hs) {
        this._hitsScored = hs
    }
}
