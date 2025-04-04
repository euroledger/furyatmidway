export default class AircraftUnit {
    constructor(name, strength, movement, attack, diveBomber, steps, moved, intercepting, carrierLaunchedFrom) {
        this.name = name;
        this.strength = strength;
        this.movement = movement;
        this.attack = attack;
        this.diveBomber = diveBomber
        this.steps = steps,
        this.moved = moved
        this.turnmoved = 0
        this.intercepting = intercepting
        this.hitsScored = 0
        this.separated = false
        this.carrierLaunchedFrom = carrierLaunchedFrom
    };

    set carrierLaunchedFrom(clf) {
        this._carrierLaunchedFrom = clf
    }

    get carrierLaunchedFrom() {
        return this._carrierLaunchedFrom
    }

    set movement(mv) {
        this._movement = mv
    }

    get movement()  {
        return this._movement
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

    get turnmoved() {
        return this._turnmoved
    }

    set turnmoved(tm) {
        this._turnmoved = tm
    }

    get intercepting() {
        return this._intercepting
    }

    set intercepting(i) {
        this._intercepting = i
    }

    
    get separated() {
        return this._separated
    }

    set separated(s) {
        this._separated = s
    }

    get hitsScored() {
        return this._hitsScored
    }

    set hitsScored(hs) {
        this._hitsScored = hs
    }
}
