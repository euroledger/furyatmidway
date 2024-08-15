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

  const logItems = JSON.stringify(Array.from(GlobalGameState.logItems.entries()))
  // console.log(logItems)

  const airOperationsText = JSON.stringify(GlobalGameState.airOperationPoints)


  // @TODO SAVE STRIKE GROUPS
  // add controller.getStrikeGroups(side)
  // will return GlobalUnitsModel.usStrikeGroups or GlobalUnitsModel.jpStrikeGroups

  let savedGameDetails = {
    global: globalText,
    air: airText,
    airoperations: airOperationsText,
    jpMap: jpMapText,
    usMap: usMapText,
    jpcards: jpCardText,
    uscards: usCardText,
    log: logItems,
    // TODO: strike groups
  }
  // savedGame.set(gameId, savedGameDetails )
  // localStorage.setItem("global", globalText)
  // localStorage.setItem("air", airText)
  // localStorage.setItem("airoperations", airOperationsText)
  // localStorage.setItem("jpMap", jpMapText)
  // localStorage.setItem("usMap", usMapText)
  // localStorage.setItem("jpcards", jpCardText)
  // localStorage.setItem("uscards", usCardText)
  // localStorage.setItem("log", logItems)

  console.log("Saving Map data:", savedGameDetails.usMap)
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

function createAirUnitUpdates(airUnitMap) {
  let airUpdates = new Array()
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
   
    // TODO steps, damage to fleets etc
  }
}
export function loadGameStateForId(gameId) {
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

  const airUpdates = createAirUnitUpdates(airMap)

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

  return { airUpdates, jpfleetUpdates, usfleetUpdates, logItems }
}

export function loadGameState() {
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

  const airUpdates = createAirUnitUpdates(airMap)

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
