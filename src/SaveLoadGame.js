import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"

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
  // console.log(globalState)

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
    uscards: usCardText,
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
    const cHex = fleetMap.get(key).currentHex
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
      attacked: sg._attacked
    }
    updates.push(update)
  }
  return updates
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
    if (damage.bow) {
      let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
      GlobalGameState.nextAvailableDamageMarker++

      const markerUpdate = {
        name: marker.name,
        box: boxName,
        index: 0,
        side: side,
      }
      controller.setMarkerLocation(marker.name, boxName, 0)
      return [markerUpdate, null]
    }

    if (damage.stern) {
      let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
      GlobalGameState.nextAvailableDamageMarker++

      const markerUpdate = {
        name: marker.name,
        box: boxName,
        index: 1,
        side,
      }
      controller.setMarkerLocation(marker.name, boxName, 1)
      return [null, markerUpdate]
    }
  }
}

function createDamageMarkerUpdates(controller, fleetUnitsMap) {
  let fleetUpdates = new Array()
  for (const key of fleetUnitsMap.keys()) {
    const carrier = fleetUnitsMap.get(key)
    const sunk = carrier._hits >= 3
    const damage = {
      sunk,
      bow: carrier._bowDamaged,
      stern: carrier._sternDamaged,
    }
    const updates = createsDamageUpdates(controller, damage, carrier._side, carrier._name)
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
    let airUnit = airUnitMap.get(unit)
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

    if (airUnit.counterData._aircraftUnit._moved) {
      globalAirUnit.aircraftUnit.moved = true
    }
  }
}

function loadUSStrikeUnits(loadedMap) {
  for (let key of loadedMap.keys()) {
    const sg = GlobalUnitsModel.usStrikeGroups.get(key)
    const loadedSG = loadedMap.get(key)
    sg.moved = loadedSG._moved
    sg.airOpMoved = loadedSG._airOpMoved
    sg.airOpAttacked = loadedSG._airOpAttacked
    GlobalUnitsModel.usStrikeGroups.set(key, sg)
  }
}

function loadJapanStrikeUnits(loadedMap) {
  for (let key of loadedMap.keys()) {
    const sg = GlobalUnitsModel.jpStrikeGroups.get(key)
    const loadedSG = loadedMap.get(key)
    sg.moved = loadedSG._moved
    // console.log("name: ", sg.name, ">>>>>>>>>>>>>> SET STRIKE GROUP AIR OP MOVED TO", loadedSG._airOpMoved)

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
    GlobalUnitsModel.jpFleetUnits.set(key, carrier)
  }
}

function loadUSFleetUnits(loadedMap) {
  for (let key of loadedMap.keys()) {
    const carrier = GlobalUnitsModel.usFleetUnits.get(key)
    const loadedFleetUnit = loadedMap.get(key)
    carrier.hits = loadedFleetUnit._hits
    carrier.bowDamaged = loadedFleetUnit._bowDamaged
    carrier.sternDamaged = loadedFleetUnit._sternDamaged
    GlobalUnitsModel.usFleetUnits.set(key, carrier)
  }
}

export function loadGameStateForId(controller, gameId) {
  const loadedJson = localStorage.getItem(gameId)

  const gameDetails = JSON.parse(loadedJson)
  if (!gameId) {
    return
  }

  const globalState = gameDetails.global

  const global = new Map(JSON.parse(globalState))

  for (var property in GlobalGameState) {
    const ty = typeof GlobalGameState[property]

    if (ty === "number" || ty === "boolean" || ty === "string") {
      GlobalGameState[property] = global.get(property)
    }
  }

  const airOperationText = gameDetails.airoperations
  GlobalGameState.airOperationPoints = JSON.parse(airOperationText)

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
  // QUACK some saved games may not have fleet info. Remove this in due course
  if (jpFleetText !== undefined) {
    jpFleetUnitsMap = new Map(JSON.parse(jpFleetText))
    loadJapanFleetUnits(jpFleetUnitsMap)
  }

  const usFleetText = gameDetails.usFleetMap
  if (usFleetText !== undefined) {
    usFleetUnitsMap = new Map(JSON.parse(usFleetText))
    loadUSFleetUnits(usFleetUnitsMap)
  }
  let jpDamageMarkerUpdates = new Array(),
    usDamageMarkerUpdates = new Array()
  if (jpFleetText !== undefined) {
    jpDamageMarkerUpdates = createDamageMarkerUpdates(controller, jpFleetUnitsMap)
  }
  if (usFleetText !== undefined) {
    usDamageMarkerUpdates = createDamageMarkerUpdates(controller, usFleetUnitsMap)
  }

  const usCardText = gameDetails.uscards
  const jpCardText = gameDetails.jpcards

  GlobalUnitsModel.jpCards = JSON.parse(jpCardText)
  GlobalUnitsModel.usCards = JSON.parse(usCardText)

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
    logItems,
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

  GlobalUnitsModel.jpCards = JSON.parse(jpCardText)
  GlobalUnitsModel.usCards = JSON.parse(usCardText)

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
