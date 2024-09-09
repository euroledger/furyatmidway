import BaseUnit from "./components/buttons/mapobjects/BaseUnit"
import AirUnit from "./components/buttons/mapobjects/AirUnit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import AircraftUnit from "./model/AircraftUnit"
import FleetUnit from "./components/buttons/mapobjects/FleetUnit"
import StrikeGroupUnit from "./components/buttons/mapobjects/StrikeGroupUnit"

function loadCounters(controller) {
  let counters = new Map()

  // 1AF Counter
  let position = {
    hexCoords: {},
    left: 104,
    top: 119,
  }

  counters.set(
    "1AF",
    new BaseUnit(
      "1AF",
      "Japanese 1AF",
      position,
      { x: 50, y: 68 }, // offsets
      "/images/fleetcounters/1AF.png",
      "2.5%",
      GlobalUnitsModel.Side.JAPAN
    )
  )

  position = {
    hexCoords: {},
    left: 34,
    top: 280,
  }
  counters.set(
    "MIF",
    new BaseUnit(
      "MIF",
      "Japanese Midway Invasion Force",
      position,
      { x: 50, y: 68 }, // offsets
      "/images/fleetcounters/MIF.png",
      "2.5%",
      GlobalUnitsModel.Side.JAPAN
    )
  )

  position = {
    hexCoords: {},
    left: 900,
    top: 117,
  }
  counters.set(
    "MIF-USMAP",
    new BaseUnit(
      "MIF-USMAP",
      "Japanese Midway Invasion Force (US Map)",
      position,
      { x: 50, y: 68 }, // offsets
      "/images/fleetcounters/MIF.png",
      "2.5%",
      GlobalUnitsModel.Side.JAPAN
    )
  )

  position = {
    hexCoords: {},
    left: 605,
    top: 119,
  }

  counters.set(
    "CSF",
    new BaseUnit(
      "CSF",
      "US Carrier Strike Force",
      position,
      { x: -3, y: 98 }, // offsets
      "/images/fleetcounters/CSF.png",
      "2.5%",
      GlobalUnitsModel.Side.US
    )
  )

  position = {
    hexCoords: {},
    left: 210,
    top: 117,
  }

  counters.set(
    "CSF-JPMAP",
    new BaseUnit(
      "CSF-JPMAP",
      "US Carrier Strike Force (Japan Map)",
      position,
      { x: -55, y: 70 }, // offsets
      "/images/fleetcounters/CSF.png",
      "2.5%",
      GlobalUnitsModel.Side.US
    )
  )

  position = {
    hexCoords: {},
    left: 802,
    top: 117,
  }
  counters.set(
    "1AF-USMAP",
    new BaseUnit(
      "1AF-USMAP",
      "Japanese 1AF (US Map)",
      position,
      { x: -200, y: 99 }, // offsets
      "/images/fleetcounters/1AF.png",
      "2.5%",
      GlobalUnitsModel.Side.JAPAN
    )
  )

  loadAirCounters(controller, counters)
  loadFleetUnits()
  loadStrikeGroups(controller, counters)
  return counters
}

const jpStartPosition1 = {
  left: "2%",
  top: "65%",
}

const jpStartPosition2 = {
  left: "2%",
  top: "69%",
}

const jpStartPosition3 = {
  left: "2%",
  top: "73%",
}

const jpStartPosition4 = {
  left: "2%",
  top: "77%",
}

const japanFleetUnits = [
  {
    name: GlobalUnitsModel.Carrier.AKAGI,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
  },
  {
    name: GlobalUnitsModel.Carrier.KAGA,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
  },
  {
    name: GlobalUnitsModel.Carrier.HIRYU,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
  },
  {
    name: GlobalUnitsModel.Carrier.SORYU,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
  },
]

const usFleetUnits = [
  {
    name: GlobalUnitsModel.Carrier.ENTERPRISE,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
  },
  {
    name: GlobalUnitsModel.Carrier.HORNET,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
  },
  {
    name: GlobalUnitsModel.Carrier.YORKTOWN,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
  },
  {
    name: GlobalUnitsModel.Carrier.MIDWAY,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
  },
]
const japanAirUnits = [
  {
    name: "Akagi-A6M-2b-1",
    longName: "Japanese A6M-2b (Akagi) 1",
    position: jpStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Akagi-A6M-2b-2",
    longName: "Japanese A6M-2b (Akagi) 2",
    position: jpStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Akagi-D3A-1",
    longName: "Japanese D3A-1 (Akagi)",
    position: jpStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Akagi-B5N-2",
    longName: "Japanese B5N-2 (Akagi)",
    position: jpStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/akagi-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.AKAGI,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },

  {
    name: "Kaga-A6M-2b-1",
    longName: "Japanese A6M-2b (Kaga) 1",
    position: jpStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Kaga-A6M-2b-2",
    longName: "Japanese A6M-2b (Kaga) 2",
    position: jpStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Kaga-D3A-1",
    longName: "Japanese D3A-1 (Kaga)",
    position: jpStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Kaga-B5N-2",
    longName: "Japanese B5N-2 (Kaga)",
    position: jpStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },

  // HIRYU AIR UNITS
  {
    name: "Hiryu-A6M-2b-1",
    longName: "Japanese A6M-2b (Hiryu) 1",
    position: jpStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Hiryu-A6M-2b-2",
    longName: "Japanese A6M-2b (Hiryu) 2",
    position: jpStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Hiryu-D3A-1",
    longName: "Japanese D3A-1 (Hiryu)",
    position: jpStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Hiryu-B5N-2",
    longName: "Japanese B5N-2 (Hiryu)",
    position: jpStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },

  // SORYU AIR UNITS
  {
    name: "Soryu-A6M-2b-1",
    longName: "Japanese A6M-2b (Soryu) 1",
    position: jpStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Soryu-A6M-2b-2",
    longName: "Japanese A6M-2b (Soryu) 2",
    position: jpStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Soryu-D3A-1",
    longName: "Japanese D3A-1 (Soryu)",
    position: jpStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Soryu-B5N-2",
    longName: "Japanese B5N-2 (Soryu)",
    position: jpStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    side: GlobalUnitsModel.Side.JAPAN,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },
]

const usStartPosition1 = {
  left: "90%",
  top: "65%",
}

const usStartPosition2 = {
  left: "90%",
  top: "69%",
}

const usStartPosition3 = {
  left: "90%",
  top: "73%",
}

const usStartPosition4 = {
  left: "90%",
  top: "77%",
}
const usStartPosition5 = {
  left: "90%",
  top: "81%",
}
const usStartPosition6 = {
  left: "90%",
  top: "85%",
}
const usStartPosition7 = {
  left: "90%",
  top: "89%",
}

const usMidwayStartPosition1 = {
  left: "95%",
  top: "25%",
}

const usMidwayStartPosition2 = {
  left: "95%",
  top: "29%",
}

const usMidwayStartPosition3 = {
  left: "95%",
  top: "33%",
}

const usMidwayStartPosition4 = {
  left: "95%",
  top: "37%",
}
const usMidwayStartPosition5 = {
  left: "95%",
  top: "41%",
}
const usMidwayStartPosition6 = {
  left: "95%",
  top: "45%",
}
const usMidwayStartPosition7 = {
  left: "95%",
  top: "49%",
}
const usAirUnits = [
  {
    name: "Enterprise-F4F4-1",
    longName: "US F4F-4 (Enterprise) 1",
    position: usStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/enterprise-f4f-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.ENTERPRISE,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Enterprise-F4F4-2",
    longName: "US F4F-4 (Enterprise) 2",
    position: usStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/enterprise-f4f-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.ENTERPRISE,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Enterprise-TBD1",
    longName: "US TBD1 (Enterprise)",
    position: usStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/enterprise-tbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.ENTERPRISE,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Enterprise-SBD3-1",
    longName: "US SBD3 (Enterprise) 1",
    position: usStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/enterprise-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.ENTERPRISE,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Enterprise-SBD3-2",
    longName: "US SBD3 (Enterprise) 2",
    position: usStartPosition5,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/enterprise-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.ENTERPRISE,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  // HORNET AIR UNITS
  {
    name: "Hornet-F4F4-1",
    longName: "US F4F-4 (Hornet) 1",
    position: usStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hornet-f4f-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HORNET,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Hornet-F4F4-2",
    longName: "US F4F-4 (Hornet) 2",
    position: usStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hornet-f4f-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HORNET,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Hornet-TBD1",
    longName: "US TBD1 (Hornet)",
    position: usStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hornet-tbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HORNET,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Hornet-SBD3-1",
    longName: "US SBD3 (Hornet) 1",
    position: usStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hornet-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HORNET,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Hornet-SBD3-2",
    longName: "US SBD3 (Hornet) 2",
    position: usStartPosition5,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hornet-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HORNET,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },

  // YORKTOWN AIR UNITS
  {
    name: "Yorktown-F4F4-1",
    longName: "US F4F-4 (Yorktown) 1",
    position: usStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/yorktown-f4f-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.YORKTOWN,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Yorktown-F4F4-2",
    longName: "US F4F-4 (Yorktown) 2",
    position: usStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/yorktown-f4f-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.YORKTOWN,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Yorktown-TBD1",
    longName: "US TBD1 (Yorktown)",
    position: usStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/yorktown-tbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.YORKTOWN,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Yorktown-SBD3-1",
    longName: "US SBD3 (Yorktown) 1",
    position: usStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/yorktown-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.YORKTOWN,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },
  {
    name: "Yorktown-SBD3-2",
    longName: "US SBD3 (Yorktown) 2",
    position: usStartPosition5,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/yorktown-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.YORKTOWN,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: true,
      steps: 2,
    },
  },

  // MIDWAY AIR UNITS
  {
    name: "Midway-F4F3",
    longName: "US F4F-3 (Midway)",
    position: usMidwayStartPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-f4f-back.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 3,
      attack: false,
      diveBomber: false,
      steps: 1,
    },
  },
  {
    name: "Midway-F2A-3",
    longName: "US F2A-3 (Midway)",
    position: usMidwayStartPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-f2a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 1,
      movement: 2,
      attack: false,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Midway-SBD-2",
    longName: "US SBD-2 (Midway)",
    position: usMidwayStartPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-sbd-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },
  {
    name: "Midway-SB2U-3",
    longName: "US SB2U-3 (Midway)",
    position: usMidwayStartPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-sb2u-back.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 1,
      movement: 2,
      attack: true,
      diveBomber: false,
      steps: 1,
    },
  },
  {
    name: "Midway-TBF-1",
    longName: "US TBF-1 (Midway)",
    position: usMidwayStartPosition5,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-tbf-back.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 2,
      movement: 2,
      attack: true,
      diveBomber: false,
      steps: 1,
    },
  },
  {
    name: "Midway-B26-B",
    longName: "US B26-B (Midway)",
    position: usMidwayStartPosition6,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-b26-back.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 1,
      movement: 3,
      attack: true,
      diveBomber: false,
      steps: 1,
    },
  },
  {
    name: "Midway-B17-E",
    longName: "US B17-E (Midway)",
    position: usMidwayStartPosition7,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/midway-b17-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.MIDWAY,
    side: GlobalUnitsModel.Side.US,
    aircraftUnit: {
      strength: 0,
      movement: 3,
      attack: true,
      diveBomber: false,
      steps: 2,
    },
  },
]

const jpSGPosition1 = {
  left: "42.8%",
  top: "64%",
}
const jpSGPosition2 = {
  left: "42.8%",
  top: "68.2%",
}
const jpSGPosition3 = {
  left: "42.8%",
  top: "72.5%",
}
const jpSGPosition4 = {
  left: "42.8%",
  top: "77.0%",
}
const jpSGPosition5 = {
  left: "42.8%",
  top: "81.5%",
}
const jpSGPosition6 = {
  left: "42.8%",
  top: "86.0%",
}
const jpSGPosition7 = {
  left: "42.8%",
  top: "90.5%",
}

const japanStrikeGroups = [
  {
    name: "JP-SG1",
    longName: "Strike Group 1",
    position: jpSGPosition1,
    image: "/images/aircounters/ijnStrike1.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "JP-SG2",
    longName: "Strike Group 2",
    position: jpSGPosition2,
    image: "/images/aircounters/ijnStrike2.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_1,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "JP-SG3",
    longName: "Strike Group 3",
    position: jpSGPosition3,
    image: "/images/aircounters/ijnStrike3.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "JP-SG4",
    longName: "Strike Group 4",
    position: jpSGPosition4,
    image: "/images/aircounters/ijnStrike4.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_3,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "JP-SG5",
    longName: "Strike Group 5",
    position: jpSGPosition5,
    image: "/images/aircounters/ijnStrike5.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_4,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "JP-SG6",
    longName: "Strike Group 6",
    position: jpSGPosition6,
    image: "/images/aircounters/ijnStrike6.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_5,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "JP-SG7",
    longName: "Strike Group 7",
    position: jpSGPosition7,
    image: "/images/aircounters/ijnStrike7.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_6,
    side: GlobalUnitsModel.Side.JAPAN,
    units: new Array(), // list of air units in this strike group
  },
]

const usSGPosition1 = {
  left: "95%",
  top: "63%",
}
const usSGPosition2 = {
  left: "95%",
  top: "67.5%",
}

const usSGPosition3 = {
  left: "95%",
  top: "72.0%",
}
const usSGPosition4 = {
  left: "95%",
  top: "76.5%",
}
const usSGPosition5 = {
  left: "95%",
  top: "81.0%",
}
const usSGPosition6 = {
  left: "95%",
  top: "85.5%",
}
const usSGPosition7 = {
  left: "95%",
  top: "89.5%",
}
const usStrikeGroups = [
  {
    name: "US-SG1",
    longName: "Strike Group 1",
    position: usSGPosition1,
    image: "/images/aircounters/usStrike1.png",
    // image: "/images/aircounters/USN-SG1.jpg",

    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "US-SG2",
    longName: "Strike Group 2",
    position: usSGPosition2,
    image: "/images/aircounters/usStrike2.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "US-SG3",
    longName: "Strike Group 3",
    position: usSGPosition3,
    image: "/images/aircounters/usStrike3.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_2,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "US-SG4",
    longName: "Strike Group 4",
    position: usSGPosition4,
    image: "/images/aircounters/usStrike4.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_3,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "US-SG5",
    longName: "Strike Group 5",
    position: usSGPosition5,
    image: "/images/aircounters/usStrike5.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_4,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "US-SG6",
    longName: "Strike Group 6",
    position: usSGPosition6,
    image: "/images/aircounters/usStrike6.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_5,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
  {
    name: "US-SG7",
    longName: "Strike Group 7",
    position: usSGPosition7,
    image: "/images/aircounters/usStrike7.png",
    width: "2.1%",
    box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_6,
    side: GlobalUnitsModel.Side.US,
    units: new Array(), // list of air units in this strike group
  },
]
function loadFleetUnits() {
  for (const unit of japanFleetUnits) {
    GlobalUnitsModel.jpFleetUnits.set(
      unit.name,
      new FleetUnit(unit.name, unit.taskForce, 0, GlobalUnitsModel.Side.JAPAN)
    )
    GlobalUnitsModel.carrierSideMap.set(unit.name, GlobalUnitsModel.Side.JAPAN)
  }
  for (const unit of usFleetUnits) {
    GlobalUnitsModel.usFleetUnits.set(unit.name, new FleetUnit(unit.name, unit.taskForce, 0, GlobalUnitsModel.Side.US))
    GlobalUnitsModel.carrierSideMap.set(unit.name, GlobalUnitsModel.Side.US)
  }
}

function loadStrikeGroups(controller, counters) {
  const location = GlobalUnitsModel.AirBox.OFFBOARD
  for (const group of japanStrikeGroups) {
    const sgu = new StrikeGroupUnit(
      group.name,
      group.longName,
      group.position,
      group.image,
      group.width,
      location,
      group.box,
      GlobalUnitsModel.Side.JAPAN,
      {
        left: 500,
        top: 50,
      },
      false // moved
    )

    GlobalUnitsModel.jpStrikeGroups.set(group.box, sgu)
    counters.set(group.name, sgu)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, sgu)
  }
  for (const group of usStrikeGroups) {
    const sgu = new StrikeGroupUnit(
      group.name,
      group.longName,
      group.position,
      group.image,
      group.width,
      location,
      group.box,
      GlobalUnitsModel.Side.US,
      {
        left: 500,
        top: 50,
      },
      false // moved
    )

    GlobalUnitsModel.usStrikeGroups.set(group.box, sgu)
    counters.set(group.name, sgu)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, sgu)
  }
}

function loadAirCounters(controller, counters) {
  for (const unit of japanAirUnits) {
    const aircraftUnit = new AircraftUnit(
      unit.name,
      unit.aircraftUnit.strength,
      unit.aircraftUnit.movement,
      unit.aircraftUnit.attack,
      unit.aircraftUnit.diveBomber,
      unit.aircraftUnit.steps,
      false,
      false
    )
    const airUnitCounter = new AirUnit(
      unit.name,
      unit.longName,
      unit.position,
      unit.offsets,
      unit.image,
      unit.width,
      unit.carrier,
      unit.side,
      aircraftUnit
    )

    counters.set(unit.name, airUnitCounter)

    GlobalUnitsModel.jpAirUnits.set(unit.name, aircraftUnit)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, airUnitCounter)
    controller.addAirUnitToJapaneseCarrier(unit.carrier, airUnitCounter)
    controller.setCounters(counters)
  }

  for (const unit of usAirUnits) {
    const aircraftUnit = new AircraftUnit(
      unit.name,
      unit.aircraftUnit.strength,
      unit.aircraftUnit.movement,
      unit.aircraftUnit.attack,
      unit.aircraftUnit.diveBomber,
      unit.aircraftUnit.steps,
      false,
      false
    )
    const airUnitCounter = new AirUnit(
      unit.name,
      unit.longName,
      unit.position,
      unit.offsets,
      unit.image,
      unit.width,
      unit.carrier,
      unit.side,
      aircraftUnit
    )
    counters.set(unit.name, airUnitCounter)

    GlobalUnitsModel.usAirUnits.set(unit.name, aircraftUnit)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, airUnitCounter)
    controller.addAirUnitToUSCarrier(unit.carrier, airUnitCounter)
    controller.setCounters(counters)
  }
}

export default loadCounters
