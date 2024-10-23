import GlobalUnitsModel from "./GlobalUnitsModel"

export default class CardModel {
  // data structures for card piles, hands

  // GlobalUnitsModel.cards is the remaining draw deck


  // if initial, can only draw japan cards
  drawJapanCards(num, initial, testCards) {
    let drawDeck = Array.from(GlobalUnitsModel.cards)
    if (initial) {
      drawDeck = Array.from(GlobalUnitsModel.cards).filter((card) => card.side === GlobalUnitsModel.Side.JAPAN)
    }

    if (testCards !== undefined) {
      for (let i = 0; i < num; i++) {
        const card = GlobalUnitsModel.cards.find((card) => card._number === testCards[i])
        GlobalUnitsModel.cards = Array.from(GlobalUnitsModel.cards).filter((c) => c._number != card._number)
        GlobalUnitsModel.jpCards.push(card)
      }
      return
    }
    for (let i = 0; i < num; i++) {
      if (drawDeck.length > 0) {
        const rn = Math.floor(Math.random() * drawDeck.length)
        const card = drawDeck[rn]
        drawDeck.splice(rn, 1)
        GlobalUnitsModel.cards = Array.from(GlobalUnitsModel.cards).filter((c) => c._number != card._number)
        GlobalUnitsModel.jpCards.push(card)
      }
    }
  }

  drawUSCards(num, initial, testCards) {
    let drawDeck = Array.from(GlobalUnitsModel.cards)
    if (initial) {
      drawDeck = Array.from(GlobalUnitsModel.cards).filter((card) => card.side === GlobalUnitsModel.Side.US)
    }

    if (testCards !== undefined) {
      for (let i = 0; i < num; i++) {
        const card = GlobalUnitsModel.cards.find((card) => card._number === testCards[i])
        GlobalUnitsModel.cards = Array.from(GlobalUnitsModel.cards).filter((c) => c._number != card._number)
        GlobalUnitsModel.usCards.push(card)
      }
      return
    }
    for (let i = 0; i < num; i++) {
      if (drawDeck.length > 0) {
        const rn = Math.floor(Math.random() * drawDeck.length)
        const card = drawDeck[rn]
        drawDeck.splice(rn, 1)
        GlobalUnitsModel.cards = Array.from(GlobalUnitsModel.cards).filter((c) => c._number != card._number)
        GlobalUnitsModel.usCards.push(card)
      }
    }
  }

  getCards(side) {
    return side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.jpCards : GlobalUnitsModel.usCards
  }

  japanHandContainsCard(cardNum) {
    const found = GlobalUnitsModel.jpCards.find((card) => card._number === cardNum)
    if (found) {
      return true
    }
    return false
  }

  usHandContainsCard(cardNum) {
    const found = GlobalUnitsModel.usCards.find((card) => card._number === cardNum)
    if (found) {
      return true
    }
    return false
  }

  setCardPlayed(cardNum, side) {
    GlobalUnitsModel.cards = GlobalUnitsModel.cards.filter((card) => card._number !== cardNum)

    if (side === GlobalUnitsModel.Side.JAPAN) {
      GlobalUnitsModel.jpCards = GlobalUnitsModel.jpCards.filter((card) => card._number !== cardNum)
    } else {
      GlobalUnitsModel.usCards = GlobalUnitsModel.usCards.filter((card) => card._number !== cardNum)
    }
  }

  getCardPlayed(cardNum, side) {
    const cardInDeck = GlobalUnitsModel.cards.find((card) => card._number === cardNum)

    let cardInHand
    
    if (side === GlobalUnitsModel.Side.JAPAN) {
      cardInHand = GlobalUnitsModel.jpCards.find((card) => card._number === cardNum)
    } else {
      cardInHand = GlobalUnitsModel.usCards.find((card) => card._number === cardNum)
    }

    return cardInDeck === undefined && cardInHand === undefined
  }
}
