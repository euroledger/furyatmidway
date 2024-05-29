export default class Card {
    constructor(number, title, side) {
        this.number = number;
        this.title = title;
        this.side = side;
    };

    set number(n) {
        this._number = n;
    }

    set title(t) {
        this._title = t;
    }
    
    get number() {
        return this._number
    }

    set side(s) {
        this._side = s
    }

    get title() {
        return this._title;
    }

    get side() {
        return this._side
    }
}
