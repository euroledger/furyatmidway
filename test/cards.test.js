import GlobalUnitsModel from "../src/model/GlobalUnitsModel";
import loadCards from "../src/CardLoader";

describe("Cards tests", () => {

  beforeEach(() => {
    loadCards();
  });

  test("check card values", () => {
    expect(GlobalUnitsModel.cards.length).toBe(1);
  });

});
