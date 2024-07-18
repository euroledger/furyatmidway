import GlobalUnitsModel from "./model/GlobalUnitsModel"
import EventCard from "./model/EventCards"

const cards = [
  {
    title: "TOWED TO A FRIENDLY PORT",
    number: 1,
    side: GlobalUnitsModel.Side.US,

  },
  {
    title: "DAMAGE CONTROL",
    number: 2,
    side: GlobalUnitsModel.Side.BOTH,

  },
  {
    title: "AIR REPLACEMENTS",
    number: 3,
    side: GlobalUnitsModel.Side.BOTH,

  },
  {
    title: "SUBMARINE",
    number: 4,
    side: GlobalUnitsModel.Side.BOTH,

  },
  {
    title: "NAVAL BOMBARDMENT",
    number: 5,
    side: GlobalUnitsModel.Side.JAPAN,

  },
  {
    title: "HIGH SPEED RECONNAISANCE",
    number: 6,
    side: GlobalUnitsModel.Side.JAPAN,

  },
  {
    title: "TROUBLED RECONNAISANCE",
    number: 7,
    side: GlobalUnitsModel.Side.US,

  },
  {
    title: "SEMPER FI",
    number: 8,
    side: GlobalUnitsModel.Side.US,

  },
  {
    title: "ESCORT SEPARATED",
    number: 9,
    side: GlobalUnitsModel.Side.JAPAN,

  },
  {
    title: "US CARRIER PLANES DITCH",
    number: 10,
    side: GlobalUnitsModel.Side.JAPAN,

  },
  {
    title: "US STRIKE LOST",
    number: 11,
    side: GlobalUnitsModel.Side.JAPAN,

  },
  {
    title: "ELITE PILOTS",
    number: 12,
    side: GlobalUnitsModel.Side.JAPAN,

  },
  {
    title: "CRITICAL HIT",
    number: 13,
    side: GlobalUnitsModel.Side.US,

  },
]
function loadCards() {
  GlobalUnitsModel.cards = new Array()
  for (const c of cards) {
    const card = new EventCard(c.number, c.title, c.side, false)
    GlobalUnitsModel.cards.push(card)
  }
}

export default loadCards
