import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalInit from "./model/GlobalInit"
import GlobalGameState from "./model/GlobalGameState"
import { flatHexToPixel, convertCoords} from  "./components/HexUtils"

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
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_HANGER,
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
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_HANGER,
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
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    name: "Soryu-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-B5N-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    name: "Soryu-A6M-2b-2",
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
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER,
  },
  {
    name: "Enterprise-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER,
    nextAction: true
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
    boxName: GlobalUnitsModel.AirBox.US_HORNET_HANGER,
  },
  {
    name: "Hornet-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_HORNET_HANGER,
    nextAction: true
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
    boxName: GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER,
  },
  {
    name: "Yorktown-TBD1",
    boxName: GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER,
    nextAction: true
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
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK
  },
  {
    name: "Midway-SB2U-3",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_HANGER
  },
  {
    name: "Midway-TBF-1",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK
  },
  {
    name: "Midway-B26-B",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK
  },
  {
    name: "Midway-B17-E",
    boxName: GlobalUnitsModel.AirBox.US_MIDWAY_HANGER,
    nextAction: true
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

export function createMapUpdateForFleet(controller, name, side) {

  const location = controller.getFleetLocation(name, side)

  console.log(">>> FLEET location = ", location)

  let otherName
  if (name === "CSF") {
    otherName = "CSF-JPMAP"
  }else if (name === "1AF") {
    otherName = "1AF-USMAP"
  }
  return createFleetUpdate(otherName, location.currentHex.q, location.currentHex.r)
}

function createFleetUpdate(name, q, r) {
  let hex = {
    q: q,
    r: r
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
  }
}
export function getFleetUnitUpdateUS(name) {
   return createFleetUpdate(name, 7, 1)
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
    (b) => b.carriers.includes(carrier) && b.name.includes("FLIGHT")
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
