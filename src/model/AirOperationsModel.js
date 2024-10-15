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
  getReturn1AirBoxForNamedTaskForce(side, tf) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(tf.toUpperCase()) && key.includes("RETURN1") && key.includes(sideKey))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }

  getTaskForceForAirBox(box) {
    const boxTokens = box.split(" ")
    return boxTokens[0]
  }

  getCarrierForAirBox(box) {
    const boxTokens = box.split(" ")
    const str = boxTokens[0].toLowerCase()
    const modStr = str[0].toUpperCase() + str.slice(1)
    return modStr
  }

  getReturn2AirBoxForNamedTaskForce(side, tf) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(tf.toUpperCase()) && key.includes("RETURN2") && key.includes(sideKey))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }

  getCapReturnAirBoxForNamedTaskForce(side, tf) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(`${sideKey}_${tf}_CAP_RETURN`))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }

  getCapBoxForNamedTaskForce(side, tf) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key === `${sideKey}_${tf}_CAP`)
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }

  getStrikeBoxesForSide(side) {
    let sideKey = side === GlobalUnitsModel.Side.JAPAN ? "JP" : "US"
    const filteredEntries = Object.keys(GlobalUnitsModel.AirBox)
      .filter((key) => key.includes(`${sideKey}_STRIKE_BOX_`))
      .reduce((obj, key) => {
        obj[key] = GlobalUnitsModel.AirBox[key]
        return obj
      }, {})
    return filteredEntries
  }
}
