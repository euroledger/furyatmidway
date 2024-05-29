import GlobalUnitsModel from "./model/GlobalUnitsModel";
import Card from "./model/Cards";

const cards = [
  {
    name: "TOWED TO A FRIENDLY PORT",
    number: 1,
    side: GlobalUnitsModel.Side.US
  }
];
function loadCards() {
  for (const c of cards) {
    const card = new Card(c.number, c.title, c.side);
    GlobalUnitsModel.cards.push(card)
  }
}

export default loadCards;
