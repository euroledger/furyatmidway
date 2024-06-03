import { default as FleetUnit } from "../src/model/FleetUnit";
import GlobalUnitsModel from "../src/model/GlobalUnitsModel";
import loadCounters from "../src/CounterLoader";
import GlobalGameState from "../src/model/GlobalGameState";
import JapanAirBoxOffsets from "../src/components/draganddrop/JapanAirBoxOffsets";
import Controller from "../src/controller/Controller";

describe("Controller tests", () => {
  let counters;

  beforeEach(() => {
    counters = loadCounters(new Controller());
  });

  test("check global (game) fleet unit values", () => {
    expect(GlobalUnitsModel.jpFleetUnits.size).toEqual(3);
    expect(GlobalUnitsModel.usFleetUnits.size).toEqual(2);

    expect(GlobalUnitsModel.jpFleetUnits.get("1AF")).toBeTruthy();
    expect(GlobalUnitsModel.jpFleetUnits.get("MIF")).toBeTruthy();
    expect(GlobalUnitsModel.jpFleetUnits.get("DMCV")).toBeTruthy();

    expect(GlobalUnitsModel.usFleetUnits.get("CSF")).toBeTruthy();
    expect(GlobalUnitsModel.usFleetUnits.get("DMCV")).toBeTruthy();

    expect(GlobalUnitsModel.jpAirUnits.size).toEqual(16);
  });

  test("check fleet unit values", () => {
    const f1 = new FleetUnit("1AF", false);
    const f2 = new FleetUnit("DMCV", true);

    expect(f1.damaged).toEqual(false);
    expect(f2.damaged).toEqual(true);
    expect(f1.name).toEqual("1AF");
    expect(f2.name).toEqual("DMCV");
  });

  test("check fleet unit counter values", () => {
    const af = counters.get("1AF");
    expect(af).toBeTruthy();
    expect(af.name).toEqual("1AF");
    expect(af.longName).toEqual("Japanese 1AF");
    expect(af.position.left).toEqual(102);
    expect(af.position.top).toEqual(117);
    expect(af.image).toEqual("/images/fleetcounters/1AF.png");
    expect(af.width).toEqual("3.0%");
  });

  test("check setup phase messages", () => {
    let message = GlobalGameState.getSetupMessage();
    expect(message).toEqual("Place Akagi Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toEqual("Place Kaga Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toEqual("Place Hiryu Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toEqual("Place Soryu Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toEqual("Draw 3 x Japan Cards");
  });

  test("check Drop Zone offsets", () => {
    const japanCapZones = JapanAirBoxOffsets.find(
      (box) => box.name === GlobalUnitsModel.AirBox.JP_CD1_CAP
    );
    expect(japanCapZones.offsets.length).toEqual(4);
    expect(japanCapZones.offsets[0].left).toEqual(15.4);
    expect(japanCapZones.offsets[0].top).toEqual(68.3);
    const japanReturningCapZones = JapanAirBoxOffsets.find(
      (box) => box.name === GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN
    );
    expect(japanReturningCapZones.offsets.length).toEqual(4);
  });

  test("check air unit counter values", () => {
    const af = counters.get("Akagi-A6M-2b-2");
    expect(af).toBeTruthy();
    expect(af.name).toEqual("Akagi-A6M-2b-2");
    expect(af.longName).toEqual("Japanese A6M-2b (Akagi) 2");
    expect(af.image).toEqual("/images/aircounters/akagi-a6m-front.png");
    expect(af.width).toEqual("2.1%");
    expect(af.carrier).toEqual(GlobalUnitsModel.Carrier.AKAGI);

    let db = GlobalUnitsModel.jpAirUnits.get("Akagi-D3A-1");
    expect(db.movement).toEqual(3);
    expect(db.strength).toEqual(3);
    expect(db.attack).toEqual(true);
    expect(db.diveBomber).toEqual(true);

    db = GlobalUnitsModel.jpAirUnits.get("Soryu-D3A-1");
    expect(db.movement).toEqual(3);
    expect(db.strength).toEqual(3);
    expect(db.attack).toEqual(true);
    expect(db.diveBomber).toEqual(true);
  });
});
