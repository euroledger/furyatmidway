import BaseUnit from "./components/buttons/mapobjects/BaseUnit";
import AirUnit from "./components/buttons/mapobjects/AirUnit";
import GlobalUnitsModel from './model/GlobalUnitsModel'
import FleetUnit from "./model/FleetUnit";
import AircraftUnit from "./model/AircraftUnit";

function loadCounters() {
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

  GlobalUnitsModel.jpFleetUnits.set("1AF", new FleetUnit("1AF", false))
  GlobalUnitsModel.jpFleetUnits.set("MIF", new FleetUnit("MIF", false))
  GlobalUnitsModel.jpFleetUnits.set("DMCV", new FleetUnit("DMCV", false))

  GlobalUnitsModel.usFleetUnits.set("CSF", new FleetUnit("CSF", false))
  GlobalUnitsModel.usFleetUnits.set("DMCV", new FleetUnit("DMCV", false))
 
  // Akagi Air Counters
  // A6M 1
  position = {
    hexCoords: {},
    left: 10,
    top: 430,
  };
  counters.set(
    "Akagi-A6M-2b-1",
    new AirUnit(
      "Akagi-A6M-2b-1",
      "Japanese A6M-2b (Akagi) 1",
      position,
      { x: 66, y: 80 },
      "/images/aircounters/akagi-a6m-front.png",
      "2.1%",
    )
  );

  GlobalUnitsModel.jpAirUnits.set("Akagi-A6M-2b-1", new AircraftUnit("Akagi-A6M-2b-1", 3, 3, false, false))
  
  // A6M 2
  position = {
    hexCoords: {},
    left: 10,
    top: 455,
  };
  counters.set(
    "Akagi-A6M-2b-2",
    new AirUnit(
      "Akagi-A6M-2b-2",
      "Japanese A6M-2b (Akagi) 2",
      position,
      { x: 66, y: 80 },
      "/images/aircounters/akagi-a6m-front.png",
      "2.1%",
    )
  );
  GlobalUnitsModel.jpAirUnits.set("Akagi-A6M-2b-2", new AircraftUnit("Akagi-A6M-2b-2", 3, 3, false, false))

  return counters;
}

export default loadCounters;
