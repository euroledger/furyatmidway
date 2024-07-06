import GlobalUnitsModel from "./GlobalUnitsModel"


export default class AirOperationsModel {
  // functions to get all planes in certain types of boxes

  constructor() {
    this.airUnitDestinationMap = new Map()
  }

  setValidAirUnitDestinations(name, destination) {
    this.airUnitDestinationMap.set(name, destination)
  }

  getValidAirUnitDestinations(name) {
    return this.airUnitDestinationMap.get(name)
  }

  getBoxesByKey(side, boxKey) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"

    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(boxKey) && key.includes(sideKey))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }

  // eg JAPAN, Akagi, HANGAR
  getAirBoxForNamedShip(side, carrier, boxKey) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"

    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(carrier.toUpperCase()) && key.includes(boxKey) && key.includes(sideKey))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }
}
