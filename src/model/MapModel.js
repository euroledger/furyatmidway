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
      return this.jpMap.get(id)
    } else {
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
