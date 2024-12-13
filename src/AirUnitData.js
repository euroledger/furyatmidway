import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import { flatHexToPixel, convertCoords } from "./components/HexUtils"
import { faL } from "@fortawesome/free-solid-svg-icons"
import HexCommand from "./commands/HexCommand"

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

const US_TF16_CAP = 0
const US_ENTERPRISE_FLIGHT_DECK = 1
const US_ENTERPRISE_HANGAR = 2
const US_HORNET_FLIGHT_DECK = 3
const US_HORNET_HANGAR = 4
const US_TF17_CAP = 5
const US_YORKTOWN_FLIGHT_DECK = 6
const US_YORKTOWN_HANGAR = 7

export const carrierBoxArray = [
  GlobalUnitsModel.AirBox.US_TF16_CAP,
  GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK,
  GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
  GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK,
  GlobalUnitsModel.AirBox.US_HORNET_HANGAR,
  GlobalUnitsModel.AirBox.US_TF17_CAP,
  GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK,
  GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR,
]

function getRandomElementFrom(items) {
  var item = items[Math.floor(Math.random() * items.length)]

  return item
}

let enterpriseFlightDeckSlotsLeft = 2
let hornetFlightDeckSlotsLeft = 2
let yorktownFlightDeckSlotsLeft = 2

export function generateRandomUSAirSetup() {
  // Enterprise Fighters
  const ef1 = getRandomElementFrom([US_TF16_CAP, US_ENTERPRISE_FLIGHT_DECK])
  if (ef1 === US_ENTERPRISE_FLIGHT_DECK) {
    enterpriseFlightDeckSlotsLeft--
  }
  // console.log(
  //   "ENTERPRISE FIGHTER 1 GOES TO",
  //   carrierBoxArray[ef1],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   enterpriseFlightDeckSlotsLeft
  // )

  let ef2
  if (ef1 === US_ENTERPRISE_FLIGHT_DECK) {
    ef2 = getRandomElementFrom([US_TF16_CAP, US_ENTERPRISE_HANGAR]) // avoid both fighters on flight deck at start - bonkers
  } else {
    ef2 = getRandomElementFrom([US_TF16_CAP, US_ENTERPRISE_FLIGHT_DECK])
  }
  if (ef2 === US_ENTERPRISE_FLIGHT_DECK) {
    enterpriseFlightDeckSlotsLeft--
  }
  // console.log(
  //   "ENTERPRISE FIGHTER 2 GOES TO",
  //   carrierBoxArray[ef2],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   enterpriseFlightDeckSlotsLeft
  // )

  // Enterprise DiveBombers
  let ed1
  if (enterpriseFlightDeckSlotsLeft === 0) {
    ed1 = US_ENTERPRISE_HANGAR
  } else {
    ed1 = getRandomElementFrom([US_ENTERPRISE_FLIGHT_DECK, US_ENTERPRISE_HANGAR])
    if (ed1 === US_ENTERPRISE_FLIGHT_DECK) {
      enterpriseFlightDeckSlotsLeft--
    }
  }
  // console.log(
  //   "ENTERPRISE DB 1 GOES TO",
  //   carrierBoxArray[ed1],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   enterpriseFlightDeckSlotsLeft
  // )
  let ed2
  if (enterpriseFlightDeckSlotsLeft === 0) {
    ed2 = US_ENTERPRISE_HANGAR
  } else {
    if (enterpriseFlightDeckSlotsLeft === 2) {
      ed2 = US_ENTERPRISE_FLIGHT_DECK
    } else {
      ed2 = getRandomElementFrom([US_ENTERPRISE_FLIGHT_DECK, US_ENTERPRISE_HANGAR])
      if (ed2 === US_ENTERPRISE_FLIGHT_DECK) {
        enterpriseFlightDeckSlotsLeft--
      }
    }
  }
  // console.log(
  //   "ENTERPRISE DB 2 GOES TO",
  //   carrierBoxArray[ed2],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   enterpriseFlightDeckSlotsLeft
  // )

  // Enterprise TorpedoPlanes
  let et1
  if (enterpriseFlightDeckSlotsLeft === 0) {
    et1 = US_ENTERPRISE_HANGAR
  } else {
    et1 = US_ENTERPRISE_FLIGHT_DECK
  }

  // console.log("ENTERPRISE TB GOES TO", carrierBoxArray[et1])

  // Hornet Fighters
  const hf1 = getRandomElementFrom([US_TF16_CAP, US_HORNET_FLIGHT_DECK])
  if (hf1 === US_HORNET_FLIGHT_DECK) {
    hornetFlightDeckSlotsLeft--
  }

  // console.log(
  //   "HORNET FIGHTER 1 GOES TO",
  //   carrierBoxArray[hf1],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   hornetFlightDeckSlotsLeft
  // )
  let hf2
  if (hf1 === US_HORNET_FLIGHT_DECK) {
    hf2 = getRandomElementFrom([US_TF16_CAP, US_HORNET_HANGAR]) // avoid both fighters on flight deck at start - bonkers
  } else {
    hf2 = getRandomElementFrom([US_TF16_CAP, US_HORNET_FLIGHT_DECK])
  }
  if (hf2 === US_HORNET_FLIGHT_DECK) {
    hornetFlightDeckSlotsLeft--
  }
  // console.log(
  //   "HORNET FIGHTER 2 GOES TO",
  //   carrierBoxArray[hf2],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   hornetFlightDeckSlotsLeft
  // )

  // Hornet DiveBombers
  let hd1
  if (hornetFlightDeckSlotsLeft === 0) {
    hd1 = US_HORNET_HANGAR
  } else {
    hd1 = getRandomElementFrom([US_HORNET_FLIGHT_DECK, US_HORNET_HANGAR])
    if (hd1 === US_HORNET_FLIGHT_DECK) {
      hornetFlightDeckSlotsLeft--
    }
  }
  // console.log("HORNET DB 1 GOES TO", carrierBoxArray[hd1], " => FLIGHT DECK SLOTS LEFT=", hornetFlightDeckSlotsLeft)
  let hd2
  if (hornetFlightDeckSlotsLeft === 0) {
    hd2 = US_HORNET_HANGAR
  } else {
    if (hornetFlightDeckSlotsLeft === 2) {
      hd2 = US_HORNET_FLIGHT_DECK
    } else {
      hd2 = getRandomElementFrom([US_HORNET_FLIGHT_DECK, US_HORNET_HANGAR])
      if (hd2 === US_HORNET_FLIGHT_DECK) {
        hornetFlightDeckSlotsLeft--
      }
    }
  }
  // console.log("HORNET DB 2 GOES TO", carrierBoxArray[hd2], " => FLIGHT DECK SLOTS LEFT=", hornetFlightDeckSlotsLeft)
  // Hornet TorpedoPlanes
  let ht1
  if (hornetFlightDeckSlotsLeft === 0) {
    ht1 = US_HORNET_HANGAR
  } else {
    ht1 = US_HORNET_FLIGHT_DECK
  }

  // console.log("HORNET TB GOES TO", carrierBoxArray[ht1])
  // Yorktown Fighters
  const yf1 = getRandomElementFrom([US_TF17_CAP, US_YORKTOWN_FLIGHT_DECK])
  if (yf1 === US_YORKTOWN_FLIGHT_DECK) {
    yorktownFlightDeckSlotsLeft--
  }
  // console.log(
  //   "YORKTOWN FIGHTER 1 GOES TO",
  //   carrierBoxArray[yf1],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   yorktownFlightDeckSlotsLeft
  // )
  let yf2
  if (yf1 === US_YORKTOWN_FLIGHT_DECK) {
    yf2 = getRandomElementFrom([US_TF17_CAP, US_YORKTOWN_HANGAR]) // avoid both fighters on flight deck at start - bonkers
  } else {
    yf2 = getRandomElementFrom([US_TF17_CAP, US_YORKTOWN_FLIGHT_DECK])
  }
  if (yf2 === US_YORKTOWN_FLIGHT_DECK) {
    yorktownFlightDeckSlotsLeft--
  }
  // console.log(
  //   "YORKTOWN FIGHTER 2 GOES TO",
  //   carrierBoxArray[yf2],
  //   " => FLIGHT DECK SLOTS LEFT=",
  //   yorktownFlightDeckSlotsLeft
  // )

  // Yorktown DiveBombers
  let yd1
  if (yorktownFlightDeckSlotsLeft === 0) {
    yd1 = US_YORKTOWN_HANGAR
  } else {
    yd1 = getRandomElementFrom([US_YORKTOWN_FLIGHT_DECK, US_YORKTOWN_HANGAR])
    if (yd1 === US_YORKTOWN_FLIGHT_DECK) {
      yorktownFlightDeckSlotsLeft--
    }
  }
  // console.log("YORKTOWN DB 1 GOES TO", carrierBoxArray[yd1], " => FLIGHT DECK SLOTS LEFT=", yorktownFlightDeckSlotsLeft)
  let yd2
  if (yorktownFlightDeckSlotsLeft === 0) {
    yd2 = US_YORKTOWN_HANGAR
  } else {
    if (yorktownFlightDeckSlotsLeft === 2) {
      yd2 = US_YORKTOWN_FLIGHT_DECK
    } else {
      yd2 = getRandomElementFrom([US_YORKTOWN_FLIGHT_DECK, US_YORKTOWN_HANGAR])
      if (yd2 === US_YORKTOWN_FLIGHT_DECK) {
        yorktownFlightDeckSlotsLeft--
      }
    }
  }

  // console.log("YORKTOWN DB 2 GOES TO", carrierBoxArray[yd2], " => FLIGHT DECK SLOTS LEFT=", yorktownFlightDeckSlotsLeft)

  // Yorktown TorpedoPlanes
  let yt1
  if (yorktownFlightDeckSlotsLeft === 0) {
    yt1 = US_YORKTOWN_HANGAR
  } else {
    yt1 = US_YORKTOWN_FLIGHT_DECK
  }
  // console.log("YORKTOWN TB GOES TO", carrierBoxArray[yt1])
  return [
    [ef1, ef2, ed1, ed2, et1],
    [hf1, hf2, hd1, hd2, ht1],
    [yf1, yf2, yd1, yd2, yt1],
  ]
}

export const USAirStrategies = []

export const tf17carrierBoxArray = []

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
  },
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

export function createRemoveFleetUpdate(side) {
  let name
  if (side === GlobalUnitsModel.Side.JAPAN) {
    name = "1AF"
  } else {
    name = "CSF"
  }
  const index = GlobalInit.controller.getNextAvailableFleetBox(side)
  const location = {
    boxName: HexCommand.FLEET_BOX,
    boxIndex: index,
  }
  const update = {
    name,
    position: {
      currentHex: location,
    },
    loading: false,
    side,
  }
  return update
}

export function createMapUpdateForFleet(controller, name, side) {
  const location = controller.getFleetLocation(name, side)

  let otherName
  if (name === "CSF") {
    otherName = "CSF-JPMAP"
    side = GlobalUnitsModel.Side.JAPAN
  } else if (name === "1AF") {
    otherName = "1AF-USMAP"
    side = GlobalUnitsModel.Side.US
  } else if (name === "IJN-DMCV") {
    otherName = "IJN-DMCV-USMAP"
    side = GlobalUnitsModel.Side.US
  } else if (name === "US-DMCV") {
    otherName = "US-DMCV-JPMAP"
    side = GlobalUnitsModel.Side.JAPAN
  } else if (name === "MIF") {
    otherName = "MIF-USMAP"
    side = GlobalUnitsModel.Side.US
  }
  if (location === undefined) {
    return null
  }
  if (location.boxName == HexCommand.FLEET_BOX) {
    return {
      name: otherName,
      position: {
        currentHex: location,
      },
      loading: false,
      side,
    }
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
    loading: false,
  }
}
export function createFleetUpdate(name, q, r) {
  return convertHex(name, q, r)
}

export function createStrikeGroupUpdate(name, q, r) {
  return convertHex(name, q, r)
}

export function getFleetUnitUpdateUS(name, q, r) {
  return createFleetUpdate(name, q, r)
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
