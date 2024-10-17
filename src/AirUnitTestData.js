import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalInit from "./model/GlobalInit"
import GlobalGameState from "./model/GlobalGameState"
import { flatHexToPixel, convertCoords } from "./components/HexUtils"
import { faL } from "@fortawesome/free-solid-svg-icons"

export const airUnitDataJapan = [
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    name: "Akagi-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    name: "Akagi-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR,
    name: "Akagi-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    name: "Akagi-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    name: "Kaga-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    name: "Kaga-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
    name: "Kaga-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    name: "Kaga-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD2_CAP,
    name: "Hiryu-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR,
    name: "Hiryu-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR,
    name: "Hiryu-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR,
    name: "Hiryu-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGAR,
    name: "Soryu-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGAR,
    name: "Soryu-A6M-2b-2",
    nextAction: true,
  },
]

export const airUnitDataUS = [
  {
    name: "Enterprise-F4F4-1",
    boxName: GlobalUnitsModel.AirBox.US_TF16_CAP,
  },
  {
    name: "Enterprise-F4F4-2",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK,
  },
  {
    name: "Enterprise-SBD3-1",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK,
  },
  {
    name: "Enterprise-SBD3-2",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
  },
  {
    name: "Enterprise-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
    nextAction: true,
  },
  {
    name: "Hornet-F4F4-1",
    boxName: GlobalUnitsModel.AirBox.US_TF16_CAP,
  },
  {
    name: "Hornet-F4F4-2",
    boxName: GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK,
  },
  {
    name: "Hornet-SBD3-1",
    boxName: GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK,
  },
  {
    name: "Hornet-SBD3-2",
    boxName: GlobalUnitsModel.AirBox.US_HORNET_HANGAR,
  },
  {
    name: "Hornet-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_HORNET_HANGAR,
    nextAction: true,
  },
  {
    name: "Yorktown-F4F4-1",
    boxName: GlobalUnitsModel.AirBox.US_TF17_CAP,
  },
  {
    name: "Yorktown-F4F4-2",
    boxName: GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK,
  },
  {
    name: "Yorktown-SBD3-1",
    boxName: GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK,
  },
  {
    name: "Yorktown-SBD3-2",
    boxName: GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR,
  },
  {
    name: "Yorktown-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR,
    nextAction: true,
  },
  {
    name: "Midway-F4F3",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_CAP,
  },
  {
    name: "Midway-F2A-3",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_CAP,
  },
  {
    name: "Midway-SBD-2",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK,
  },
  {
    name: "Midway-SB2U-3",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR,
  },
  {
    name: "Midway-TBF-1",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK,
  },
  {
    name: "Midway-B26-B",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK,
  },
  {
    name: "Midway-B17-E",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR,
    nextAction: true,
  },
]

export const airUnitsToStrikeGroupsUS = [
  {
    name: "Yorktown-SBD3-1",
    boxName: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
  },
  {
    name: "Yorktown-F4F4-2",
    boxName: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
  },
  {
    name: "Enterprise-SBD3-1",
    boxName: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
  },
  {
    name: "Enterprise-F4F4-2",
    boxName: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
  },
  {
    name: "Enterprise-SBD3-2",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK,
  },
  {
    name: "Enterprise-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK,
  },
  {
    name: "Hornet-SBD3-1",
    boxName: GlobalUnitsModel.AirBox.US_STRIKE_BOX_2,
  },
  {
    name: "Hornet-F4F4-2",
    boxName: GlobalUnitsModel.AirBox.US_STRIKE_BOX_2,
  },
  {
    name: "Hornet-SBD3-2",
    boxName: GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK,
  },
]

export const strikeGroupsUS = [
  {
    name: "US-SG1",

  }
]

export function calcTestDataUS(unit, controller) {
  let carrier = controller.getCarrierForAirUnit(unit.name)
  if (carrier != GlobalGameState.US_CARRIERS[GlobalGameState.currentCarrier]) {
    return undefined
  }
  return {
    name: unit.name,
    boxName: unit.boxName,
    nextAction: unit.nextAction,
  }
}

export function calcStrikeDataJapan(unit) {
  const update = {
    name: unit.name,
    boxName: unit.boxName,
  }
  return update
}

export function calcStrikeDataUS(unit) { 

  const update = {
    name: unit.name,
    boxName: unit.boxName,
    nextAction: unit.nextAction,
  }
  return update
}

export function createMapUpdateForFleet(controller, name, side) {
  const location = controller.getFleetLocation(name, side)

  let otherName
  if (name === "CSF") {
    otherName = "CSF-JPMAP"
  } else if (name === "1AF") {
    otherName = "1AF-USMAP"
  }
  return createFleetUpdate(otherName, location.currentHex.q, location.currentHex.r)
}

function convertHex(name, q, r) {
  let hex = {
    q: q,
    r: r,
  }

  let { x, y } = flatHexToPixel({ q: hex.q, r: hex.r })

  // 2. set row and col from this q, r update
  const { q1, r1 } = convertCoords(hex.q, hex.r)

  let cHex = {
    q: hex.q,
    r: hex.r,
    x: x,
    y: y,
    row: q1,
    col: r1,
  }

  return {
    name,
    position: {
      currentHex: cHex,
    },
    loading: false
  }
}
export function createFleetUpdate(name, q, r) {
  return convertHex(name, q, r)
}

export function createStrikeGroupUpdate(name, q, r) {
  return convertHex(name, q, r)
}

export function getFleetUnitUpdateUS(name) {
  return createFleetUpdate(name, 6, 1)
}

export function calcRandomJapanTestData(unit, controller) {
  let carrier = controller.getCarrierForAirUnit(unit.name)
  if (carrier != GlobalGameState.JAPAN_CARRIERS[GlobalGameState.currentCarrier]) {
    return undefined
  }
  let boxes = controller.getBoxesForJapaneseCarrier(carrier, false)

  // 1. if this is an attack aircraft, remove CAP from list
  const aircraftUnit = controller.getJapanAirUnit(unit.name)

  if (aircraftUnit.attack) {
    boxes = boxes.filter((b) => !b.includes("CAP"))
  }

  // 2. if any box is full, remove that box from list
  boxes = boxes.filter((b) => controller.getAllFreeZonesInBox(b).length !== 0)

  // 3. If the flight deck has empty slots, remove hangar from list
  const flightDeckAirBox = JapanAirBoxOffsets.filter(
    (b) => b.carriers && b.carriers.includes(carrier) && b.name.includes("FLIGHT")
  )[0]

  const fdBoxes = controller.getAllFreeZonesInBox(flightDeckAirBox.name).length

  if (fdBoxes > 0) {
    boxes = boxes.filter((b) => !b.includes("HANGAR"))
  }

  // 4. Pick random box from the list
  const rn = Math.floor(Math.random() * boxes.length)

  // 5. Add air unit to box
  let nextAction = unit.nextAction

  return {
    name: unit.name,
    boxName: boxes[rn],
    nextAction: nextAction,
  }
}
