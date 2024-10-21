import GlobalUnitsModel from "./model/GlobalUnitsModel"
import EventCard from "./model/EventCards"

const cards = [
  {
    title: "Towed to a Friendly Port",
    number: 1,
    side: GlobalUnitsModel.Side.US,
  },
  {
    title: "Damage Control",
    number: 2,
    side: GlobalUnitsModel.Side.BOTH,
  },
  {
    title: "Air Replacements",
    number: 3,
    side: GlobalUnitsModel.Side.BOTH,
  },
  {
    title: "Submarine",
    number: 4,
    side: GlobalUnitsModel.Side.BOTH,
  },
  {
    title: "Naval Bombardment",
    number: 5,
    side: GlobalUnitsModel.Side.JAPAN,
  },
  {
    title: "High Speed Reconnaissance",
    number: 6,
    side: GlobalUnitsModel.Side.JAPAN,
  },
  {
    title: "Troubled Reconnaissance",
    number: 7,
    side: GlobalUnitsModel.Side.US,
  },
  {
    title: "Semper Fi",
    number: 8,
    side: GlobalUnitsModel.Side.US,
  },
  {
    title: "Escort Separated",
    number: 9,
    side: GlobalUnitsModel.Side.JAPAN,
  },
  {
    title: "US Carrier Planes Ditch",
    number: 10,
    side: GlobalUnitsModel.Side.JAPAN,
  },
  {
    title: "US Strike Lost",
    number: 11,
    side: GlobalUnitsModel.Side.JAPAN,
  },
  {
    title: "Elite Pilots",
    number: 12,
    side: GlobalUnitsModel.Side.JAPAN,
  },
  {
    title: "Critical Hit",
    number: 13,
    side: GlobalUnitsModel.Side.US,
  },
]
function loadCards() {
  GlobalUnitsModel.cards = new Array()
  for (const c of cards) {
    const card = new EventCard(c.number, c.title, c.side)
    GlobalUnitsModel.cards.push(card)
  }
}

export default loadCards
