import { default as FleetUnit } from "../src/model/FleetUnit";
import GlobalUnitsModel from "../src/model/GlobalUnitsModel";
import loadCounters from "../src/Loader";
import GlobalGameState from "../src/model/GlobalGameState";
import JapanAirBoxOffsets from "../src/components/buttons/mapobjects/JapanAirBoxOffsets"
import Controller from "../src/controller/Controller";

describe('Controller tests', () => {
  let counters

  beforeEach(() => {
    counters = loadCounters(new Controller());
  });
  
  test("check global (game) fleet unit values", () => {
    expect(GlobalUnitsModel.jpFleetUnits.size).toBe(3);
    expect(GlobalUnitsModel.usFleetUnits.size).toBe(2);

    expect(GlobalUnitsModel.jpFleetUnits.get("1AF")).toBeTruthy();
    expect(GlobalUnitsModel.jpFleetUnits.get("MIF")).toBeTruthy();
    expect(GlobalUnitsModel.jpFleetUnits.get("DMCV")).toBeTruthy();

    expect(GlobalUnitsModel.usFleetUnits.get("CSF")).toBeTruthy();
    expect(GlobalUnitsModel.usFleetUnits.get("DMCV")).toBeTruthy();

    expect(GlobalUnitsModel.jpAirUnits.size).toBe(4)
  });

  test("check fleet unit values", () => {
    const f1 = new FleetUnit("1AF", false);
    const f2 = new FleetUnit("DMCV", true);

    expect(f1.damaged).toBe(false);
    expect(f2.damaged).toBe(true);
    expect(f1.name).toEqual("1AF");
    expect(f2.name).toEqual("DMCV");
  });

  test("check fleet unit counter values", () => {
    const af = counters.get("1AF");
    expect(af).toBeTruthy();
    expect(af.name).toBe("1AF");
    expect(af.longName).toBe("Japanese 1AF");
    expect(af.position.left).toBe(102);
    expect(af.position.top).toBe(117);
    expect(af.offsets.x).toBe(28);
    expect(af.offsets.y).toBe(31)
    expect(af.image).toBe("/images/fleetcounters/1AF.png");
    expect(af.width).toBe("3.0%");
  });

  test("check setup phase messages", () => {
    let message = GlobalGameState.getSetupMessage();
    expect(message).toBe("Place Akagi Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toBe("Place Kaga Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toBe("Place Hiryu Air Units");

    GlobalGameState.setupPhase++;
    message = GlobalGameState.getSetupMessage();
    expect(message).toBe("Place Soryu Air Units");
  });

  test("check Drop Zone offsets", () => {
    const japanCapZones = JapanAirBoxOffsets.find((box) => box.name === GlobalUnitsModel.AirBoxes.JP_CD_CAP1);
    expect(japanCapZones.offsets.length).toBe(4)
    expect(japanCapZones.offsets[0].left).toBe(15.4)
    expect(japanCapZones.offsets[0].top).toBe(68.3)
    const japanReturningCapZones = JapanAirBoxOffsets.find((box) => box.name === GlobalUnitsModel.AirBoxes.JP_CAP_RETURN1);
    expect(japanReturningCapZones.offsets.length).toBe(1)
  });

  test("check air unit counter values", () => {
    const af = counters.get("Akagi-A6M-2b-2");
    expect(af).toBeTruthy();
    expect(af.name).toBe("Akagi-A6M-2b-2");
    expect(af.longName).toBe("Japanese A6M-2b (Akagi) 2");
    expect(af.image).toBe("/images/aircounters/akagi-a6m-front.png");
    expect(af.width).toBe("2.1%");
    expect(af.carrier).toBe(GlobalUnitsModel.japanCarriers.AKAGI)
  });
})