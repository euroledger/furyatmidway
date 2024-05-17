import BaseCounter from "./components/buttons/mapobjects/BaseCounter";


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
    new BaseCounter(
      "1AF",
      "Japanese 1AF",
      position,
      { x: 28, y: 31 }, // offsets
      "/images/fleetcounters/1AF.png",
      "3.0%"
    )
  );

  // Akagi Air Counters
  position = {
    hexCoords: {},
    left: 10,
    top: 550,
  };
  counters.set(
    "Akagi-A6M-1",
    new BaseCounter(
      "1AF",
      "Japanese 1AF",
      position,
      { x: 66, y: 80 },
      "/images/aircounters/akagi-a6m-front.png",
      "40px"
    )
  );
  return counters;
}

export default loadCounters;
