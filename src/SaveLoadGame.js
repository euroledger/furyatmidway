import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"
import { flatHexToPixel } from "./components/HexUtils"
import HexCommand from "./commands/HexCommand"

export function saveGameState(controller, gameId) {
  const arr = Object.getOwnPropertyNames(GlobalGameState.prototype.constructor)
  let globalState = new Map()
  for (let key of arr) {
    const val = GlobalGameState.prototype.constructor[key]
    const ty = typeof val

    if (ty === "number" || ty === "boolean" || ty === "string") {
      globalState.set(key, val)
    }
  }

  let airState = new Map()
  const units = Array.from(GlobalInit.counters.values())
  const airCounters = units.filter((unit) => unit.constructor.name === "AirUnit")
  for (let airUnit of airCounters) {
    const { boxName, boxIndex } = controller.getAirUnitLocation(airUnit.name)

    airState.set(airUnit.name, {
      boxName,
      boxIndex,
      side: airUnit.side,
      counterData: airUnit,
    })
  }

  const globalText = JSON.stringify(Array.from(globalState.entries()))

  const airText = JSON.stringify(Array.from(airState.entries()))

  const jpStrikeText = JSON.stringify(Array.from(GlobalUnitsModel.jpStrikeGroups.entries()))

  const usStrikeText = JSON.stringify(Array.from(GlobalUnitsModel.usStrikeGroups.entries()))

  const jpCardText = JSON.stringify(GlobalUnitsModel.jpCards)
  const usCardText = JSON.stringify(GlobalUnitsModel.usCards)

  const jpCardsPlayedText = JSON.stringify(GlobalUnitsModel.jpCardsPlayed)
  const usCardsPlayedText = JSON.stringify(GlobalUnitsModel.usCardsPlayed)
  const cardText = JSON.stringify(GlobalUnitsModel.cards)

  const location1AFText = JSON.stringify(GlobalGameState.initial1AFLocation)
  const locationMIFText = JSON.stringify(GlobalGameState.initialMIFLocation)

  let previousPositionText
  if (GlobalGameState.previousPosition !== undefined) {
    previousPositionText = JSON.stringify(Array.from(GlobalGameState.previousPosition.entries()))
  }

  // console.log(jpCardText)
  // console.log(usCardText)

  const usmaps = controller.getUSFleetLocations()
  const usMapText = JSON.stringify(Array.from(usmaps.entries()))

  const jpmaps = controller.getJapanFleetLocations()
  const jpMapText = JSON.stringify(Array.from(jpmaps.entries()))

  // console.log(usMapText)
  // console.log(jpMapText)

  const usFleetText = JSON.stringify(Array.from(GlobalUnitsModel.usFleetUnits.entries()))

  const jpFleetText = JSON.stringify(Array.from(GlobalUnitsModel.jpFleetUnits.entries()))
  const logItems = JSON.stringify(Array.from(GlobalGameState.logItems.entries()))
  // console.log(logItems)
  // const size = new TextEncoder().encode(logItems).length
  // const kiloBytes = size / 1024;
  // const megaBytes = kiloBytes / 1024;

  // console.log("SIZE =", kiloBytes, "Kb")

  const airOperationsText = JSON.stringify(GlobalGameState.airOperationPoints)

  let savedGameDetails = {
    global: globalText,
    air: airText,
    jpStrike: jpStrikeText,
    usStrike: usStrikeText,
    airoperations: airOperationsText,
    jpMap: jpMapText,
    usMap: usMapText,
    jpcards: jpCardText,
    ijnFleetLocation: location1AFText,
    mifFleetLocation: locationMIFText,
    previousPosition: previousPositionText,
    uscards: usCardText,
    cards: cardText,
    jpcardsplayed: jpCardsPlayedText,
    uscardsplayed: usCardsPlayedText,
    usFleetMap: usFleetText,
    jpFleetMap: jpFleetText,
    log: logItems,
  }
  localStorage.setItem(gameId, JSON.stringify(savedGameDetails))
}
function createFleetUpdates(fleetMap) {
  let updates = new Array()
  for (const key of fleetMap.keys()) {
    let update
    const location = fleetMap.get(key)
    if (location.boxName === HexCommand.FLEET_BOX) {
      let side
      if (key === "CSF") {
        side = GlobalUnitsModel.Side.US
      } else if (key === "1AF") {
        side = GlobalUnitsModel.Side.JAPAN
      } else if (key === "IJN-DMCV") {
        side = GlobalUnitsModel.Side.JAPAN
      } else if (key === "US-DMCV") {
        side = GlobalUnitsModel.Side.US
      } else if (key === "MIF") {
        side = GlobalUnitsModel.Side.JAPAN
      } else if (key === "CSF-JPMAP") {
        side = GlobalUnitsModel.Side.JAPAN
      } else if (key === "1AF-USMAP") {
        side = GlobalUnitsModel.Side.US
      } else if (key === "IJN-DMCV-USMAP") {
        side = GlobalUnitsModel.Side.US
      } else if (key === "US-DMCV-JPMAP") {
        side = GlobalUnitsModel.Side.JAPAN
      } else if (key === "MIF-USMAP") {
        side = GlobalUnitsModel.Side.US
      }
      update = {
        name: key,
        position: {
          currentHex: {
            boxName: location.boxName,
            boxIndex: location.boxIndex,
          },
        },
        side,
      }
      updates.push(update)
      continue
    }
    const cHex = location.currentHex
    // calculate hex coords from grid coords q,r -> x.y
    if (cHex === undefined) {
      continue
    }
    const h = {
      q: cHex.q,
      r: cHex.r,
    }
    const newhex = flatHexToPixel(h)
    if (cHex === HexCommand.OFFBOARD) {
      continue
    }
    cHex.x = newhex.x
    cHex.y = newhex.y
    update = {
      name: key,
      position: {
        currentHex: cHex,
      },
    }
    updates.push(update)
  }
  return updates
}

function createStrikeGroupUpdates(strikeGroupMap) {
  let updates = new Array()
  for (const key of strikeGroupMap.keys()) {
    let update
    const sg = strikeGroupMap.get(key)
    const cHex = sg._location.currentHex

    update = {
      name: sg._name,
      position: {
        currentHex: cHex,
      },
      moved: sg._moved,
      attacked: sg._attacked,
    }
    updates.push(update)
  }
  return updates
}

function createDMCVMarkerUpdates(controller, side, carrierName) {
  const boxName = controller.getAirBoxForNamedShip(side, carrierName, "DMCV")

  const sideStr = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
  const markerName = `${sideStr}-DMCV-MARKER`
  let dmcvMarkerUpdate = {
    name: markerName,
    box: boxName,
    index: 0,
    side,
  }
  return dmcvMarkerUpdate
}

function createsDamageUpdates(controller, damage, side, carrierName) {
  const boxName = controller.getAirBoxForNamedShip(side, carrierName, "FLIGHT_DECK")

  if (damage.sunk) {
    const marker1 = GlobalInit.controller.getNextAvailableMarker("SUNK")
    GlobalGameState.nextAvailableSunkMarker++
    // do update 1
    const markerUpdate1 = {
      name: marker1.name,
      box: boxName,
      index: 0,
      side,
    }
    controller.setMarkerLocation(marker1.name, boxName, 0)

    const marker2 = GlobalInit.controller.getNextAvailableMarker("SUNK")

    const markerUpdate2 = {
      name: marker2.name,
      box: boxName,
      index: 1,
      side,
    }
    GlobalGameState.nextAvailableSunkMarker++
    controller.setMarkerLocation(marker2.name, boxName, 1)
    return [markerUpdate1, markerUpdate2]
  } else {
    let markerUpdate1 = null
    let markerUpdate2 = null
    if (damage.bow) {
      let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
      GlobalGameState.nextAvailableDamageMarker++

      markerUpdate1 = {
        name: marker.name,
        box: boxName,
        index: 0,
        side: side,
      }
      controller.setMarkerLocation(marker.name, boxName, 0)
    }

    if (damage.stern) {
      let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
      GlobalGameState.nextAvailableDamageMarker++

      markerUpdate2 = {
        name: marker.name,
        box: boxName,
        index: 1,
        side,
      }
      controller.setMarkerLocation(marker.name, boxName, 1)
    }
    if (markerUpdate1 !== null || markerUpdate2 !== null) {
      return [markerUpdate1, markerUpdate2]
    }
    return undefined
  }
}
function createDamageUpdatesMidway(controller) {
  const boxName = controller.getAirBoxForNamedShip(
    GlobalUnitsModel.Side.US,
    GlobalUnitsModel.Carrier.MIDWAY,
    "FLIGHT_DECK"
  )
  let markers = new Array()

  if (GlobalGameState.midwayBox0Damaged) {
    const marker1 = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
    GlobalGameState.nextAvailableDamageMarker++

    const markerUpdate = {
      name: marker1.name,
      box: boxName,
      index: 0,
      side: GlobalUnitsModel.Side.US,
    }
    controller.setMarkerLocation(marker1.name, boxName, 0)
    markers.push(markerUpdate)
  }
  if (GlobalGameState.midwayBox1Damaged) {
    const marker2 = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
    GlobalGameState.nextAvailableDamageMarker++

    const markerUpdate = {
      name: marker2.name,
      box: boxName,
      index: 1,
      side: GlobalUnitsModel.Side.US,
    }
    controller.setMarkerLocation(marker2.name, boxName, 1)
    markers.push(markerUpdate)
  }
  if (GlobalGameState.midwayBox2Damaged) {
    const marker2 = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
    GlobalGameState.nextAvailableDamageMarker++

    const markerUpdate = {
      name: marker2.name,
      box: boxName,
      index: 2,
      side: GlobalUnitsModel.Side.US,
    }
    controller.setMarkerLocation(marker2.name, boxName, 2)
    markers.push(markerUpdate)
  }
  return markers
}

function createDMCVUpdates(controller, fleetUnitsMap) {
  let fleetUpdates = new Array()
  for (const key of fleetUnitsMap.keys()) {
    let updates
    const carrier = fleetUnitsMap.get(key)

    if (carrier._dmcv) {
      updates = createDMCVMarkerUpdates(controller, carrier._side, carrier._name)
    }

    if (updates !== undefined) {
      fleetUpdates.push(updates)
    }
  }
  return fleetUpdates
}
function createDamageMarkerUpdates(controller, fleetUnitsMap) {
  let fleetUpdates = new Array()
  for (const key of fleetUnitsMap.keys()) {
    let updates
    const carrier = fleetUnitsMap.get(key)
    if (carrier._name === GlobalUnitsModel.Carrier.MIDWAY) {
      updates = createDamageUpdatesMidway(controller)
    } else {
      const sunk = carrier._hits >= 3
      const damage = {
        sunk,
        bow: carrier._bowDamaged,
        stern: carrier._sternDamaged,
      }
      updates = createsDamageUpdates(controller, damage, carrier._side, carrier._name)
    }
    if (updates !== undefined) {
      fleetUpdates.push(updates)
    }
  }
  return fleetUpdates
}

function createAirUnitUpdates(controller, airUnitMap) {
  let airUpdates = new Array()
  // let elimIndex = 0
  for (const unit of airUnitMap.keys()) {
    let update = {
      name: unit,
    }

    //     Air Update: name = Enterprise-F4F4-1, box = TF16 CAP, index =0 position = [object Object]
    // SaveLoadGame.js:386 Air Update: name = Enterprise-F4F4-2, box = TF16 CAP, index =2 position = [object Object]
    // SaveLoadGame.js:386 Air Update: name = Hornet-F4F4-1, box = TF16 CAP, index =1 position = [object Object]

    let airUnit = airUnitMap.get(unit)

    // QUACK TESTING BEGIN
    // TEST US RETURN1 NIGHT OPERATIONS WHEN NO ROOM ON CARRIER BUT REORG POSSIBLE

    // if (airUnit.counterData._name === "Enterprise-F4F4-1") {
    //   airUnit.boxName = GlobalUnitsModel.AirBox.US_HORNET_HANGAR
    //   airUnit.boxIndex = 2
    // }
    // QUACK TESTING END

    update.boxName = airUnit.boxName
    update.index = airUnit.boxIndex

    const side = airUnit.side
    let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)

    if (side === GlobalUnitsModel.Side.US) {
      position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)
    }

    if (
      airUnit.boxName === GlobalUnitsModel.AirBox.JP_ELIMINATED ||
      update.boxName === GlobalUnitsModel.AirBox.US_ELIMINATED
    ) {
      airUnit.name = update.name
      controller.addAirUnitToBoxUsingNextFreeSlot(airUnit.boxName, airUnit)
      continue
    }
    if (!position1) {
      continue
    }
    update.position = position1.offsets[update.index]

    // console.log(
    //   `Air Update: name = ${update.name}, box = ${update.boxName}, index =${update.index} position = ${update.position}`
    // )
    airUpdates.push(update)
  }
  return airUpdates
}

function loadAirUnits(airUnitMap) {
  for (const key of airUnitMap.keys()) {
    const airUnit = airUnitMap.get(key)

    const globalAirUnit = GlobalInit.controller.getAirUnitForName(key)

    if (globalAirUnit === undefined || airUnit.counterData === undefined) {
      continue // this got round the removal of the B17 counter
    }
    globalAirUnit.aircraftUnit.steps = airUnit.counterData._aircraftUnit._steps
    globalAirUnit.image = airUnit.counterData._image

    if (airUnit.counterData._aircraftUnit._moved) {
      globalAirUnit.aircraftUnit.moved = true
    }

    if (airUnit.counterData._aircraftUnit._turnmoved) {
      globalAirUnit.aircraftUnit._turnmoved = airUnit.counterData._turnmoved
    }

    // QUACK TESTING BEGIN
    // if (airUnit.counterData._name === "Enterprise-F4F4-1") {
    //   globalAirUnit.aircraftUnit.steps = 1
    //   const newImage = globalAirUnit.image.replace("front", "back")
    //   globalAirUnit.image = newImage
    // }

    // if (airUnit.counterData._name === "Enterprise-F4F4-2") {
    //   globalAirUnit.aircraftUnit.steps = 1
    //   const newImage = globalAirUnit.image.replace("front", "back")
    //   globalAirUnit.image = newImage
    //   globalAirUnit.location.boxName = GlobalUnitsModel.AirBox.US_HORNET_HANGAR
    //   console.log("ENTERPRISE AIR UNIT F4F-2 =", globalAirUnit)
    // }
    // QUACK TESTING END

    // possibly check airUnit parent carrier here
    if (globalAirUnit.carrier !== airUnit.counterData._carrier) {
      globalAirUnit.carrier = airUnit.counterData._carrier
    }
    // QUACK FOR TESTING ONLY
    // if (airUnit.counterData._name === "Hornet-F4F4-1" || airUnit.counterData._name === "Hornet-F4F4-2") {
    //   globalAirUnit.aircraftUnit.steps = 1
    //   globalAirUnit.image = "/images/aircounters/hornet-f4f-back.png"
    // // }
    // GlobalGameState.usDMCVFleetPlaced = false
    // GlobalGameState.jpDMCVFleetPlaced = false
    // GlobalGameState.fleetSpeed = 2
    // GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    // GlobalGameState.dmcvFleetSpeed = 1
    // GlobalGameState.usDMCVCarrier = GlobalUnitsModel.Carrier.HORNET
    // GlobalGameState.midwayGarrisonLevel = 4
    // GlobalGameState.carrierHitsDetermined = false

    // GlobalGameState.CSFLeftMap = false
    // GlobalGameState.AF1LeftMap = false

    // QUACK TEMPORARY
    // GlobalGameState.winner = ""
    // GlobalGameState.JP_AF = 6
    // GlobalGameState.US_CSF = 7
    // GlobalGameState.US_MIDWAY = 8
    // GlobalGameState.midwayAttackResolved=true

    // GlobalGameState.jpDMCVCarrier = GlobalUnitsModel.Carrier.SORYU
    // GlobalGameState.usDMCVCarrier = undefined
    // GlobalGameState.temporaryGamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING

    // GlobalGameState.hideCounters = false // QUACK TESTING
  }
}

function loadUSStrikeUnits(loadedMap) {
  for (let key of loadedMap.keys()) {
    const sg = GlobalUnitsModel.usStrikeGroups.get(key)
    const loadedSG = loadedMap.get(key)
    sg.moved = loadedSG._moved
    sg.airOpMoved = loadedSG._airOpMoved
    sg.airOpAttacked = loadedSG._airOpAttacked
    sg.gameTurnMoved = loadedSG._gameTurnMoved
    GlobalUnitsModel.usStrikeGroups.set(key, sg)
  }
}

function loadJapanStrikeUnits(loadedMap) {
  for (let key of loadedMap.keys()) {
    const sg = GlobalUnitsModel.jpStrikeGroups.get(key)
    const loadedSG = loadedMap.get(key)
    sg.gameTurnMoved = loadedSG._gameTurnMoved
    sg.moved = loadedSG._moved
    sg.airOpMoved = loadedSG._airOpMoved
    sg.airOpAttacked = loadedSG._airOpAttacked
    GlobalUnitsModel.jpStrikeGroups.set(key, sg)
  }
}

function loadJapanFleetUnits(loadedMap) {
  for (let key of loadedMap.keys()) {
    const carrier = GlobalUnitsModel.jpFleetUnits.get(key)
    const loadedFleetUnit = loadedMap.get(key)
    carrier.hits = loadedFleetUnit._hits
    carrier.bowDamaged = loadedFleetUnit._bowDamaged
    carrier.sternDamaged = loadedFleetUnit._sternDamaged
    carrier.dmcv = loadedFleetUnit._dmcv
    GlobalUnitsModel.jpFleetUnits.set(key, carrier)
  }
}

function loadUSFleetUnits(loadedMap) {
  let cvSelected
  for (let key of loadedMap.keys()) {
    const carrier = GlobalUnitsModel.usFleetUnits.get(key)
    const loadedFleetUnit = loadedMap.get(key)
    carrier.hits = loadedFleetUnit._hits
    carrier.bowDamaged = loadedFleetUnit._bowDamaged
    carrier.sternDamaged = loadedFleetUnit._sternDamaged

    carrier.towed = loadedFleetUnit._towed
    if (carrier.towed) {
      cvSelected = carrier.name
    }
    carrier.dmcv = loadedFleetUnit._dmcv
    GlobalUnitsModel.usFleetUnits.set(key, carrier)
  }
  return cvSelected
}

export function loadGameStateForId(controller, gameId) {
  const loadedJson = localStorage.getItem(gameId)

  const gameDetails = JSON.parse(loadedJson)
  if (!gameId) {
    return
  }

  const globalState = gameDetails.global

  const global = new Map(JSON.parse(globalState))

  let tempState
  for (var property in GlobalGameState) {
    const ty = typeof GlobalGameState[property]

    if (property === "gamePhase") {
      tempState = global.get(property)
      continue
    }

    if (ty === "number" || ty === "boolean" || ty === "string") {
      GlobalGameState[property] = global.get(property)
    }
  }
  GlobalGameState.temporaryGamePhase = tempState

  const airOperationText = gameDetails.airoperations
  GlobalGameState.airOperationPoints = JSON.parse(airOperationText)

  const ijnLocationText = gameDetails.ijnFleetLocation
  if (ijnLocationText !== undefined) {
    GlobalGameState.initial1AFLocation = JSON.parse(ijnLocationText)
  }

  const mifLocationText = gameDetails.mifFleetLocation
  if (mifLocationText !== undefined) {
    GlobalGameState.initialMIFLocation = JSON.parse(mifLocationText)
  }
  const previousPositionText = gameDetails.previousPosition

  let previousPosition
  if (previousPositionText !== undefined) {
    previousPosition = new Map(JSON.parse(previousPositionText))
  }

  const airText = gameDetails.air
  const airMap = new Map(JSON.parse(airText))

  loadAirUnits(airMap)

  const jpStrikeText = gameDetails.jpStrike
  const jpStrikeMap = new Map(JSON.parse(jpStrikeText))
  if (jpStrikeText) {
    loadJapanStrikeUnits(jpStrikeMap)
  }

  const usStrikeText = gameDetails.usStrike
  const usStrikeMap = new Map(JSON.parse(usStrikeText))

  if (usStrikeText) {
    loadUSStrikeUnits(usStrikeMap)
  }
  const jpStrikeUpdates = createStrikeGroupUpdates(jpStrikeMap)

  const usStrikeUpdates = createStrikeGroupUpdates(usStrikeMap)

  const airUpdates = createAirUnitUpdates(controller, airMap)

  // reload damage to fleet units, i.e., carriers
  const jpFleetText = gameDetails.jpFleetMap

  let jpFleetUnitsMap, usFleetUnitsMap
  if (jpFleetText !== undefined) {
    jpFleetUnitsMap = new Map(JSON.parse(jpFleetText))
    loadJapanFleetUnits(jpFleetUnitsMap)
  }

  const usFleetText = gameDetails.usFleetMap
  let cvSelected
  if (usFleetText !== undefined) {
    usFleetUnitsMap = new Map(JSON.parse(usFleetText))
    cvSelected = loadUSFleetUnits(usFleetUnitsMap)
  }

  let jpDamageMarkerUpdates = new Array(),
    usDamageMarkerUpdates = new Array()
  if (jpFleetUnitsMap !== undefined) {
    jpDamageMarkerUpdates = createDamageMarkerUpdates(controller, jpFleetUnitsMap)
  }
  if (usFleetUnitsMap !== undefined) {
    usDamageMarkerUpdates = createDamageMarkerUpdates(controller, usFleetUnitsMap)
  }

  let jpDMCVMarkerUpdates = new Array()
  let usDMCVMarkerUpdates = new Array()
  if (jpFleetUnitsMap !== undefined) {
    jpDMCVMarkerUpdates = createDMCVUpdates(controller, jpFleetUnitsMap)
  }
  if (usFleetUnitsMap !== undefined) {
    usDMCVMarkerUpdates = createDMCVUpdates(controller, usFleetUnitsMap)
  }

  const usCardText = gameDetails.uscards
  const jpCardText = gameDetails.jpcards

  const usCardsPlayedText = gameDetails.uscardsplayed
  const jpCardsPlayedText = gameDetails.jpcardsplayed

  const cardText = gameDetails.cards

  // TODO reload draw deck

  GlobalUnitsModel.jpCards = JSON.parse(jpCardText)

  // QUACK TEST JAPAN CARD 10 - "US Carrier Planes Ditch"
  // GlobalInit.controller.setCardPlayed(9, GlobalUnitsModel.Side.JAPAN)
  // GlobalInit.controller.drawJapanCards(1, false, [10])

  GlobalUnitsModel.usCards = JSON.parse(usCardText)
  // GlobalInit.controller.drawUSCards(1, true, [4]) // QUACK TESTING

  if (jpCardsPlayedText !== undefined) {
    GlobalUnitsModel.jpCardsPlayed = JSON.parse(jpCardsPlayedText)
  }

  if (usCardsPlayedText !== undefined) {
    GlobalUnitsModel.usCardsPlayed = JSON.parse(usCardsPlayedText)
  }

  if (cardText !== undefined) {
    // QUACK should be able to remove this check, just there for legacy loads
    GlobalUnitsModel.cards = JSON.parse(cardText)
  }

  // QUACK REMOVE ONE CARD AND REPLACE IT WITH ANOTHER
  // GlobalInit.controller.replaceCardWithOtherCard(6, 9, GlobalUnitsModel.Side.JAPAN)
  // GlobalGameState.midwayControl = GlobalUnitsModel.Side.US
  // ------------------------------------------------------

  // GlobalInit.controller.setCardPlayed(8, GlobalUnitsModel.Side.US)
  // GlobalInit.controller.drawUSCards(3, false, [1])

  const items = gameDetails.log
  const logItems = new Map(JSON.parse(items))

  const jpMapText = gameDetails.jpMap
  const jpFleetMap = new Map(JSON.parse(jpMapText))

  const usMapText = gameDetails.usMap
  const usFleetMap = new Map(JSON.parse(usMapText))

  const usfleetUpdates = createFleetUpdates(usFleetMap)
  const jpfleetUpdates = createFleetUpdates(jpFleetMap)

  return {
    airUpdates,
    jpfleetUpdates,
    usfleetUpdates,
    jpStrikeUpdates,
    usStrikeUpdates,
    jpDamageMarkerUpdates,
    usDamageMarkerUpdates,
    jpDMCVMarkerUpdates,
    usDMCVMarkerUpdates,
    cvSelected,
    logItems,
    previousPosition,
  }
}

export function loadGameState(controller) {
  const globalState = localStorage.getItem("global")
  const global = new Map(JSON.parse(globalState))

  for (var property in GlobalGameState) {
    const ty = typeof GlobalGameState[property]

    if (ty === "number" || ty === "boolean" || ty === "string") {
      GlobalGameState[property] = global.get(property)
    }
  }
  const airOperationText = localStorage.getItem("airoperations")
  GlobalGameState.airOperationPoints = JSON.parse(airOperationText)

  const airText = localStorage.getItem("air")
  const airMap = new Map(JSON.parse(airText))

  const airUpdates = createAirUnitUpdates(controller, airMap)

  const usCardText = localStorage.getItem("uscards")
  const jpCardText = localStorage.getItem("jpcards")

  const usCardsPlayedText = localStorage.getItem("uscardsplayed")
  const jpCardsPlayedText = localStorage.getItem("jpcardsplayed")

  const cardText = localStorage.getItem("cards")

  GlobalUnitsModel.jpCards = JSON.parse(jpCardText)
  GlobalUnitsModel.usCards = JSON.parse(usCardText)

  GlobalUnitsModel.jpCardsPlayed = JSON.parse(jpCardsPlayedText)
  GlobalUnitsModel.usCardsPlayed = JSON.parse(usCardsPlayedText)
  GlobalUnitsModel.cards = JSON.parse(cardText)

  const items = localStorage.getItem("log")

  const logItems = new Map(JSON.parse(items))

  const jpMapText = localStorage.getItem("jpMap")
  const jpFleetMap = new Map(JSON.parse(jpMapText))

  const usMapText = localStorage.getItem("usMap")
  const usFleetMap = new Map(JSON.parse(usMapText))

  const usfleetUpdates = createFleetUpdates(usFleetMap)
  const jpfleetUpdates = createFleetUpdates(jpFleetMap)

  return { airUpdates, jpfleetUpdates, usfleetUpdates, logItems }
}
