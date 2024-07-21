import GlobalUnitsModel from "./GlobalUnitsModel"

export default class AirOperationsModel {
  // functions to get all planes in certain types of boxes
  // also maps for air unit destination boxes and possible reorganizations
  
  constructor() {
    this.airUnitDestinationMap = new Map()
    this.airUnitReorganizationMap = new Map()
  }

  setValidAirUnitDestinations(name, destination) {
    this.airUnitDestinationMap.set(name, destination)
  }

  getValidAirUnitDestinations(name) {
    return this.airUnitDestinationMap.get(name)
  }

  setReorganizationUnits(name, units) {
    this.airUnitReorganizationMap.set(name, units)
  }

  getReorganizationUnits(name) {
    return this.airUnitReorganizationMap.get(name)
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
  getHangarAirBoxForNamedTaskForce(side, tf) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(tf.toUpperCase()) && key.includes("HANGAR") && key.includes(sideKey))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }
  getReturn2AirBoxForNamedTaskForce(side, tf) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(tf.toUpperCase()) && key.includes("RETURN1") && key.includes(sideKey))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }
}
