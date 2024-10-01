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
import ViewEventCapHandler from "./ViewEventCapHandler"
import { isMidwayHex } from "../components/HexUtils"

export default class Controller {
  static EventTypes = {
    AIR_UNIT_SETUP: "AirUnitSetup",
    FLEET_SETUP: "FleetSetup",
    AIR_UNIT_MOVE: "StrikeGroupSetup",
    INITIATIVE_ROLL: "Initiative Roll",
    STRIKE_GROUP_MOVE: "StrikeGroupMove",
    TARGET_SELECTION_ROLL: "Target Selection Roll",
    TARGET_SELECTION: "Target Selection",
    SELECT_CAP_UNITS: "Select CAP Units",
    ALLOCATE_DAMAGE: "Damage Allocation",
    ESCORT_ATTACK_ROLL: "Escort Counterattack Roll",
    CAP_INTERCEPTION_ROLL: "CAP Interception Roll",
    AAA_ROLL: "Anti Aircraft Fire Roll",
    CARRIER_TARGET_SELECTION: "Carrier Targets Selection",
    ATTACK_RESOLUTION_ROLL: "Attack Resolution Roll",
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
    this.targetMap = new Map() // map of air unit -> target
    this.airOperationsModel = new AirOperationsModel()
    this.airUnitSetupHandler = new ViewEventAirUnitSetupHandler(this)
    this.fleetUnitSetupHandler = new ViewEventFleetUnitSetupHandler(this)
    this.airUnitMoveHandler = new ViewEventAirUnitMoveHandler(this)
    this.dieRollEventHandler = new ViewDieRollEventHandler(this)
    this.stikeGroupMoveEventHandler = new ViewEventStrikeGroupMoveHandler(this)
    this.selectionEventHandler = new ViewEventSelectionHandler(this)
    this.capHandler = new ViewEventCapHandler(this)
  }

  clearTargetMap() {
    this.targetMap = new Map()
  }

  targetMapSize() {
    return Array.from(this.targetMap.keys()).length
  }

  autoSelectTaskForceTarget(sideBeingAttacked) {
    let autoSelectTarget = null
    if (sideBeingAttacked == GlobalUnitsModel.Side.JAPAN) {
      if (this.isSunk(GlobalUnitsModel.Carrier.AKAGI) && this.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.HIRYU) && this.isSunk(GlobalUnitsModel.Carrier.SORYU)) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
      }
    } else {
      if (this.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE) && this.isSunk(GlobalUnitsModel.Carrier.HORNET)) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_17
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.YORKTOWN)) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_16
      }
      // @TODO Add Midway
    }
    return autoSelectTarget
  }
  setAirUnitTarget(airUnit, target) {
    if (GlobalGameState.carrierTarget1 !== target && GlobalGameState.carrierTarget2 !== target) {
      if (GlobalGameState.carrierTarget1 === "" || GlobalGameState.carrierTarget1 === undefined) {
        GlobalGameState.carrierTarget1 = target
      } else {
        GlobalGameState.carrierTarget2 = target
      }
    }
    this.targetMap.set(airUnit, target)
  }

  getAirUnitTarget(airUnit) {
    return this.targetMap.get(airUnit)
  }

  getAttackTargets() {
    const array = Array.from(this.targetMap.values())

    const set = [...new Set(array)]
    // console.log(set) // [1, 2, 3, 4, 5]

    return set
  }

  getTargetMapSizeForCarrier(carrier) {
    const x = Array.from(this.targetMap.values()).filter((v) => v === carrier)
    return x.length
  }

  resetTargetMap() {
    this.targetMap.clear()
  }
  getTargetMapSize() {
    return Array.from(this.targetMap.values()).length
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

  getNextAvailableMarker(damagedOrSunk) {
    if (damagedOrSunk === "DAMAGED") {
      return GlobalUnitsModel.damageMarkers[GlobalGameState.nextAvailableDamageMarker]
    } else {
      return GlobalUnitsModel.sunkMarkers[GlobalGameState.nextAvailableSunkMarker]
    }
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

    // do not return strike boxes containing a strike group which has already moved
    strikeBoxes = strikeBoxes.filter((box) => {
      const strikeGroup = this.getStrikeGroupForBox(side, box)
      return strikeGroup.moved === false
    })

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
    } else {
      // If this is Japan Midway attack, only allow one strike group.
      // If one already exists only allow those boxes as destination
      // 1. Get num strike groups
      //    => if none, we're done
      //    => If 1, return only those boxes
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
        const groups = this.getAllStrikeGroups(GlobalUnitsModel.Side.JAPAN)
        if (groups.length === 1) {
          strikeBoxes = new Array()
          const strikeGroup = this.getStrikeGroupForBox(side, groups[0].box)
          if (!strikeGroup.moved) {
            strikeBoxes.push(groups[0].box)
          }
        }
      }
    }
    return strikeBoxes
  }

  getCarrierForAirUnit(name) {
    const airUnit = this.counters.get(name)
    if (airUnit) {
      return airUnit.carrier
    }
  }
  C

  getCapBoxForNamedCarrier(carrierName, side) {
    const tf = this.getTaskForceForCarrier(carrierName, side)
    return Object.values(this.airOperationsModel.getCapBoxForNamedTaskForce(side, tf))[0]
  }

  getHangarBoxForNamedCarrier(carrierName, side) {
    const tf = this.getTaskForceForCarrier(carrierName, side)
    return Object.values(this.airOperationsModel.getHangarBoxForNamedCarrier(side, tf))[0]
  }

  getCapReturnBoxForAirUnit(airUnit, side) {
    const tf = this.getTaskForceForCarrier(airUnit.carrier, side)
    return this.getCapReturnAirBoxForNamedTaskForce(side, tf)
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

  getStrikeUnitsAttackingNamedCarrier(carrierName) {
    // only return strike units attacking this carrier

    // filter target map on this carrier

    const x = new Map([...this.targetMap].filter(([_, v]) => v === carrierName))
    return Array.from(x.keys())
  }

  getStrikeUnitsAttackingCarrier() {
    if (GlobalGameState.TESTING) {
      return this.getAttackingStrikeUnitsTEST(
        GlobalUnitsModel.TaskForce.TASK_FORCE_16,
        GlobalUnitsModel.Carrier.ENTERPRISE
      )
    }
    // only return strike units attacking this carrier
    
    // filter target map on this carrier
    const x = new Map([...this.targetMap].filter(([_, v]) => v === GlobalGameState.currentCarrierAttackTarget))
    return Array.from(x.keys())
  }

  getAttackingStepsRemainingTEST() {
    return 16
  }

  getAttackingStrikeUnitsTEST(carrierDiv, carrier) {
    GlobalGameState.currentCarrierAttackTarget = carrier
    GlobalGameState.taskForceTarget = carrierDiv
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN

    const edb1 = this.counters.get("Enterprise-SBD3-1")
    const etb = this.counters.get("Enterprise-TBD1")
    const hotb = this.counters.get("Hornet-TBD1")
    const kdb = this.counters.get("Kaga-D3A-1")
    const ktb = this.counters.get("Kaga-B5N-2")
    const adb = this.counters.get("Akagi-D3A-1")
    const atb = this.counters.get("Akagi-B5N-2")
    const haf1 = this.counters.get("Hiryu-A6M-2b-1")
    const haf2 = this.counters.get("Hiryu-A6M-2b-2")
    const hdb = this.counters.get("Hiryu-D3A-1")
    const htb = this.counters.get("Hiryu-B5N-2")
    const saf1 = this.counters.get("Soryu-A6M-2b-1")
    const saf2 = this.counters.get("Soryu-A6M-2b-2")
    const sdb = this.counters.get("Soryu-D3A-1")
    const stb = this.counters.get("Soryu-B5N-2")

    // this.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, adb)
    // this.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, atb)
    // this.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kdb)
    // this.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, ktb)

    // this.setCarrierSternDamaged(GlobalUnitsModel.Carrier.ENTERPRISE)
    // this.setCarrierBowDamaged(GlobalUnitsModel.Carrier.ENTERPRISE)

    this.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)
    this.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, etb)

    // this.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 1, hotb)

    // this.setCarrierSternDamaged(GlobalUnitsModel.Carrier.HIRYU)
    // this.setCarrierBowDamaged(GlobalUnitsModel.Carrier.SORYU)

    // this.setCarrierBowDamaged(GlobalUnitsModel.Carrier.HIRYU)
    // this.setCarrierSternDamaged(GlobalUnitsModel.Carrier.SORYU)

    kdb.aircraftUnit.steps = 1
    kdb.image = "/images/aircounters/kaga-d3a-back.png"

    ktb.aircraftUnit.steps = 1
    ktb.image = "/images/aircounters/kaga-b5n-back.png"

    hdb.aircraftUnit.steps = 1
    hdb.image = "/images/aircounters/hiryu-d3a-back.png"

    stb.aircraftUnit.steps = 1
    stb.image = "/images/aircounters/soryu-b5n-back.png"
    // return [kdb, ktb]
    return [kdb, ktb, adb, atb, hdb, htb, sdb, stb]

    // return [kdb, ktb, adb, atb]
  }

  attackAircraftOnDeck() {
    const side = GlobalUnitsModel.carrierSideMap.get(GlobalGameState.currentCarrierAttackTarget)
    const flightDeckBox = this.airOperationsModel.getAirBoxForNamedShip(
      side,
      GlobalGameState.currentCarrierAttackTarget,
      "FLIGHT"
    )
    let boxName = Object.values(flightDeckBox)[0]
    const attackUnitsOnFlightDeck = this.getAttackAircraftInBox(boxName)
    return attackUnitsOnFlightDeck.length > 0
  }

  combinedAttack() {
    const units = this.getStrikeUnitsAttackingCarrier()

    let dbFound = false
    let torpFound = false
    for (const unit of units) {
      if (unit.aircraftUnit.diveBomber) {
        dbFound = true
      } else {
        torpFound = true
      }
      if (dbFound && torpFound) {
        return true
      }
    }
    return false
  }

  getTargetForAttack() {
    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_17) {
      if (this.isSunk(GlobalUnitsModel.Carrier.YORKTOWN)) {
        return null
      }
      return GlobalUnitsModel.Carrier.YORKTOWN
    }

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
      return GlobalUnitsModel.Carrier.MIDWAY
    }

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
      if (this.isSunk(GlobalUnitsModel.Carrier.AKAGI) && !this.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
        return GlobalUnitsModel.Carrier.KAGA
      }

      if (!this.isSunk(GlobalUnitsModel.Carrier.AKAGI) && this.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
        return GlobalUnitsModel.Carrier.AKAGI
      }
      return null
    }

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
      if (this.isSunk(GlobalUnitsModel.Carrier.HIRYU) && !this.isSunk(GlobalUnitsModel.Carrier.SORYU)) {
        return GlobalUnitsModel.Carrier.SORYU
      }

      if (!this.isSunk(GlobalUnitsModel.Carrier.HIRYU) && this.isSunk(GlobalUnitsModel.Carrier.SORYU)) {
        return GlobalUnitsModel.Carrier.HIRYU
      }
      return null
    }

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
      if (this.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE) && !this.isSunk(GlobalUnitsModel.Carrier.HORNET)) {
        return GlobalUnitsModel.Carrier.HORNET
      }

      if (!this.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE) && this.isSunk(GlobalUnitsModel.Carrier.HORNET)) {
        return GlobalUnitsModel.Carrier.ENTERPRISE
      }
      return null
    }
  }

  autoAssignTargets() {
    let carrierAttackTarget = this.getTargetForAttack()
    if (carrierAttackTarget === null) {
      console.log("Cannot auto assign targets, no target available")
      return null
    }
    const unitsInGroup = this.getAttackingStrikeUnits(true)

    for (let airUnit of unitsInGroup) {
      this.setAirUnitTarget(airUnit, carrierAttackTarget)
    }
  }

  getAttackingStepsRemaining() {
    const unitsInGroup = this.getAttackingStrikeUnits(true)
    let totalSteps = 0
    const airCounters = unitsInGroup.map((airUnit) => {
      if (!airUnit.aircraftUnit.attack) {
        return
      }
      totalSteps += airUnit.aircraftUnit.steps
    })
    return totalSteps
  }
  getAttackingStrikeUnits(excludeFighters) {
    const sideBeingAttacked =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
        ? GlobalUnitsModel.Side.JAPAN
        : GlobalUnitsModel.Side.US
    const fleetBeingAttacked = this.getFleetForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)
    let location
    if (fleetBeingAttacked === "MIDWAY") {
      location = Controller.MIDWAY_HEX
    } else {
      location = this.getFleetLocation(fleetBeingAttacked, sideBeingAttacked)
      // console.log(
      //   "fleetBeingAttacked=",
      //   fleetBeingAttacked,
      //   "sideBeingAttacked=",
      //   sideBeingAttacked,
      //   "location=",
      //   location
      // )
    }

    const strikeGroups = this.getAllStrikeGroupsInLocation(location, GlobalGameState.sideWithInitiative)

    if (strikeGroups.length === 0) {
      return []
    }

    let unitsInGroup
    let index = 0
    for (let sg of strikeGroups) {
      if (index === strikeGroups.length) {
        return []
      }
      if (!sg.attacked) {
        unitsInGroup = this.getAirUnitsInStrikeGroups(strikeGroups[index].box)
        break
      }
      index++
    }

    if (excludeFighters) {
      unitsInGroup = unitsInGroup.filter((unit) => unit.aircraftUnit.attack === true)
    }
    return unitsInGroup
  }

  getAttackingStrikeUnitsForTF(tf, side) {
    const sideBeingAttacked =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
        ? GlobalUnitsModel.Side.JAPAN
        : GlobalUnitsModel.Side.US
    const fleetBeingAttacked = this.getFleetForTaskForce(tf, side)

    let location
    if (fleetBeingAttacked === "MIDWAY") {
      location = Controller.MIDWAY_HEX
    } else {
      location = this.getFleetLocation(fleetBeingAttacked, sideBeingAttacked)
    }
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

  getAttackAircraftInBox = (boxName) => {
    let attackers = this.getAllAirUnitsInBox(boxName)
    return attackers.filter((unit) => unit.aircraftUnit.attack)
  }

  getAllFightersInBox = (boxName) => {
    let attackers = this.getAllAirUnitsInBox(boxName)
    return attackers.filter((unit) => !unit.aircraftUnit.attack)
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

  setMarkerLocation = (markerName, boxName, boxIndex) => {
    this.boxModel.setMarkerLocation(markerName, { boxName, boxIndex })
  }

  getMarkerLocation = (markerName) => {
    return this.boxModel.getMarkerLocation(markerName)
  }

  getAirUnitLocation = (airUnitName) => {
    return this.boxModel.getAirUnitLocation(airUnitName)
  }

  getStrikeGroupForBox(side, box) {
    if (side === GlobalUnitsModel.Side.US) {
      return GlobalUnitsModel.usStrikeGroups.get(box)
    } else {
      return GlobalUnitsModel.jpStrikeGroups.get(box)
    }
  }
  // side is attacker so use other side for defender (ie fleets)
  checkForAirAttack = (location, side) => {
    const strikeGroups = this.getAllStrikeGroupsInLocation(location, side)
    if (side === GlobalUnitsModel.Side.JAPAN && isMidwayHex(location.currentHex)) {
      return strikeGroups.length > 0
    }
    const fleets = this.getAllFleetsInLocation(location, side, true)

    return fleets.length > 0 && strikeGroups.length > 0
  }

  getAllFleetsInLocation(location, side, filterOtherSide) {
    return this.mapModel.getAllFleetsInLocation(location, side, this.counters, filterOtherSide)
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

  getCarrier(name) {
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return GlobalUnitsModel.Carrier.MIDWAY
    }
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    let carrier
    if (side === GlobalUnitsModel.Side.JAPAN) {
      carrier = GlobalUnitsModel.jpFleetUnits.get(name)
    } else {
      carrier = GlobalUnitsModel.usFleetUnits.get(name)
    }
    return carrier
  }

  isMidwayBaseDestroyed() {
    return GlobalGameState.totalMidwayHits >= 3
  }

  isSunk(name) {
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return this.isMidwayBaseDestroyed()
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

  addHitToCarrier(name, dieRoll) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    let carrier
    if (side === GlobalUnitsModel.Side.JAPAN) {
      carrier = GlobalUnitsModel.jpFleetUnits.get(name)
    } else {
      carrier = GlobalUnitsModel.usFleetUnits.get(name)
    }

    if (carrier.hits === 3) {
      return
    }
    if (carrier.hits === 2) {
      carrier.hits = 3 // sunk
      return
    }
    if (carrier.hits === 1) {
      carrier.hits = 2
      if (!carrier.bowDamaged) {
        this.setCarrierBowDamaged(name)
      } else {
        this.setCarrierSternDamaged(name)
      }
      return
    }
    // no damage to this carrier, use dieRoll to determine what is hit
    carrier.hits = 1
    if (dieRoll < 4) {
      this.setCarrierBowDamaged(name)
    } else {
      this.setCarrierSternDamaged(name)
    }
  }
  setCarrierBowDamaged(name) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      carrier.bowDamaged = true
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      carrier.bowDamaged = true
    }
  }

  getCarrierBowDamaged(name) {
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return false
    }
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.bowDamaged
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      return carrier.bowDamaged
    }
  }

  setCarrierSternDamaged(name) {
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return false
    }
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      carrier.sternDamaged = true
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      carrier.sternDamaged = true
    }
  }

  getCarrierSternDamaged(name) {
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.sternDamaged
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      return carrier.sternDamaged
    }
  }

  getCarrierHits(name) {
    if (!name) {
      return
    }
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
      if (fleet.toUpperCase().includes("MAP") || fleet.includes("SG")) {
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
    let jpVal = Math.max(1, GlobalGameState.SearchValue.JP_AF - distances.jp_af)

    jpVal -= GlobalGameState.midwayAirOpsCompleted
    jpVal = Math.max(0, jpVal)
    jpVal = Math.min(4, jpVal)

    let usVal = Math.max(
      1,
      GlobalGameState.SearchValue.US_CSF - distances.us_csf,
      GlobalGameState.SearchValue.US_MIDWAY - distances.us_midway
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
    if (tf.toUpperCase() != "MIDWAY") return "CSF"
    return "MIDWAY"
  }
  determineTarget = (roll) => {
    let actualTarget = GlobalGameState.taskForceTarget
    const side = GlobalGameState.sideWithInitiative
    if (side === GlobalUnitsModel.Side.US) {
      if (roll < 6) {
        return actualTarget
      }
      return actualTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1
        ? GlobalUnitsModel.TaskForce.CARRIER_DIV_2
        : GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    } else {
      if (roll < 4) {
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

      case Controller.EventTypes.ATTACK_RESOLUTION_ROLL:
        console.log("ATTACK RESOLUTION EVENT...")
        this.dieRollEventHandler.handleAttackResolutionDiceRollEvent(event)
        break

      case Controller.EventTypes.ALLOCATE_DAMAGE:
        this.selectionEventHandler.handleDamageEvent(event)
        break

      case Controller.EventTypes.CAP_INTERCEPTION_ROLL:
        this.dieRollEventHandler.handleCapInterceptionDiceRollEvent(event)
        break

      case Controller.EventTypes.ESCORT_ATTACK_ROLL:
        this.dieRollEventHandler.handleEscortCounterAttackDiceRollEvent(event)
        break

      case Controller.EventTypes.AAA_ROLL:
        this.dieRollEventHandler.handleAAADiceRollEvent(event)
        break

      case Controller.EventTypes.CARRIER_TARGET_SELECTION:
        this.selectionEventHandler.handleSelectCarrierTargetsEvent(event)
        break

      case Controller.EventTypes.STRIKE_GROUP_MOVE:
        this.stikeGroupMoveEventHandler.handleEvent(event)
        break

      case Controller.EventTypes.SELECT_CAP_UNITS:
        this.capHandler.handleCapSelectionEvent(event)
        break
      default:
        console.log(`Unknown event type: ${event.type}`)
    }
  }
}
