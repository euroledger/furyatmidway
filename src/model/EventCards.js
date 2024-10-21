export default class EventCard {
    constructor(number, title, side) {
        this.number = number;
        this.title = title;
        this.side = side;
        this.played = false
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

    set played(p) {
        this._played = p
    }
    
    get number() {
        return this._number
    }
    
    get played() {
        return this._played
    }

    get title() {
        return this._title;
    }

    get side() {
        return this._side
    }
}
