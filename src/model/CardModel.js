import GlobalUnitsModel from "./GlobalUnitsModel"

export default class CardModel {
  // data structures for card piles, hands

  // if initial, can only draw japan cards
  drawJapanCards(num, initial) {
    let drawDeck = Array.from(GlobalUnitsModel.cards)
    if (initial) {
      drawDeck = Array.from(GlobalUnitsModel.cards).filter((card) => card.side === GlobalUnitsModel.Side.JAPAN)
    }

    for (let i = 0; i < num; i++) {
      if (drawDeck.length > 0) {
        const rn = Math.floor(Math.random() * drawDeck.length)
        const card = drawDeck[rn]
        drawDeck.splice(rn, 1)
        GlobalUnitsModel.cards = Array.from(GlobalUnitsModel.cards).filter((c) => c.number != card.number)
        GlobalUnitsModel.jpCards.push(card)
      }
    }
  }

  drawUSCards(num, initial) {
    let drawDeck = Array.from(GlobalUnitsModel.cards)
    if (initial) {
      drawDeck = Array.from(GlobalUnitsModel.cards).filter((card) => card.side === GlobalUnitsModel.Side.US || card.side === GlobalUnitsModel.Side.US)
    }

    for (let i = 0; i < num; i++) {
      if (drawDeck.length > 0) {
        const rn = Math.floor(Math.random() * drawDeck.length)
        const card = drawDeck[rn]
        drawDeck.splice(rn, 1)
        GlobalUnitsModel.cards = Array.from(GlobalUnitsModel.cards).filter((c) => c.number != card.number)
        GlobalUnitsModel.usCards.push(card)
      }
    }
  }

  getCards(side) {
    return side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.jpCards : GlobalUnitsModel.usCards
  }
}
