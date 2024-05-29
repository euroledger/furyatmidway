import Controller from "../src/controller/Controller";
import GlobalUnitsModel from "../src/model/GlobalUnitsModel";
import loadCounters from "../src/CounterLoader";

describe("Air Box tests", () => {
  let controller;
  let counters;

  beforeEach(() => {
    controller = new Controller();
    counters = loadCounters(controller);
  });

  test("check air units can be added to various carrier air boxes", () => {
    // get all Akagi air units from data store
    const af1 = counters.get("Akagi-A6M-2b-1");
    const af2 = counters.get("Akagi-A6M-2b-2");
    const db = counters.get("Akagi-D3A-1");
    const tb = counters.get("Akagi-B5N-2");

    // add one fighter to cap, one fighter to return1, other two units to hanger
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, af1);
    controller.addAirUnitToBox(
      GlobalUnitsModel.AirBox.JP_AKAGI_CAP_RETURN1,
      0,
      af2
    );
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGER, 0, db);
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGER, 1, tb);

    // return all air units in this box, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(
      GlobalUnitsModel.AirBox.JP_CD1_CAP
    );

    expect(airUnits.length).toBe(1);
    expect(airUnits[0].name).toBe("Akagi-A6M-2b-1");

    airUnits = controller.getAllAirUnitsInBox(
      GlobalUnitsModel.AirBox.JP_AKAGI_CAP_RETURN1
    );
    expect(airUnits.length).toBe(1);
    expect(airUnits[0].name).toBe("Akagi-A6M-2b-2");

    airUnits = controller.getAllAirUnitsInBox(
        GlobalUnitsModel.AirBox.JP_AKAGI_HANGER
      );
      expect(airUnits.length).toBe(2);
      expect(airUnits[0].name).toBe("Akagi-D3A-1");
      expect(airUnits[1].name).toBe("Akagi-B5N-2");
  });
});
