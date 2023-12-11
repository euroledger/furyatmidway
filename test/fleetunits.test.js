const { default: FleetUnit } = require("../src/model/FleetUnit");
const { default: GlobalUnits } = require("../src/model/GlobalUnits");

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
