import BoxModel from "../model/BoxModel"
import CardModel from "../model/CardModel"
import MapModel from "../model/MapModel"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import ViewEventAirUnitSetupHandler from "./ViewEventAirUnitSetupHandler"
import ViewEventFleetUnitSetupHandler from "./ViewEventFleetUnitSetupHandler"
import { distanceBetweenHexes } from "../components/HexUtils"
import GlobalGameState from "../model/GlobalGameState"
import AirOperationsModel from "../model/AirOperationsModel"
import ViewEventAirUnitMoveHandler from "./ViewEventAirUnitMoveHandler"
import ViewDieRollEventHandler from "./ViewDieRollEventHandler"
import ViewEventStrikeGroupMoveHandler from "./ViewEventStrikeGroupMoveHandler"
import ViewEventSelectionHandler from "./ViewEventSelectionHandler"

export default class Controller {
  static EventTypes = {
    AIR_UNIT_SETUP: "AirUnitSetup",
    FLEET_SETUP: "FleetSetup",
    AIR_UNIT_MOVE: "StrikeGroupSetup",
    INITIATIVE_ROLL: "Initiative Roll",
    STRIKE_GROUP_MOVE: "StrikeGroupMove",
    TARGET_SELECTION_ROLL: "Target Selection Roll",
    TARGET_SELECTION: "Target Selection",
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
    this.airUnitMoveHandler = new ViewEventAirUnitMoveHandler(this)
    this.dieRollEventHandler = new ViewDieRollEventHandler(this)
    this.stikeGroupMoveEventHandler = new ViewEventStrikeGroupMoveHandler(this)
    this.selectionEventHandler = new ViewEventSelectionHandler(this)
  }

  setCounters(counters) {
    this.counters = counters
  }

  getAllAirUnits(side) {
    const units = Array.from(this.counters.values())
    const airCounters = units.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)
    return airCounters
  }

  getAllCAPDefenders(side) {
    const units = Array.from(this.counters.values())
    const defenders = units.filter(
      (unit) => unit.constructor.name === "AirUnit" && unit.side === side && unit.aircraftUnit.intercepting
    )
    return defenders
  }

  getNumDefendingSteps(side) {
    const defenders = this.getAllCAPDefenders(side)
    var result = defenders.reduce(function (acc, obj) {
      return acc + obj.aircraftUnit.steps
    }, 0)
    return result
  }

  resetAllCapDefenders() {
    const units = Array.from(this.counters.values())
    for (let unit of units) {
      let airUnit = this.counters.get(unit.name)
      airUnit.aircraftUnit.intercepting = false
    }
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

  getAirUnitForName(name) {
    return this.counters.get(name)
  }

  setAirUnitForName(name, airUnit) {
    this.counters.set(name, airUnit)
  }

  getStrikeBoxes(name, side) {
    const unit = this.getAirUnitForName(name)
    let strikeBoxes = Object.values(this.airOperationsModel.getStrikeBoxesForSide(side))

    // if this is a fighter unit, filter out any empty boxes
    // (Fighters cannot be alone in a strike box)
    if (!unit.aircraftUnit.attack) {
      strikeBoxes = strikeBoxes.filter((box) => {
        const airUnitsInBox = this.boxModel.getAllAirUnitsInBox(box)
        return airUnitsInBox && airUnitsInBox.length > 0
      })
    }
    if (side === GlobalUnitsModel.Side.US) {
      // get all units for each strike box, any there
      // from a different carrer should be removed
      // (US cannot mix air units from different carriers in same strike)
      const carrier = this.getCarrierForAirUnit(name)

      strikeBoxes = strikeBoxes.filter((box) => {
        const airUnitsInBox = this.boxModel.getAllAirUnitsInBox(box)
        // if no air units in this box, no need to filter
        if (!airUnitsInBox || airUnitsInBox.length === 0) return true

        let carriers = airUnitsInBox.map((a) => a.carrier)
        return carriers.includes(carrier) || carriers.length === 0
      })
    }
    return strikeBoxes
  }

  getCarrierForAirUnit(name) {
    const airUnit = this.counters.get(name)
    if (airUnit) {
      return airUnit.carrier
    }
  }

  getCapBoxForNamedCarrier(carrierName, side) {
    const tf = this.getTaskForceForCarrier(carrierName, side)
    return Object.values(this.airOperationsModel.getCapBoxForNamedTaskForce(side, tf))[0]
  }

  getHangarBoxForNamedCarrier(carrierName, side) {
    const tf = this.getTaskForceForCarrier(carrierName, side)
    return Object.values(this.airOperationsModel.getHangarBoxForNamedCarrier(side, tf))[0]
  }

  getCapReturnAirBoxForNamedTaskForce(side, tf) {
    return Object.values(this.airOperationsModel.getCapReturnAirBoxForNamedTaskForce(side, tf))[0]
  }

  getReturn1AirBoxForNamedTaskForce(side, tf) {
    return Object.values(this.airOperationsModel.getReturn1AirBoxForNamedTaskForce(side, tf))[0]
  }

  getCAPBoxForTaskForce(tf, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (tf === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
        return GlobalUnitsModel.AirBox.JP_CD1_CAP
      } else {
        return GlobalUnitsModel.AirBox.JP_CD2_CAP
      }
    } else {
      if (tf === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
        return GlobalUnitsModel.AirBox.US_TF16_CAP
      }
      if (tf === GlobalUnitsModel.TaskForce.TASK_FORCE_17) {
        return GlobalUnitsModel.AirBox.US_TF17_CAP
      }
      return GlobalUnitsModel.AirBox.US_MIDWAY_CAP
    }
  }

  getTaskForceForCarrier(name, side) {
    const carrier = side === GlobalUnitsModel.Side.JAPAN ? this.getJapanFleetUnit(name) : this.getUSFleetUnit(name)
    return carrier.taskForce
  }

  getAllCarriersForSide(side) {
    const fleetUnits =
      side === GlobalUnitsModel.Side.JAPAN
        ? Array.from(GlobalUnitsModel.jpFleetUnits.values())
        : Array.from(GlobalUnitsModel.usFleetUnits.values())

    if (side === GlobalUnitsModel.Side.JAPAN) {
      return fleetUnits
    }
    const distance = this.numHexesBetweenFleets({ name: "CSF", side }, { name: "MIDWAY" })
    if (distance <= 2) {
      return fleetUnits
    }
    return fleetUnits.filter((n) => n.name.toUpperCase() != "MIDWAY")
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
    const otherCarrier = units.filter((unit) => unit.name != carrierName)
    return otherCarrier.length === 1 ? otherCarrier[0] : undefined
  }

  getAirBoxForNamedShip(side, name, box) {
    return Object.values(this.airOperationsModel.getAirBoxForNamedShip(side, name, box))[0]
  }

  getCarriersInOtherTF(tf, side, addMidway) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const otherTaskForce =
        tf === GlobalUnitsModel.TaskForce.CARRIER_DIV_1
          ? GlobalUnitsModel.TaskForce.CARRIER_DIV_2
          : GlobalUnitsModel.TaskForce.CARRIER_DIV_1
      return this.getAllCarriersInTaskForce(otherTaskForce, side)
    } else {
      const otherTaskForce =
        tf === GlobalUnitsModel.TaskForce.TASK_FORCE_16
          ? GlobalUnitsModel.TaskForce.TASK_FORCE_17
          : GlobalUnitsModel.TaskForce.TASK_FORCE_16
      const carriers = this.getAllCarriersInTaskForce(otherTaskForce, side)
      if (addMidway) {
        carriers.push(GlobalUnitsModel.Carrier.MIDWAY)
      }
      return carriers
    }
  }

  setAllUnitsToNotMoved() {
    const airunits = this.counters.values().filter((unit) => unit.constructor.name === "AirUnit")

    for (const unit of airunits) {
      unit.aircraftUnit.moved = false
      this.counters.set(unit.name, unit)
    }

    const strikeUnits = this.counters.values().filter((unit) => unit.constructor.name === "StrikeGroupUnit")

    for (const unit of strikeUnits) {
      unit.moved = false
      this.counters.set(unit.name, unit)
    }
  }
  getStrikeGroupsNotMoved(side) {
    const strikeGroups = this.getAllStrikeGroups(side)
    return strikeGroups.length > 0 && strikeGroups.filter((sg) => sg.moved === false || sg.moved === undefined)
  }

  getAllStrikeGroups(side) {
    // return list of strike groups containing one or more units

    const boxes = this.airOperationsModel.getStrikeBoxesForSide(side)
    const sgMap = side === GlobalUnitsModel.Side.US ? GlobalUnitsModel.usStrikeGroups : GlobalUnitsModel.jpStrikeGroups
    let array = new Array()
    for (const [_, value] of Object.entries(boxes)) {
      const airUnits = this.getAllAirUnitsInBox(value)
      if (airUnits.length > 0) {
        const strikeGroup = new Map([...sgMap].filter(([_, v]) => v.box === value))
        const valuesArray = Array.from(strikeGroup.values())
        array = array.concat(valuesArray)
      }
    }
    return array
  }

  getAttackingStrikeUnitsForTF(tf, side) {
    const fleetBeingAttacked = this.getFleetForTaskForce(tf, side)
    const location = this.getFleetLocation(fleetBeingAttacked, side)

    const strikeGroups = this.getAllStrikeGroupsInLocation(location, GlobalGameState.sideWithInitiative)

    let unitsInGroup = this.getAirUnitsInStrikeGroups(strikeGroups[0].box)
    return unitsInGroup
  }

  anyFightersInStrike(tf, side) {
    const units = this.getAttackingStrikeUnitsForTF(tf, side).filter((airUnit) => !airUnit.aircraftUnit.attack)
    return units.length > 0
  }

  getAirUnitsInStrikeGroups(name) {
    const airUnits = this.getAllAirUnitsInBox(name)
    return airUnits
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

  // side is attacker so use other side for defender (ie fleets)
  checkForAirAttack = (location, side) => {
    const otherSide = side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.Side.US : GlobalUnitsModel.Side.JAPAN

    const fleets = this.getAllFleetsInLocation(location, side)

    const strikeGroups = this.getAllStrikeGroupsInLocation(location, side)
    return fleets.length > 0 && strikeGroups.length > 0
  }

  getAllFleetsInLocation(location, side) {
    return this.mapModel.getAllFleetsInLocation(location, side, this.counters)
  }

  getAllStrikeGroupsInLocation = (location, side) => {
    return this.mapModel.getAllStrikeGroupsInLocation(location, side)
  }
  getStrikeGroupLocation = (stikeGroupName, side) => {
    return this.mapModel.getStrikeGroupLocation(stikeGroupName, side)
  }

  setStrikeGroupLocation(id, location, side) {
    this.mapModel.setStrikeGroupLocation(id, location, side)
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

  isSunk(name) {
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return false
    }
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.isSunk
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      return carrier.isSunk
    }
  }

  isFlightDeckAvailable(carrierName, side) {
    let hits = 0
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(carrierName)
      hits = carrier.hits
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(carrierName)
      hits = carrier.hits
    }
    // return false if both slots either damaged or occupied by an air unit
    const flightDeckBox = this.airOperationsModel.getAirBoxForNamedShip(side, carrierName, "FLIGHT")
    let boxName = Object.values(flightDeckBox)[0]
    const units = this.getAllAirUnitsInBox(boxName)

    // for carriers if hits + units length >= 2 unavailable, for Midway 3
    const capacity = carrierName.toUpperCase().includes("MIDWAY") ? 3 : 2

    const totalUnavailableSlots = hits + units.length

    const retVal = totalUnavailableSlots < capacity
    return retVal
  }

  isHangarAvailable(name) {
    const baseCapacity = name === GlobalUnitsModel.Carrier.MIDWAY ? 7 : 5
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    const flightDeckDamaged = this.isFlightDeckDamaged(name, side)
    const currentLoad = this.numUnitsOnCarrier(name, side)

    return !flightDeckDamaged && currentLoad < baseCapacity
  }

  setAirUnitEliminated(name, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const airUnit = this.getJapanAirUnit(name)
      airUnit.steps = 0
    } else {
      const airUnit = this.getUSAirUnit(name)
      airUnit.steps = 0
    }
  }

  setCarrierHits(name, hits) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      carrier.hits = hits
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      carrier.hits = hits
    }
  }

  getCarrierHits(name) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.hits
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      return carrier.hits
    }
  }

  isFlightDeckDamaged(name) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.hits === 2
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      return (
        (name === GlobalUnitsModel.Carrier.MIDWAY && carrier.hits === 3) ||
        (name !== GlobalUnitsModel.Carrier.MIDWAY && carrier.hits === 2)
      )
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

  setReorganizationUnits(name, units) {
    this.airOperationsModel.setReorganizationUnits(name, units)
  }

  getReorganizationUnits(name) {
    return this.airOperationsModel.getReorganizationUnits(name)
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

  japanHandContainsCard(cardNum) {
    return this.cardModel.japanHandContainsCard(cardNum)
  }

  usHandContainsCard(cardNum) {
    return this.cardModel.usHandContainsCard(cardNum)
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
    if (fleetA.name.toUpperCase() === "MIDWAY") {
      locationA = Controller.MIDWAY_HEX
    } else if (fleetB.name.toUpperCase() === "MIDWAY") {
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
  getFleetForTaskForce(tf, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return "1AF"
    }
    if (tf.name.toUpperCase() != "MIDWAY") return "CSF"
    return "MIDWAY"
  }
  determineTarget = (roll) => {
    let actualTarget = GlobalGameState.airAttackTarget
    const side = GlobalGameState.sideWithInitiative
    if (side === GlobalUnitsModel.Side.US) {
      if (roll < 6) {
        return actualTarget
      }
      return actualTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1
        ? GlobalUnitsModel.TaskForce.CARRIER_DIV_2
        : GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    } else {
      if (roll < 7) {
        // QUACK set back to 4
        return actualTarget
      }
      return actualTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_16
        ? GlobalUnitsModel.TaskForce.TASK_FORCE_17
        : GlobalUnitsModel.TaskForce.TASK_FORCE_16
    }
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
    // console.log("japanDieRoll = ", japanDieRoll, "usDieRoll = ", usDieRoll)
    // console.log("japan air ops = ", GlobalGameState.airOperationPoints.japan, "us air ops = ", GlobalGameState.airOperationPoints.us)
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

      case Controller.EventTypes.AIR_UNIT_MOVE:
        this.airUnitMoveHandler.handleEvent(event)
        break

      case Controller.EventTypes.INITIATIVE_ROLL:
        this.dieRollEventHandler.handlInitiativeDiceRollEvent(event)
        break

      case Controller.EventTypes.TARGET_SELECTION:
        this.selectionEventHandler.handleSelectTargetEvent(event)
        break
      case Controller.EventTypes.TARGET_SELECTION_ROLL:
        this.dieRollEventHandler.handleTargetSelectionDiceRollEvent(event)
        break

      case Controller.EventTypes.STRIKE_GROUP_MOVE:
        this.stikeGroupMoveEventHandler.handleEvent(event)
        break

      default:
        console.log(`Unknown event type: ${event.type}`)
    }
  }
}
