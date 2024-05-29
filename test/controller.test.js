import Controller from "../src/controller/Controller";
import GlobalUnitsModel from "../src/model/GlobalUnitsModel";
import loadCounters from "../src/CounterLoader";

describe("Controller tests", () => {
  let controller;
  let counters;

  beforeEach(() => {
    controller = new Controller();
    counters = loadCounters(controller);
  });

  test("check air units can be added, retrieved and removed to/from model", () => {
    // get air unit from data store
    const af = counters.get("Akagi-A6M-2b-2");

    // add this air unit to the CAP box
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, af);

    // return all air units in this box, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(
      GlobalUnitsModel.AirBox.JP_CD1_CAP
    );

    expect(airUnits.length).toBe(1);
    expect(airUnits[0].name).toBe("Akagi-A6M-2b-2");

    controller.removeAirUnitFromBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0);
    airUnits = controller.getAllAirUnitsInBox(
      GlobalUnitsModel.AirBox.JP_CD1_CAP
    );
    expect(airUnits.length).toBe(0);
  });

  test("Test to see if air unit is present in a particular box", () => {
    const af = counters.get("Akagi-A6M-2b-2");
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, af);

    let found = controller.isAirUnitInBox(
      GlobalUnitsModel.AirBox.JP_CD1_CAP,
      "Akagi-A6M-2b-2"
    );
    expect(found).toBe(true);

    found = controller.isAirUnitInBox(
      GlobalUnitsModel.AirBox.JP_CD1_CAP,
      "Akagi-A6M-2b-1"
    );
    expect(found).toBe(false);
  });

  test("Initial placement of air units off board", () => {
    const af1 = counters.get("Akagi-A6M-2b-1");
    const af2 = counters.get("Akagi-A6M-2b-2");

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af1);
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af2);

    let location = controller.getAirUnitLocation("Akagi-A6M-2b-1");
    expect(location.boxName).toBe(GlobalUnitsModel.AirBox.OFFBOARD);

    location = controller.getAirUnitLocation("Akagi-A6M-2b-2");
    expect(location.boxName).toBe(GlobalUnitsModel.AirBox.OFFBOARD);
  });

  test("Test the air unit location (box name and index", () => {
    const af = counters.get("Akagi-A6M-2b-2");
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, af);

    const { boxName, boxIndex } =
      controller.getAirUnitLocation("Akagi-A6M-2b-2");

    expect(boxName).toBe(GlobalUnitsModel.AirBox.JP_CD1_CAP);
    expect(boxIndex).toBe(2);
  });

  test("Move an air unit from OFFBOARD to the CAP box to the CAP returning box", () => {
    const af1 = counters.get("Akagi-A6M-2b-1");
    const af2 = counters.get("Akagi-A6M-2b-2");

    // loader adds units to OFFBOARD during load process

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, af1);
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 3, af2);

    controller.addAirUnitToBox(
      GlobalUnitsModel.AirBox.JP_AKAGI_CAP_RETURN1,
      0,
      af1
    );

    let location = controller.getAirUnitLocation("Akagi-A6M-2b-1");
    expect(location.boxName).toBe(GlobalUnitsModel.AirBox.JP_AKAGI_CAP_RETURN1);
    expect(location.boxIndex).toBe(0);

    location = controller.getAirUnitLocation("Akagi-A6M-2b-2");
    expect(location.boxName).toBe(GlobalUnitsModel.AirBox.JP_CD1_CAP);
    expect(location.boxIndex).toBe(3);

    let airUnits = controller.getAllAirUnitsInBox(
      GlobalUnitsModel.AirBox.JP_CD1_CAP
    );
    expect(airUnits.length).toBe(1);
  });

  test("Air Units for Carrier", () => {
    const airUnits = controller.getAirUnitsForCarrier("Akagi");
    expect(airUnits.length).toBe(4);

    expect(airUnits[0].name).toBe("Akagi-A6M-2b-1");
    expect(airUnits[1].name).toBe("Akagi-A6M-2b-2");
    expect(airUnits[2].name).toBe("Akagi-D3A-1");
    expect(airUnits[3].name).toBe("Akagi-B5N-2");
  });

  test("Move Air Unit event in View Event Handler", () => {
    const af1 = counters.get("Akagi-A6M-2b-1");

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, af1);

    let location = controller.getAirUnitLocation("Akagi-A6M-2b-1");
    expect(location.boxName).toBe(GlobalUnitsModel.AirBox.JP_CD1_CAP);
    expect(location.boxIndex).toBe(2);

    const counterData =  counters.get("Akagi-A6M-2b-1")
    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name: GlobalUnitsModel.AirBox.JP_CD1_CAP,
        counterData,
        index: 2,
      },
    });
    const airUnitsDeployed = controller.getAirUnitsDeployed(counterData.carrier);
    expect(airUnitsDeployed.length).toBe(1)
  });
});
