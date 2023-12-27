import { default as FleetUnit } from "../src/model/FleetUnit";
import { default as GlobalUnits } from "../src/model/GlobalUnits";
import loadCounters from "../src/Loader";
import GlobalGameState from "../src/model/GlobalGameState";
import JapanAirBoxOffsets from "../src/components/buttons/mapobjects/JapanAirBoxOffsets"

test("check fleet unit values", () => {
  const f1 = new FleetUnit("1AF", false);
  const f2 = new FleetUnit("DMCV", true);

  expect(f1.damaged).toBe(false);
  expect(f2.damaged).toBe(true);
  expect(f1.name).toEqual("1AF");
  expect(f2.name).toEqual("DMCV");
});

test("check global (game) fleet unit values", () => {
  expect(GlobalUnits.jpFleetUnits.length).toBe(3);
  expect(GlobalUnits.usFleetUnits.length).toBe(2);

  expect(GlobalUnits.jpFleetUnits[0].name).toBe("1AF");
  expect(GlobalUnits.jpFleetUnits[1].name).toBe("MIF");
  expect(GlobalUnits.jpFleetUnits[2].name).toBe("DMCV");

  expect(GlobalUnits.usFleetUnits[0].name).toBe("CSF");
  expect(GlobalUnits.usFleetUnits[1].name).toBe("DMCV");
});

test("check fleet unit counter values", () => {
  const counters = loadCounters();

  const af = counters.get("1AF");
  expect(af).toBeTruthy();
  expect(af.name).toBe("1AF");
  expect(af.longName).toBe("Japanese 1AF");
  expect(af.position.left).toBe(102);
  expect(af.position.top).toBe(117);
  expect(af.offsets.x).toBe(66);
  expect(af.offsets.y).toBe(80);
  expect(af.image).toBe("/images/fleetcounters/1AF.png");
  expect(af.width).toBe("40px");
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
  const japanCapZones = JapanAirBoxOffsets.find((box) => box.name === "1CD CAP");
  expect(japanCapZones.offsets.length).toBe(4)
  expect(japanCapZones.offsets[0].left).toBe(13.0)
  expect(japanCapZones.offsets[0].top).toBe(67.3)
  const japanReturningCapZones = JapanAirBoxOffsets.find((box) => box.name === "1CD CAP RETURNING");
  expect(japanReturningCapZones.offsets.length).toBe(1)
  expect(japanReturningCapZones.offsets[0].left).toBe(9.8)
  expect(japanReturningCapZones.offsets[0].top).toBe(72.5)
});
