import GlobalUnitsModel from "./GlobalUnitsModel"

export default class CardModel {
  // data structures for objects on US and Japan Maps
  constructor() {
    this.jpMap = new Map()
    this.usMap = new Map()
  }

  setFleetUnitLocation(id, location, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      this.jpMap.set(id, location)
    } else {
      this.usMap.set(id, location)
    }
  }
  locationsEqual(locationA, locationB) {
    if (locationA.currentHex === undefined || locationB.currentHex === undefined) {
      return false
    }
    return locationA.currentHex.q === locationB.currentHex.q && locationA.currentHex.r === locationB.currentHex.r
  }

  getAllFleetsInLocation(location, side, counters) {
    let fleets = new Array()

    const fleetMap =
      side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.jpFleetUnits : GlobalUnitsModel.usFleetUnits
    const mapMap = side === GlobalUnitsModel.Side.JAPAN ? this.jpMap : this.usMap
    // this gives us a map where keys are all non strike groups at this location

    const fleetLocations = new Map(
      [...mapMap].filter(([k, v]) => !k.includes("SG") && this.locationsEqual(v, location))
    )
    for (let sg of fleetLocations.keys()) {
      const counter = counters.get(sg)
      if (counter.side !== side) {
        fleets.push(counters.get(sg))
      }
    }

    return fleets
  }

  getAllStrikeGroupsInLocation(location, side) {
    let strikeGroups = new Array()

    const strikeMap =
      side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.jpStrikeGroups : GlobalUnitsModel.usStrikeGroups

    const mapMap = side === GlobalUnitsModel.Side.JAPAN ? this.jpMap : this.usMap
    // this gives us a map where keys are all strike boxes at this location
    const strikeGroupLocations = new Map([...mapMap].filter(([k, v]) => k.includes("SG") && this.locationsEqual(v, location)))

    // for each key get the strike group and add to array
    for (let sg of strikeGroupLocations.keys()) {
      const group = new Map([...strikeMap].filter(([_, v]) => v.name === sg))
      let values = Array.from(group.values())
      strikeGroups.push(values[0]) // should only ever be 1
    }

    return strikeGroups
  }

  setStrikeGroupLocation(id, location, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      this.jpMap.set(id, location)
    } else {
      this.usMap.set(id, location)
    }
  }

  getStrikeGroupLocation(id, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return this.jpMap.get(id)
    } else {
      return this.usMap.get(id)
    }
  }
  getFleetLocation(id, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      console.log("JAPAN MAP=", this.jpMap)
      return this.jpMap.get(id)
    } else {
      console.log("US MAP=", this.usMap)

      return this.usMap.get(id)
    }
  }

  getJapanFleetLocations() {
    return this.jpMap
  }

  getUSFleetLocations() {
    return this.usMap
  }
}
