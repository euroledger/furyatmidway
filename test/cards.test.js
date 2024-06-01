import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCards from "../src/CardLoader"
import Controller from "../src/controller/Controller"

describe("Cards tests", () => {
  let controller
  let counters = loadCards()

  beforeEach(() => {
    controller = new Controller()
    counters = loadCards()
  })

  test("Check card values", () => {
    expect(GlobalUnitsModel.cards.length).toBe(13)
  })

  test("Test Japan opening hands card draw", () => {
    controller.drawJapanCards(3, true)
    expect(GlobalUnitsModel.jpCards.length).toBe(3)
    expect(GlobalUnitsModel.cards.length).toBe(10)
    
    // test uniqueness of card hand (no duplicate cards)
    const key = "number"
    const arrayUniqueByKey = [...new Map(GlobalUnitsModel.jpCards.map((item) => [item[key], item])).values()]

    expect(arrayUniqueByKey.length).toBe(3)
  })

  test("Test US opening hands card draw", () => {
    controller.drawJapanCards(3, true)
    controller.drawUSCards(3, true)
    expect(GlobalUnitsModel.usCards.length).toBe(3)
    expect(GlobalUnitsModel.cards.length).toBe(7)

    // test uniqueness of card hand (no duplicate cards)
    const key = "number"
    const arrayUniqueByKey = [...new Map(GlobalUnitsModel.usCards.map((item) => [item[key], item])).values()]
    expect(arrayUniqueByKey.length).toBe(3)
  })
})
