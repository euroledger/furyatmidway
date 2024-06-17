import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"

export function saveGameState() {
    const arr = Object.getOwnPropertyNames(GlobalGameState.prototype.constructor)
    let globalState = new Map()
    for (let key of arr) {
      const val = GlobalGameState.prototype.constructor[key]
      const ty = typeof val

      if (ty === "number" || ty === "boolean") {
        globalState.set(key, val)
      }
    }
    console.log(globalState)

    let airState = new Map()
    const units = Array.from(GlobalInit.counters.values())
    const airCounters = units.filter((unit) => unit.constructor.name === "AirUnit")
    for (let airUnit of airCounters) {
      const { boxName, boxIndex } = GlobalInit.controller.getAirUnitLocation(airUnit.name)

      airState.set(airUnit.name, {
        boxName,
        boxIndex,
      })
    }
    console.log(airState)

    const globalText = JSON.stringify(Array.from(globalState.entries()))
    const airText = JSON.stringify(Array.from(airState.entries()))

    const jpCardText = JSON.stringify(GlobalUnitsModel.jpCards)
    const usCardText = JSON.stringify(GlobalUnitsModel.usCards)
    console.log(jpCardText)
    console.log(usCardText)

    const usmaps = GlobalInit.controller.getUSFleetLocations()
    const usMapText = JSON.stringify(Array.from(usmaps.entries()))

    const jpmaps = GlobalInit.controller.getJapanFleetLocations()
    const jpMapText = JSON.stringify(Array.from(jpmaps.entries()))

    console.log(usMapText)
    console.log(jpMapText)

    localStorage.setItem("global", globalText)
    localStorage.setItem("air", airText)
    localStorage.setItem("jpMap", jpMapText)
    localStorage.setItem("usMap", usMapText)
    localStorage.setItem("jpcards", jpCardText)
    localStorage.setItem("uscards", usCardText)

    // TODO
    // 1. save fleet locations on main map(s)
    // 2. save game log

    
    // for reverse:
    // map = new Map(JSON.parse(jsonText))

  }