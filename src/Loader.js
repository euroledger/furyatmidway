import BaseUnit from "./components/buttons/mapobjects/BaseUnit";
import AirUnit from "./components/buttons/mapobjects/AirUnit";
import GlobalUnitsModel from "./model/GlobalUnitsModel";
import FleetUnit from "./model/FleetUnit";
import AircraftUnit from "./model/AircraftUnit";

function loadCounters(controller) {
  let counters = new Map();

  // 1AF Counter
  let position = {
    hexCoords: {},
    left: 102,
    top: 117,
  };

  counters.set(
    "1AF",
    new BaseUnit(
      "1AF",
      "Japanese 1AF",
      position,
      { x: 28, y: 31 }, // offsets
      "/images/fleetcounters/1AF.png",
      "3.0%"
    )
  );

  GlobalUnitsModel.jpFleetUnits.set("1AF", new FleetUnit("1AF", false));
  GlobalUnitsModel.jpFleetUnits.set("MIF", new FleetUnit("MIF", false));
  GlobalUnitsModel.jpFleetUnits.set("DMCV", new FleetUnit("DMCV", false));

  GlobalUnitsModel.usFleetUnits.set("CSF", new FleetUnit("CSF", false));
  GlobalUnitsModel.usFleetUnits.set("DMCV", new FleetUnit("DMCV", false));

  loadAkagiAirCounters(controller, counters);

  // loadAirCounters(
  //   GlobalUnitsModel.Side.JAPAN,
  //   GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
  //   GlobalUnitsModel.Carrier.AKAGI,
  //   japanAirUnitsCD1Akagi
  // );

  return counters;
}

const japanAirUnitsCD1Akagi = [
  {
    name: "Akagi-A6M-2b-1",
    longName: "Japanese A6M-2b (Akagi) 1",
    position: {
      left: 10,
      top: 430,
    },
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Akagi-A6M-2b-2",
    longName: "Japanese A6M-2b (Akagi) 2",
    position: {
      left: 10,
      top: 455,
    },
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Akagi-D3A-1",
    longName: "Japanese D3A-1 (Akagi)",
    position: {
      left: 10,
      top: 480,
    },
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
    },
  },
  {
    name: "Akagi-B5N-2",
    longName: "Japanese B5N-2 (Akagi)",
    position: {
      left: 10,
      top: 505,
    },
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
    },
  },
];

function loadAkagiAirCounters(controller, counters) {
  // Akagi Air Counters
  // A6M-2b 1
  let position = {
    hexCoords: {},
    left: 10,
    top: 430,
  };
  const af1 = new AirUnit(
    "Akagi-A6M-2b-1",
    "Japanese A6M-2b (Akagi) 1",
    position,
    { x: 66, y: 80 },
    "/images/aircounters/akagi-a6m-front.png",
    "2.1%",
    GlobalUnitsModel.Carrier.AKAGI
  );
  counters.set("Akagi-A6M-2b-1", af1);

  GlobalUnitsModel.jpAirUnits.set(
    "Akagi-A6M-2b-1",
    new AircraftUnit("Akagi-A6M-2b-1", 3, 3, false, false)
  );
  controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af1);
  controller.addAirUnitToCarrier("Akagi", af1);

  // A6M-2b 2
  position = {
    hexCoords: {},
    left: 10,
    top: 455,
  };
  const af2 = new AirUnit(
    "Akagi-A6M-2b-2",
    "Japanese A6M-2b (Akagi) 2",
    position,
    { x: 66, y: 80 },
    "/images/aircounters/akagi-a6m-front.png",
    "2.1%",
    GlobalUnitsModel.Carrier.AKAGI
  );
  counters.set("Akagi-A6M-2b-2", af2);
  GlobalUnitsModel.jpAirUnits.set(
    "Akagi-A6M-2b-2",
    new AircraftUnit("Akagi-A6M-2b-2", 3, 3, false, false)
  );
  controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af2);
  controller.addAirUnitToCarrier("Akagi", af2);

  // D3A-1
  position = {
    hexCoords: {},
    left: 10,
    top: 480,
  };
  const d3a = new AirUnit(
    "Akagi-D3A-1",
    "Japanese D3A-1 (Akagi)",
    position,
    { x: 66, y: 80 },
    "/images/aircounters/akagi-d3a-front.png",
    "2.1%",
    GlobalUnitsModel.Carrier.AKAGI
  );
  counters.set("Akagi-D3A-1", d3a);
  GlobalUnitsModel.jpAirUnits.set(
    "Akagi-D3A-1",
    new AircraftUnit("Akagi-D3A-1", 3, 3, true, true)
  );
  controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, d3a);
  controller.addAirUnitToCarrier("Akagi", d3a);

  // B5N-2
  position = {
    hexCoords: {},
    left: 10,
    top: 505,
  };
  const b5n = new AirUnit(
    "Akagi-B5N-2",
    "Japanese B5N-2 (Akagi)",
    position,
    { x: 66, y: 80 },
    "/images/aircounters/akagi-b5n-front.png",
    "2.1%",
    GlobalUnitsModel.Carrier.AKAGI
  );
  counters.set("Akagi-B5N-2", b5n);
  GlobalUnitsModel.jpAirUnits.set(
    "Akagi-B5N-2",
    new AircraftUnit("Akagi-B5N-2", 3, 3, true, false)
  );
  controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, b5n);
  controller.addAirUnitToCarrier("Akagi", b5n);
}
export default loadCounters;
