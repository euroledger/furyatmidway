import BaseUnit from "./components/buttons/mapobjects/BaseUnit"
import AirUnit from "./components/buttons/mapobjects/AirUnit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import FleetUnit from "./model/FleetUnit"
import AircraftUnit from "./model/AircraftUnit"

function loadCounters(controller) {
  let counters = new Map()

  // 1AF Counter
  let position = {
    hexCoords: {},
    left: 102,
    top: 117,
  }

  counters.set(
    "1AF",
    new BaseUnit(
      "1AF",
      "Japanese 1AF",
      position,
      { x: 50, y: 58 }, // offsets
      "/images/fleetcounters/1AF.png",
      "3.0%"
    )
  )

  position = {
    hexCoords: {},
    left: 602,
    top: 117,
  }

  counters.set(
    "CSF",
    new BaseUnit(
      "CSF",
      "US Carrier Strike Force",
      position,
      { x: -3, y: 88 }, // offsets
      "/images/fleetcounters/CSF.png",
      "3.0%"
    )
  )

  GlobalUnitsModel.jpFleetUnits.set("1AF", new FleetUnit("1AF", false))
  GlobalUnitsModel.jpFleetUnits.set("MIF", new FleetUnit("MIF", false))
  GlobalUnitsModel.jpFleetUnits.set("DMCV", new FleetUnit("DMCV", false))

  GlobalUnitsModel.usFleetUnits.set("CSF", new FleetUnit("CSF", false))
  GlobalUnitsModel.usFleetUnits.set("DMCV", new FleetUnit("DMCV", false))

  loadAirCounters(controller, counters)
  return counters
}

const startPosition1 = {
  left: "2%",
  top: "65%",
}

const startPosition2 = {
  left: "2%",
  top: "69%",
}

const startPosition3 = {
  left: "2%",
  top: "73%",
}

const startPosition4 = {
  left: "2%",
  top: "77%",
}
const airUnits = [
  {
    name: "Akagi-A6M-2b-1",
    longName: "Japanese A6M-2b (Akagi) 1",
    position: startPosition1,
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
    position: startPosition2,
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
    position: startPosition3,
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
    position: startPosition4,
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

  {
    name: "Kaga-A6M-2b-1",
    longName: "Japanese A6M-2b (Kaga) 1",
    position: startPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Kaga-A6M-2b-2",
    longName: "Japanese A6M-2b (Kaga) 2",
    position: startPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Kaga-D3A-1",
    longName: "Japanese D3A-1 (Kaga)",
    position: startPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
    },
  },
  {
    name: "Kaga-B5N-2",
    longName: "Japanese B5N-2 (Kaga)",
    position: startPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/kaga-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.KAGA,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
    },
  },

  // HIRYU AIR UNITS
  {
    name: "Hiryu-A6M-2b-1",
    longName: "Japanese A6M-2b (Hiryu) 1",
    position: startPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Hiryu-A6M-2b-2",
    longName: "Japanese A6M-2b (Hiryu) 2",
    position: startPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Hiryu-D3A-1",
    longName: "Japanese D3A-1 (Hiryu)",
    position: startPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
    },
  },
  {
    name: "Hiryu-B5N-2",
    longName: "Japanese B5N-2 (Hiryu)",
    position: startPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/hiryu-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.HIRYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
    },
  },

  // SORYU AIR UNITS
  {
    name: "Soryu-A6M-2b-1",
    longName: "Japanese A6M-2b (Soryu) 1",
    position: startPosition1,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Soryu-A6M-2b-2",
    longName: "Japanese A6M-2b (Soryu) 2",
    position: startPosition2,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-a6m-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: false,
      diveBomber: false,
    },
  },
  {
    name: "Soryu-D3A-1",
    longName: "Japanese D3A-1 (Soryu)",
    position: startPosition3,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-d3a-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: true,
    },
  },
  {
    name: "Soryu-B5N-2",
    longName: "Japanese B5N-2 (Soryu)",
    position: startPosition4,
    offsets: { x: 66, y: 80 },
    image: "/images/aircounters/soryu-b5n-front.png",
    width: "2.1%",
    carrier: GlobalUnitsModel.Carrier.SORYU,
    aircraftUnit: {
      strength: 3,
      movement: 3,
      attack: true,
      diveBomber: false,
    },
  },
]

function loadAirCounters(controller, counters) {
  for (const unit of airUnits) {
    const airUnitCounter = new AirUnit(
      unit.name,
      unit.longName,
      unit.position,
      unit.offsets,
      unit.image,
      unit.width,
      unit.carrier
    )
    counters.set(unit.name, airUnitCounter)

    GlobalUnitsModel.jpAirUnits.set(
      unit.name,
      new AircraftUnit(
        unit.name,
        unit.aircraftUnit.strength,
        unit.aircraftUnit.movement,
        unit.aircraftUnit.attack,
        unit.aircraftUnit.diveBomber
      )
    )
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, airUnitCounter)
    controller.addAirUnitToCarrier(unit.carrier, airUnitCounter)
    controller.setCounters(counters)
  }
}

export default loadCounters
