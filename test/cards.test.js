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

  test("Does a particular hand contain a certain card", () => {

  })
})
