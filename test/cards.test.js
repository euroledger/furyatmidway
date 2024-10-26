import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCards from "../src/CardLoader"
import Controller from "../src/controller/Controller"
import GlobalGameState from "../src/model/GlobalGameState"

describe("Cards tests", () => {
  let controller
  let counters = loadCards()

  beforeEach(() => {
    controller = new Controller()
    counters = loadCards()
    GlobalGameState.jpCards = new Array()
    GlobalGameState.usCards = new Array()
  
  })

  test("Check card values", () => {
    expect(GlobalUnitsModel.cards.length).toEqual(13)
  })

  test("Test Japan opening hands card draw", () => {
    controller.drawJapanCards(3, true)
    expect(GlobalUnitsModel.jpCards.length).toEqual(3)
    expect(GlobalUnitsModel.cards.length).toEqual(10)

    // test uniqueness of card hand (no duplicate cards)
    const key = "number"
    const arrayUniqueByKey = [...new Map(GlobalUnitsModel.jpCards.map((item) => [item[key], item])).values()]

    expect(arrayUniqueByKey.length).toEqual(3)
  })

  test("Test US opening hands card draw", () => {
    controller.drawJapanCards(3, true)
    controller.drawUSCards(2, true)
    expect(GlobalUnitsModel.usCards.length).toEqual(2)
    expect(GlobalUnitsModel.cards.length).toEqual(8)

    // test uniqueness of card hand (no duplicate cards)
    const key = "number"
    const arrayUniqueByKey = [...new Map(GlobalUnitsModel.usCards.map((item) => [item[key], item])).values()]
    expect(arrayUniqueByKey.length).toEqual(2)
  })

  test("Set Japan Draw, Play Certain Cards, test Cards No Longer in Japan Hand", () => {
    GlobalUnitsModel.jpCards = new Array()

    controller.drawJapanCards(3, true, [6, 11, 9])

    expect(controller.japanHandContainsCard(6)).toEqual(true)
    expect(controller.japanHandContainsCard(11)).toEqual(true)
    expect(controller.japanHandContainsCard(9)).toEqual(true)


    controller.setCardPlayed(6, GlobalUnitsModel.Side.JAPAN)
    expect(controller.getCardPlayed(6, GlobalUnitsModel.Side.JAPAN)).toEqual(true)
    expect(controller.japanHandContainsCard(6)).toEqual(false)

    controller.setCardPlayed(11, GlobalUnitsModel.Side.JAPAN)
    expect(controller.getCardPlayed(11, GlobalUnitsModel.Side.JAPAN)).toEqual(true)
    expect(controller.japanHandContainsCard(11)).toEqual(false)

    controller.setCardPlayed(9, GlobalUnitsModel.Side.JAPAN)
    expect(controller.getCardPlayed(9, GlobalUnitsModel.Side.JAPAN)).toEqual(true)
    expect(controller.japanHandContainsCard(9)).toEqual(false)
  })

  test("Set US Draw, Play Certain Cards, test Cards No Longer in US Hand", () => {
    GlobalUnitsModel.jpCards = new Array()

    controller.drawUSCards(2, true, [13, 1])

    expect(controller.usHandContainsCard(13)).toEqual(true)
    expect(controller.usHandContainsCard(1)).toEqual(true)

    controller.setCardPlayed(13, GlobalUnitsModel.Side.US)
    expect(controller.getCardPlayed(13, GlobalUnitsModel.Side.US)).toEqual(true)
    expect(controller.usHandContainsCard(13)).toEqual(false)

    controller.setCardPlayed(1, GlobalUnitsModel.Side.US)
    expect(controller.getCardPlayed(1, GlobalUnitsModel.Side.US)).toEqual(true)
    expect(controller.usHandContainsCard(1)).toEqual(false)
  })

  test("Set Japan Initial Draw then replace one card with a new one (useful for UI testing)", () => {
    GlobalUnitsModel.jpCards = new Array()

    controller.drawJapanCards(3, true, [6, 11, 9])

    // replace card #6 with card #5
    controller.replaceCardWithOtherCard(6, 5, GlobalUnitsModel.Side.JAPAN)

    expect(GlobalUnitsModel.jpCards.length).toEqual(3)
    expect(controller.japanHandContainsCard(6)).toEqual(false)
    expect(controller.japanHandContainsCard(5)).toEqual(true)

  })
})
