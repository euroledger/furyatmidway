import BoxModel from "../model/BoxModel"
import CardModel from "../model/CardModel"
import MapModel from "../model/MapModel"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import ViewEventAirUnitSetupHandler from "./ViewEventAirUnitSetupHandler"
import ViewEventFleetUnitSetupHandler from "./ViewEventFleetUnitSetupHandler"
import { distanceBetweenHexes } from "../components/HexUtils"
import GlobalGameState from "../model/GlobalGameState"
import AirOperationsModel from "../model/AirOperationsModel"

export default class Controller {
  static EventTypes = {
    AIR_UNIT_SETUP: "AirUnitSetup",
    FLEET_SETUP: "FleetSetup",
  }

  static MIDWAY_HEX = {
    currentHex: {
      q: 6,
      r: 3,
    },
  }

  constructor() {
    this.clearModels()
  }

  clearModels() {
    this.boxModel = new BoxModel()
    this.cardModel = new CardModel()
    this.mapModel = new MapModel()
    this.airOperationsModel = new AirOperationsModel()
    this.airUnitSetupHandler = new ViewEventAirUnitSetupHandler(this)
    this.fleetUnitSetupHandler = new ViewEventFleetUnitSetupHandler(this)
  }

  setCounters(counters) {
    this.counters = counters
  }

  getAllAirUnits(side) {
    const units = Array.from(this.counters.values())
    const airCounters = units.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)
    return airCounters
  }
  addAirUnitToBox = (boxName, index, value) => {
    this.boxModel.addAirUnitToBox(boxName, index, value)
  }

  addAirUnitToBoxUsingNextFreeSlot = (boxName, value) => {
    const index = this.getFirstAvailableZone(boxName)
    if (index != -1) {
      this.boxModel.addAirUnitToBox(boxName, index, value)
    }
  }

  removeAirUnitFromBox = (boxName, index) => {
    this.boxModel.removeAirUnitFromBox(boxName, index)
  }

  getCarrierForAirUnit(name) {
    const airUnit = this.counters.get(name)
    if (airUnit) {
      return airUnit.carrier
    }
  }

  getTaskForceForCarrier(name, side) {
    const carrier = side === GlobalUnitsModel.Side.JAPAN ? this.getJapanFleetUnit(name) : this.getUSFleetUnit(name)
    return carrier.taskForce
  }

  getAllCarriersInTaskForce(tf, side) {
    const fleetUnits =
      side === GlobalUnitsModel.Side.JAPAN
        ? Array.from(GlobalUnitsModel.jpFleetUnits.values())
        : Array.from(GlobalUnitsModel.usFleetUnits.values())

    return fleetUnits.filter((n) => n.taskForce === tf)
  }

  getOtherCarrierInTF(carrierName, side) {
    const taskForce = this.getTaskForceForCarrier(carrierName, side)
    const units = this.getAllCarriersInTaskForce(taskForce, side)

    return units.filter((unit) => unit.name != carrierName)
  }

  getAllAirUnitsInBox = (boxName) => {
    return this.boxModel.getAllAirUnitsInBox(boxName)
  }

  getNumberZonesInBox = (boxName) => {
    return this.boxModel.getNumberOfZonesInBox(boxName)
  }

  // returns array of free slots
  getAllFreeZonesInBox = (boxName) => {
    const numZones = this.getNumberZonesInBox(boxName)
    const zones = new Array()
    for (let index = 0; index < numZones; index++) {
      const airUnit = this.getAirUnitInBox(boxName, index)
      if (!airUnit) {
        zones.push(index)
      }
    }
    return zones
  }

  getFirstAvailableZone = (boxName) => {
    const zones = this.getNumberZonesInBox(boxName)
    for (let index = 0; index < zones; index++) {
      const airUnit = this.getAirUnitInBox(boxName, index)
      if (!airUnit) {
        return index
      }
    }
    // box is full - return -1
    return -1
  }

  getAirUnitInBox = (boxName, index) => {
    return this.boxModel.getAirUnitInBox(boxName, index)
  }

  isAirUnitInBox = (boxName, airUnitName) => {
    return this.boxModel.isAirUnitInBox(boxName, airUnitName)
  }

  getAirUnitLocation = (airUnitName) => {
    return this.boxModel.getAirUnitLocation(airUnitName)
  }

  addAirUnitToJapaneseCarrier(carrier, value) {
    this.boxModel.addAirUnitToJapaneseCarrier(carrier, value)
  }

  addAirUnitToUSCarrier(carrier, value) {
    this.boxModel.addAirUnitToUSCarrier(carrier, value)
  }

  getAirUnitsForJapaneseCarrier(carrier) {
    return this.boxModel.getAirUnitsForJapaneseCarrier(carrier)
  }

  getAirUnitsForUSCarrier(carrier) {
    return this.boxModel.getAirUnitsForUSCarrier(carrier)
  }

  getJapaneseAirUnitsDeployed(carrier) {
    return this.boxModel.getJapaneseAirUnitsDeployed(carrier)
  }

  getUSAirUnitsDeployed(carrier) {
    return this.boxModel.getUSAirUnitsDeployed(carrier)
  }

  getJapanAirUnit(name) {
    return GlobalUnitsModel.jpAirUnits.get(name)
  }

  getUSAirUnit(name) {
    return GlobalUnitsModel.usAirUnits.get(name)
  }

  getJapanFleetUnit(name) {
    return GlobalUnitsModel.jpFleetUnits.get(name)
  }

  getUSFleetUnit(name) {
    return GlobalUnitsModel.usFleetUnits.get(name)
  }

  isFlightDeckDamaged(name) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.hits === 2
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      return carrier.hits === 2
    }
  }

  numUnitsOnCarrier(name) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    const flightDeckBox = this.airOperationsModel.getAirBoxForNamedShip(side, name, "FLIGHT")
    let boxName = Object.values(flightDeckBox)[0]
    const airUnitsOnFlightDeck = this.getAllAirUnitsInBox(boxName)

    const hangarBox = this.airOperationsModel.getAirBoxForNamedShip(side, name, "HANGAR")
    boxName = Object.values(hangarBox)[0]

    const airUnitsInHangar = this.getAllAirUnitsInBox(boxName)

    return airUnitsInHangar.length + airUnitsOnFlightDeck.length
  }

  getBoxesForJapaneseCarrier(carrier, includeReturnBoxes) {
    return this.boxModel.getBoxNamesForJapaneseCarrier(carrier, includeReturnBoxes)
  }

  getBoxesForUSCarrier(carrier, includeReturnBoxes) {
    return this.boxModel.getBoxNamesForUSCarrier(carrier, includeReturnBoxes)
  }
  setValidAirUnitDestinations(name, destinations) {
    this.airOperationsModel.setValidAirUnitDestinations(name, destinations)
  }

  getValidAirUnitDestinations(name) {
    return this.airOperationsModel.getValidAirUnitDestinations(name)
  }
  drawJapanCards(num, initial) {
    this.cardModel.drawJapanCards(num, initial)
  }

  drawUSCards(num, initial) {
    this.cardModel.drawUSCards(num, initial)
  }

  setFleetUnitLocation(id, location, side) {
    this.mapModel.setFleetUnitLocation(id, location, side)
  }

  getFleetLocation(id, side) {
    return this.mapModel.getFleetLocation(id, side)
  }

  getJapanFleetLocations() {
    return this.mapModel.getJapanFleetLocations()
  }

  getUSFleetLocations() {
    return this.mapModel.getUSFleetLocations()
  }

  numHexesBetweenFleets(fleetA, fleetB) {
    let locationA = this.getFleetLocation(fleetA.name, fleetA.side)
    let locationB = this.getFleetLocation(fleetB.name, fleetB.side)
    if (fleetA.name === "MIDWAY") {
      locationA = Controller.MIDWAY_HEX
    } else if (fleetB.name === "MIDWAY") {
      locationB = Controller.MIDWAY_HEX
    }

    let hexA = {
      q: locationA.currentHex.q,
      r: locationA.currentHex.r,
    }
    let hexB = {
      q: locationB.currentHex.q,
      r: locationB.currentHex.r,
    }

    return distanceBetweenHexes(hexA, hexB)
  }

  closestEnemyFleet(fleetA) {
    let locationA = this.getFleetLocation(fleetA.name, fleetA.side)

    if (fleetA.name === "MIDWAY") {
      locationA = Controller.MIDWAY_HEX
    }
    let hexA = {
      q: locationA.currentHex.q,
      r: locationA.currentHex.r,
    }

    let locations =
      fleetA.side === GlobalUnitsModel.Side.JAPAN ? this.getUSFleetLocations() : this.getJapanFleetLocations()

    const otherSide =
      fleetA.side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US

    let shortestDist = 100

    // if no fleets on the board (for Japan) use Midway instead
    // @TODO

    let found = false
    for (let fleet of locations.keys()) {
      if (fleet.toUpperCase().includes("MAP")) {
        continue
      }
      found = true // will stay false if no fleets on map
      const locationB = locations.get(fleet)
      const hexB = {
        q: locationB.currentHex.q,
        r: locationB.currentHex.r,
      }
      const dist = distanceBetweenHexes(hexA, hexB)
      if (dist < shortestDist) {
        shortestDist = dist
      }
    }

    if (!found && fleetA.side === GlobalUnitsModel.Side.JAPAN) {
      // no US fleets -> use Midway for search instead
      const locationB = Controller.MIDWAY_HEX
      const hexB = {
        q: locationB.currentHex.q,
        r: locationB.currentHex.r,
      }
      shortestDist = distanceBetweenHexes(hexA, hexB)
    }
    return shortestDist
  }

  calcSearchResults(distances) {
    let jpVal = Math.max(1, GlobalUnitsModel.SearchValue.JP_AF - distances.jp_af)
    jpVal = Math.min(4, jpVal)
    let usVal = Math.max(
      1,
      GlobalUnitsModel.SearchValue.US_CSF - distances.us_csf,
      GlobalUnitsModel.SearchValue.US_MIDWAY - distances.us_midway
    )
    usVal = Math.min(4, usVal)
    return {
      JAPAN: jpVal,
      US: usVal,
    }
  }

  getAllUnitsInBoxes = (side, boxKey) => {
    const boxes = this.airOperationsModel.getBoxesByKey(side, boxKey)

    const airUnitsArray = new Array()
    const bxModel = this.boxModel
    Object.keys(boxes).forEach(function (key, index) {
      airUnitsArray.push(bxModel.getAirUnitInBox(key))
    })

    return airUnitsArray
  }

  determineInitiative = (japanDieRoll, usDieRoll) => {
    if (GlobalGameState.airOperationPoints.japan === 0 && GlobalGameState.airOperationPoints.us > 0) {
      return GlobalUnitsModel.Side.US
    }

    if (GlobalGameState.airOperationPoints.us === 0 && GlobalGameState.airOperationPoints.japan > 0) {
      return GlobalUnitsModel.Side.JAPAN
    }

    if (GlobalGameState.airOperationPoints.japan === 0 && GlobalGameState.airOperationPoints.us === 0) {
      return null
    }
    const japanTotal = japanDieRoll + GlobalGameState.airOperationPoints.japan
    const usTotal = usDieRoll + GlobalGameState.airOperationPoints.us

    if (japanTotal > usTotal) {
      return GlobalUnitsModel.Side.JAPAN
    } else if (usTotal > japanTotal) {
      return GlobalUnitsModel.Side.US
    }

    // if the two totals are equal winner is the side with higher air ops
    if (GlobalGameState.airOperationPoints.japan > GlobalGameState.airOperationPoints.us) {
      return GlobalUnitsModel.Side.JAPAN
    } else if (GlobalGameState.airOperationPoints.us > GlobalGameState.airOperationPoints.japan) {
      return GlobalUnitsModel.Side.US
    }

    // if totals and air ops both equal, needs a re-roll - return null
    return null
  }

  viewEventHandler(event) {
    // event contains type and data

    // TODO for air unit move events, check if it is initial set up or not
    switch (event.type) {
      case Controller.EventTypes.AIR_UNIT_SETUP:
        this.airUnitSetupHandler.handleEvent(event)
        break
      case Controller.EventTypes.FLEET_SETUP:
        this.fleetUnitSetupHandler.handleEvent(event)
        break

      default:
        console.log(`Unknown event type: ${event.type}`)
    }
  }
}
