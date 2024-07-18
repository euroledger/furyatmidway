export default class EventCard {
    constructor(number, title, side, playable) {
        this.number = number;
        this.title = title;
        this.side = side;
        this.playable = playable
    };

    set number(n) {
        this._number = n;
    }

    set title(t) {
        this._title = t;
    }

    set side(s) {
        this._side = s
    }

    set playable(p) {
        this._playable = p
    }
    
    get number() {
        return this._number
    }
    
    get playable() {
        return this._.playable
    }

    get title() {
        return this._title;
    }

    get side() {
        return this._side
    }
}
