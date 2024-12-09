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
import ViewEventCarrierDamageHandler from "./ViewEventDamageHandler"
import ViewEventCardHandler from "./ViewEventCardHandler"
import { isMidwayHex } from "../components/HexUtils"
import HexCommand from "../commands/HexCommand"

export default class Controller {
  static EventTypes = {
    AIR_UNIT_SETUP: "AirUnitSetup",
    FLEET_SETUP: "FleetSetup",
    AIR_UNIT_MOVE: "StrikeGroupSetup",
    INITIATIVE_ROLL: "Initiative Roll",
    NAVAL_BATTLE_ROLL: "Naval Battle Roll",
    MIDWAY_GARRISON: "Midway Garrison Change",
    STRIKE_GROUP_MOVE: "StrikeGroupMove",
    TARGET_SELECTION_ROLL: "Target Selection Roll",
    TARGET_SELECTION: "Target Selection",
    SELECT_CAP_UNITS: "Select CAP Units",
    ASSIGN_DMCV_CARRIER: "Assign Carrier to DMCV Fleet",
    ALLOCATE_DAMAGE: "Damage Allocation",
    ESCORT_ATTACK_ROLL: "Escort Counterattack Roll",
    CAP_INTERCEPTION_ROLL: "CAP Interception Roll",
    AAA_ROLL: "Anti Aircraft Fire Roll",
    CARRIER_TARGET_SELECTION: "Carrier Targets Selection",
    ATTACK_RESOLUTION_ROLL: "Attack Resolution Roll",
    CARRIER_DAMAGE: "Carrier Damage Allocation",
    SUBMARINE_ATTACK_ROLL: "Submarine Attack Roll",
    MIDWAY_DAMAGE: "Midway Damage Allocation",
    CARD_PLAY: "Play Event Card",
    NAVAL_BOMBARDMENT_ROLL: "Naval Bombardment Roll",
    TROUBLED_RECON_ROLL: "Troubled Reconnaissance Roll",
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
    this.damageHandler = new ViewEventCarrierDamageHandler(this)
    this.cardEventHandler = new ViewEventCardHandler(this)
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
      if (
        (this.isSunk(GlobalUnitsModel.Carrier.AKAGI) ||
          GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.AKAGI) &&
        (this.isSunk(GlobalUnitsModel.Carrier.KAGA) || GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.KAGA)
      ) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
      }
      if (
        (this.isSunk(GlobalUnitsModel.Carrier.HIRYU) ||
          GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.HIRYU) &&
        (this.isSunk(GlobalUnitsModel.Carrier.SORYU) ||
          GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.SORYU)
      ) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
      }
    } else {
      if (
        (this.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE, true) ||
          GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.ENTERPRISE) &&
        (this.isSunk(GlobalUnitsModel.Carrier.HORNET, true) ||
          GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.HORNET)
      ) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_17
      }
      if (
        this.isSunk(GlobalUnitsModel.Carrier.YORKTOWN, true) ||
        GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.YORKTOWN
      ) {
        autoSelectTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_16
      }
      // @TODO Add Midway
    }
    return autoSelectTarget
  }
  setAirUnitTarget(airUnit, target) {
    this.targetMap.set(airUnit, target)

    const targets = Array.from(this.targetMap.values())
    let carriers = [...new Set(targets)]

    GlobalGameState.carrierTarget1 = carriers[0]

    if (carriers.length === 2) {
      GlobalGameState.carrierTarget2 = carriers[1]
    } else {
      GlobalGameState.carrierTarget2 = undefined
    }
  }

  getTargetMap() {
    return this.targetMap
  }
  removeAirUnitTarget(airUnit) {
    this.targetMap.delete(airUnit)
  }
  getAirUnitTarget(airUnit) {
    return this.targetMap.get(airUnit)
  }

  getAttackTargets() {
    const array = Array.from(this.targetMap.values())

    const set = [...new Set(array)]
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

  getAllAirUnitsInReturn2Boxes(side) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)

    let units = new Array()
    for (const unit of defenders) {
      const location = this.getAirUnitLocation(unit.name)
      unit.location = location
      if (location.boxName.includes("RETURNING (2)")) {
        units.push(unit)
      }
    }
    return units
  }

  getAllAirUnitsInCAPBoxes(side) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)

    let units = new Array()
    for (const unit of defenders) {
      const location = this.getAirUnitLocation(unit.name)
      unit.location = location
      if (unit.aircraftUnit.moved) {
        continue // unit may have moved back to hangar and out again on a night operation
      }
      if (side === GlobalUnitsModel.Side.JAPAN) {
        if (
          location.boxName === GlobalUnitsModel.AirBox.JP_CD1_CAP ||
          location.boxName === GlobalUnitsModel.AirBox.JP_CD2_CAP
        ) {
          units.push(unit)
        }
      } else {
        if (
          location.boxName === GlobalUnitsModel.AirBox.US_TF16_CAP ||
          location.boxName === GlobalUnitsModel.AirBox.US_TF17_CAP ||
          location.boxName === GlobalUnitsModel.AirBox.US_MIDWAY_CAP
        ) {
          units.push(unit)
        }
      }
    }
    return units
  }

  getAllAirUnitsInReturn1Boxes(side) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)

    let units = new Array()
    for (const unit of defenders) {
      const location = this.getAirUnitLocation(unit.name)
      unit.location = location
      if (location.boxName.includes("RETURNING (1)")) {
        units.push(unit)
      }
    }
    return units
  }

  getAllCAPDefendersInCAPReturnBoxes(side) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)

    let units = new Array()
    for (const unit of defenders) {
      const location = this.getAirUnitLocation(unit.name)
      // TEST SHIT
      unit.location = location
      if (location.boxName.includes("CAP RETURNING")) {
        units.push(unit)
      }
    }
    return units
  }

  getAllReducedUnitsForSide(side) {
    const units = this.getAllAirUnits(side)
    const reducedUnits = units.filter(
      (unit) => unit.aircraftUnit.steps === 1 && unit.carrier !== GlobalUnitsModel.Carrier.MIDWAY
    )
    return reducedUnits
  }

  getAllEliminatedUnits(side) {
    let box =
      side === GlobalUnitsModel.Side.US ? GlobalUnitsModel.AirBox.US_ELIMINATED : GlobalUnitsModel.AirBox.JP_ELIMINATED
    const units = this.getAllAirUnits(side)
    const eliminatedAirUnits = units.filter(
      (unit) => this.getAirUnitLocation(unit.name).boxName === box && unit.carrier !== GlobalUnitsModel.Carrier.MIDWAY
    )
    return eliminatedAirUnits
  }

  getAllUnitsOnJapaneseFlightDecks(fighters) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter(
      (unit) => unit.constructor.name === "AirUnit" && unit.side === GlobalUnitsModel.Side.JAPAN
    )

    let units = new Array()
    for (const unit of defenders) {
      const location = this.getAirUnitLocation(unit.name)

      if (location.boxName.includes("FLIGHT")) {
        units.push(unit)
      }
    }
    // will either filter all fighters or all non-fighters
    units = units.filter((unit) => unit.aircraftUnit.attack !== fighters)
    return units
  }

  getAllCAPDefenders(side) {
    const units = Array.from(this.counters.values())
    const defenders = units.filter(
      (unit) => unit.constructor.name === "AirUnit" && unit.side === side && unit.aircraftUnit.intercepting
    )
    return defenders
  }

  getTotalSteps(airUnits) {
    let totalSteps = 0
    for (let unit of airUnits) {
      totalSteps += unit.aircraftUnit.steps
    }
    return totalSteps
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

  updateCounterData(name, value) {
    this.counters.set(name, value)
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

  getCarrierAirUnitLaunchedFrom(name) {
    const unit = this.getAirUnitForName(name)
    const location = this.getAirUnitLocation(name)

    let loc = location.boxName
    if (location.boxName.includes("STRIKE")) {
      loc = unit.launchedFrom
    }
    return this.getCarrierForAirBox(loc)
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

      // filter false if either moved is true or airopmoved is not undefined
      let x = true
      if (strikeGroup.moved === true || strikeGroup.attacked === true) {
        x = false
      }

      return x
    })

    if (side === GlobalUnitsModel.Side.US) {
      // get all units for each strike box, any there
      // from a different carrer should be removed
      // (US cannot mix air units from different carriers in same strike)

      // Note different carriers means carrier where unit launches from
      // not original carrier printed on the counter
      // const carrier = this.getCarrierForAirUnit(name)

      const carrier = this.getCarrierAirUnitLaunchedFrom(name)

      strikeBoxes = strikeBoxes.filter((box) => {
        const airUnitsInBox = this.boxModel.getAllAirUnitsInBox(box)
        // if no air units in this box, no need to filter
        if (!airUnitsInBox || airUnitsInBox.length === 0) return true

        let carriers = airUnitsInBox.map((a) => this.getCarrierAirUnitLaunchedFrom(a.name))
        return carriers.includes(carrier) || carriers.length === 0
      })
    } else {
      // If this is Japan Midway attack, only allow one strike group.
      // If one already exists only allow those boxes as destination
      // 1. Get num strike groups
      //    => if none, we're done
      //    => If 1 or more check if any are already set to midway attack group
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
        const groups = this.getAllStrikeGroups(GlobalUnitsModel.Side.JAPAN)
        const found = false
        for (let group of groups) {
          if (group.name === GlobalGameState.midwayAttackGroup) {
            strikeBoxes = new Array()
            const strikeGroup = this.getStrikeGroupForBox(side, groups[0].box)
            if (!strikeGroup.moved) {
              strikeBoxes.push(groups[0].box)
              found = true
            }
          }
        }
        // for (let group of groups) {
        //   if (group.name !== GlobalGameState.midwayAttackGroup) {
        //     strikeBoxes = new Array()
        //     const strikeGroup = this.getStrikeGroupForBox(side, groups[0].box)
        //     if (!strikeGroup.moved) {
        //       strikeBoxes.push(groups[0].box)
        //     }
        //   }
        //   return strikeBoxes
        // }
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

  getTaskForceForAirBox(box) {
    return this.airOperationsModel.getTaskForceForAirBox(box)
  }

  getCarrierForAirBox(box) {
    return this.airOperationsModel.getCarrierForAirBox(box)
  }

  getReturn2AirBoxForNamedTaskForce(side, tf) {
    return Object.values(this.airOperationsModel.getReturn2AirBoxForNamedTaskForce(side, tf))[0]
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

  setAirOpAttacked(counterData) {
    if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
      counterData.airOpAttacked = GlobalGameState.airOpJapan
    } else {
      counterData.airOpAttacked = GlobalGameState.airOpUS
    }
  }

  setAirOpMoved(counterData) {
    if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
      counterData.airOpMoved = GlobalGameState.airOpJapan
      counterData.gameTurnMoved = GlobalGameState.gameTurn
    } else {
      counterData.airOpMoved = GlobalGameState.airOpUS
      counterData.gameTurnMoved = GlobalGameState.gameTurn
    }
  }
  getTaskForceForCarrier(name, side) {
    const carrier = side === GlobalUnitsModel.Side.JAPAN ? this.getJapanFleetUnit(name) : this.getUSFleetUnit(name)
    if (carrier == undefined) {
      console.log("ERROR cannot find carrier:", name, "side", side)
    }
    return carrier.taskForce
  }

  getAllCarriersForSide(side, excludeSunk) {
    let fleetUnits =
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
    if (excludeSunk === true) {
      fleetUnits = fleetUnits.filter((n) => !this.isSunk(n.name))
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

  getOtherTaskForce(tf, side) {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (tf === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
        return GlobalUnitsModel.TaskForce.CARRIER_DIV_2
      } else {
        return GlobalUnitsModel.TaskForce.CARRIER_DIV_1
      }
    } else {
      if (tf === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
        return GlobalUnitsModel.TaskForce.TASK_FORCE_17
      } else {
        return GlobalUnitsModel.TaskForce.TASK_FORCE_16
      }
    }
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
  setAllDefendersToNotIntercepting() {
    const airunits = this.counters.values().filter((unit) => unit.constructor.name === "AirUnit")

    for (const unit of airunits) {
      unit.aircraftUnit.intercepting = false
      this.counters.set(unit.name, unit)
    }
  }
  setAllDefendersToNotInterceptingAndNotSeparated() {
    const airunits = this.counters.values().filter((unit) => unit.constructor.name === "AirUnit")

    for (const unit of airunits) {
      unit.aircraftUnit.intercepting = false
      unit.aircraftUnit.separated = false
      this.counters.set(unit.name, unit)
    }
  }
  setUnitsToNotMoved(airunits) {
    for (const unit of airunits) {
      unit.aircraftUnit.moved = false
      this.counters.set(unit.name, unit)
      unit.aircraftUnit.hitsScored = 0
    }
  }
  async setAllUnitsToNotMoved() {
    const airunits = this.counters.values().filter((unit) => unit.constructor.name === "AirUnit")
    this.setUnitsToNotMoved(airunits)
  }

  getAllStrikeUnits(side) {
    // this is used at beginning of night operations
    const units = new Array()
    const strikeGroups = this.getAllStrikeGroups(side)
    for (const group of strikeGroups) {
      const unitsInGroup = this.getAirUnitsInStrikeGroups(group.box)
      for (const unit of unitsInGroup) {
        // allow new move from strike box to return box (manual)
        units.push(unit)
      }
    }
    return units
  }
  getAirUnitsInStrikeBoxesReadyToReturn(side) {
    const units = new Array()
    const strikeGroups = this.getAllStrikeGroups(side)
    for (const group of strikeGroups) {
      if (!group.attacked) {
        continue
      }
      const unitsInGroup = this.getAirUnitsInStrikeGroups(group.box)
      for (const unit of unitsInGroup) {
        // allow new move from strike box to return box (manual)
        units.push(unit)
      }
    }
    return units
  }

  getAttackingReturningUnitsNotMoved(side) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)

    const units = new Array()
    for (const unit of defenders) {
      if (unit.aircraftUnit.moved) {
        continue // only want units that have not yet moved
      }
      const location = this.getAirUnitLocation(unit.name)

      if (location.boxName.includes("RETURNING (2)") || location.boxName.includes("RETURNING (1)")) {
        units.push(unit)
      }
    }
    return units
  }
  getReturningUnitsNotMoved(side) {
    const airUnits = Array.from(this.counters.values())
    const defenders = airUnits.filter((unit) => unit.constructor.name === "AirUnit" && unit.side === side)

    for (const unit of defenders) {
      if (unit.aircraftUnit.moved) {
        continue // only want units that have not yet moved
      }
      const location = this.getAirUnitLocation(unit.name)
      if (
        location.boxName.includes("RETURNING (2)") ||
        location.boxName.includes("RETURNING (1)") ||
        location.boxName.includes("STRIKE BOX")
      ) {
        return true
      }
    }
    return false
  }
  getStrikeGroupsNotMoved2(side) {
    const strikeGroups = this.getAllStrikeGroups(side)
    if (strikeGroups.length === 0) {
      return false
    }
    for (let s of strikeGroups) {
      if (!s.moved) {
        return true
      }
    }
    return false
  }
  getStrikeGroupsNotMoved(side) {
    const strikeGroups = this.getAllStrikeGroups(side)
    const ret = strikeGroups.length > 0 && strikeGroups.filter((sg) => sg.moved === false || sg.moved === undefined)
    return ret
  }

  getSlowestUnitSpeedInStrikeGroup(box) {
    const unitsInGroup = this.getAirUnitsInStrikeGroups(box)
    for (let unit of unitsInGroup) {
      if (unit.aircraftUnit.movement === 2) {
        return 2
      }
    }
    return 3
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
    const carrier =
      GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.MIF ||
      GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.JAPAN_DMCV ||
      GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.US_DMCV
        ? undefined
        : GlobalGameState.currentCarrierAttackTarget
    // only return strike units attacking this carrier

    // filter target map on this carrier
    const x = new Map([...this.targetMap].filter(([_, v]) => v === carrier))
    return Array.from(x.keys())
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

  getNextAvailableFleetBox(side) {
    const locations = side === GlobalUnitsModel.Side.JAPAN ? this.getUSFleetLocations() : this.getJapanFleetLocations()

    const takenBoxes = new Array()
    for (let fleet of locations.keys()) {
      if (fleet.toUpperCase().includes("MAP") || fleet.includes("SG")) {
        continue
      }
      const location = locations.get(fleet)
      if (location.boxName === HexCommand.FLEET_BOX) {
        takenBoxes.push(location.boxIndex)
      }
    }
    const firstBox = 0
    for (let i = 0; i < takenBoxes.length; i++) {
      if (!takenBoxes.includes(i)) {
        return i
      }
    }
    return firstBox
  }

  anySubmarineTargets(side) {
    let numCarriersSunk = this.getSunkCarriers(side, true).length
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (numCarriersSunk === 4) {
        return false
      }
      // check if IJN DMCV fleet is off map
      const jpDMCVLocation = this.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
      if (numCarriersSunk === 3 && jpDMCVLocation.boxName === HexCommand.FLEET_BOX) {
        return false
      }
    } else {
      // check if US DMCV fleet is off map
      const usDMCVLocation = this.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
      if (numCarriersSunk === 3) {
        return false
      }
      if (numCarriersSunk === 2 && usDMCVLocation.boxName === HexCommand.FLEET_BOX) {
        return false
      }
    }
    return true
  }
  anyTargets(side) {
    let numCarriersSunk = this.getSunkCarriers(side, true).length
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (numCarriersSunk === 4) {
        return false
      }
      if (
        numCarriersSunk === 3 &&
        GlobalGameState.jpDMCVCarrier !== "" &&
        GlobalGameState.jpDMCVCarrier !== undefined
      ) {
        return false
      }
    } else {
      if (numCarriersSunk === 3) {
        return false
      }
      if (
        numCarriersSunk === 2 &&
        GlobalGameState.usDMCVCarrier !== "" &&
        GlobalGameState.usDMCVCarrier !== undefined
      ) {
        return false
      }
    }
    return true
  }
  allCarriersSunk(side) {
    let numCarriersSunk = this.getSunkCarriers(side, true).length

    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (numCarriersSunk === 4) {
        return true
      }
    } else {
      if (numCarriersSunk === 3) {
        return true
      }
    }
    return false
  }

  getSunkCarriers(side, countTowedAsSunk) {
    let sunkCarriers = new Array()
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (this.isSunk(GlobalUnitsModel.Carrier.AKAGI, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.AKAGI)
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.KAGA, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.KAGA)
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.HIRYU, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.HIRYU)
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.SORYU, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.SORYU)
      }
    } else {
      if (this.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.ENTERPRISE)
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.HORNET, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.HORNET)
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.YORKTOWN, countTowedAsSunk)) {
        sunkCarriers.push(GlobalUnitsModel.Carrier.YORKTOWN)
      }
    }
    return sunkCarriers
  }

  // get carriers with damage 2 (eligible for DMCV)
  getDamagedCarriers(side) {
    let damagedCarriers = new Array()
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.AKAGI) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.AKAGI)
      }
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.KAGA) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.KAGA)
      }
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.HIRYU) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.HIRYU)
      }
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.SORYU) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.SORYU)
      }
    } else {
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.ENTERPRISE)
      }
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.HORNET) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.HORNET)
      }
      if (this.getCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN) == 2) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.YORKTOWN)
      }
    }
    return damagedCarriers
  }

  getDamagedCarriersOneOrTwoHits(side) {
    let damagedCarriers = new Array()
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.AKAGI) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.AKAGI) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.AKAGI)
      }
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.KAGA) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.KAGA) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.KAGA)
      }
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.HIRYU) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.HIRYU) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.HIRYU)
      }
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.SORYU) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.SORYU) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.SORYU)
      }
    } else {
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.ENTERPRISE)
      }
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.HORNET) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.HORNET) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.HORNET)
      }
      if (
        this.getCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN) == 1 ||
        this.getCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN) == 2
      ) {
        damagedCarriers.push(GlobalUnitsModel.Carrier.YORKTOWN)
      }
    }
    return damagedCarriers
  }
  getTargetForAttack() {
    if (
      GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.JAPAN_DMCV ||
      GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.US_DMCV
    ) {
      return GlobalGameState.currentCarrierAttackTarget
    }
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
      if (
        GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.AKAGI &&
        !this.isSunk(GlobalUnitsModel.Carrier.KAGA)
      ) {
        return GlobalUnitsModel.Carrier.KAGA
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.AKAGI) && !this.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
        return GlobalUnitsModel.Carrier.KAGA
      }

      if (
        GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.KAGA &&
        !this.isSunk(GlobalUnitsModel.Carrier.AKAGI)
      ) {
        return GlobalUnitsModel.Carrier.AKAGI
      }
      if (!this.isSunk(GlobalUnitsModel.Carrier.AKAGI) && this.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
        return GlobalUnitsModel.Carrier.AKAGI
      }
      return null
    }

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
      if (
        GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.HIRYU &&
        !this.isSunk(GlobalUnitsModel.Carrier.SORYU)
      ) {
        return GlobalUnitsModel.Carrier.SORYU
      }
      if (this.isSunk(GlobalUnitsModel.Carrier.HIRYU) && !this.isSunk(GlobalUnitsModel.Carrier.SORYU)) {
        return GlobalUnitsModel.Carrier.SORYU
      }

      if (
        GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.SORYU &&
        !this.isSunk(GlobalUnitsModel.Carrier.HIRYU)
      ) {
        return GlobalUnitsModel.Carrier.HIRYU
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

    let unitsInGroup = new Array()
    const box = GlobalGameState.attackingStrikeGroup.box

    unitsInGroup = this.getAirUnitsInStrikeGroups(box)

    if (excludeFighters) {
      unitsInGroup = unitsInGroup.filter((unit) => unit.aircraftUnit.attack === true)
    }
    // filter out fighter separated by Japan Card #9
    unitsInGroup = unitsInGroup.filter((unit) => unit.aircraftUnit.separated !== true)

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
    if (!GlobalGameState.attackingStrikeGroup) return []
    let unitsInGroup = this.getAirUnitsInStrikeGroups(GlobalGameState.attackingStrikeGroup.box)
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

  getMarkerNameForBox = (boxName, boxIndex) => {
    return this.boxModel.getMarkerNameForBox(boxName, boxIndex)
  }

  getMarkerLocation = (markerName) => {
    return this.boxModel.getMarkerLocation(markerName)
  }

  getAirUnitLocation = (airUnitName) => {
    return this.boxModel.getAirUnitLocation(airUnitName)
  }

  opposingFleetsInSameHex() {
    const csfLocation = this.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    const usDMCVLocation = this.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

    let numFleetsInSameHexAsCSF = 1,
      numFleetsInSameHexAsUSDMCV = 1
    let fleetsInSameHexAsCSF = new Array(),
      fleetsInSameHexAsUSDMCV = new Array()

    if (csfLocation !== undefined) {
      fleetsInSameHexAsCSF = this.getAllFleetsInLocation(csfLocation, GlobalUnitsModel.Side.US, false)
    }
    if (usDMCVLocation) {
      fleetsInSameHexAsUSDMCV = this.getAllFleetsInLocation(usDMCVLocation, GlobalUnitsModel.Side.US, false)
    }

    numFleetsInSameHexAsCSF = fleetsInSameHexAsCSF.length
    numFleetsInSameHexAsUSDMCV = fleetsInSameHexAsUSDMCV.length

    return { numFleetsInSameHexAsCSF, numFleetsInSameHexAsUSDMCV }
  }

  getStrikeGroupForBox(side, box) {
    if (side === GlobalUnitsModel.Side.US) {
      const sg = GlobalUnitsModel.usStrikeGroups.get(box)
      return sg
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

  getDistanceBetween1AFAndMidway() {
    const locationOfCarrier = this.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    if (locationOfCarrier === undefined) {
      return NaN
    }
    return distanceBetweenHexes(locationOfCarrier.currentHex, Controller.MIDWAY_HEX.currentHex)
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

  removeStrikeGroupFromLocation(id, side) {
    this.mapModel.removeStrikeGroupFromLocation(id, side)
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

  calculateVPs() {
    const numJapanCVsSunk = this.getSunkCarriers(GlobalUnitsModel.Side.JAPAN).length
    const numUSCVsSunk = this.getSunkCarriers(GlobalUnitsModel.Side.US).length

    const numJapanCVsRemaining = 4 - numJapanCVsSunk
    const numUSCVsRemaining = 3 - numUSCVsSunk

    GlobalGameState.japanVPs = 0
    GlobalGameState.usVPs = 0
    GlobalGameState.usVPs += numJapanCVsSunk

    GlobalGameState.japanVPs += numUSCVsSunk
    if (GlobalGameState.midwayControl === GlobalUnitsModel.Side.US) {
      GlobalGameState.usVPs += 2
    } else {
      GlobalGameState.japanVPs += 2
    }

    // 1 VP for each unit moved off map
    if (GlobalGameState.CSFLeftMap) {
      GlobalGameState.japanVPs++
    }
    if (GlobalGameState.AF1LeftMap) {
      GlobalGameState.usVPs++
    }
  }
  victoryCheck() {
    const numJapanCVsSunk = this.getSunkCarriers(GlobalUnitsModel.Side.JAPAN).length
    const numUSCVsSunk = this.getSunkCarriers(GlobalUnitsModel.Side.US).length

    const numJapanCVsRemaining = 4 - numJapanCVsSunk
    const numUSCVsRemaining = 3 - numUSCVsSunk

    GlobalGameState.japanVPs = 0
    GlobalGameState.usVPs = 0
    GlobalGameState.usVPs += numJapanCVsSunk

    GlobalGameState.japanVPs += numUSCVsSunk
    if (GlobalGameState.midwayControl === GlobalUnitsModel.Side.US) {
      GlobalGameState.usVPs += 2
    } else {
      GlobalGameState.japanVPs += 2
    }

    // 1 VP for each unit moved off map
    if (GlobalGameState.CSFLeftMap) {
      GlobalGameState.japanVPs++
    }
    if (GlobalGameState.AF1LeftMap) {
      GlobalGameState.usVPs++
    }

    if (GlobalGameState.gameTurn === 3) {
      if (numJapanCVsRemaining === 0 && numUSCVsRemaining !== 0) {
        return GlobalUnitsModel.Side.US
      }
      if (numJapanCVsRemaining !== 0 && numUSCVsRemaining === 0) {
        return GlobalUnitsModel.Side.JAPAN
      }

      if (numUSCVsRemaining >= numJapanCVsRemaining * 3) {
        return GlobalUnitsModel.Side.US
      }
      if (numJapanCVsRemaining >= numUSCVsRemaining * 3) {
        return GlobalUnitsModel.Side.JAPAN
      }
    } else if (GlobalGameState.gameTurn === 7) {
      if (GlobalGameState.usVPs > GlobalGameState.japanVPs) {
        return GlobalUnitsModel.Side.US
      }
      if (GlobalGameState.japanVPs > GlobalGameState.usVPs) {
        return GlobalUnitsModel.Side.JAPAN
      }
      if (GlobalGameState.usVPs > GlobalGameState.japanVPs) {
        return "US"
      } else if (GlobalGameState.japanVPsVPs > GlobalGameState.usVPs) {
        return "JAPAN"
      }
      return "DRAW"
    }
    return ""
  }
  isSunk(name, countTowedAsSunk) {
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return this.isMidwayBaseDestroyed()
    }
    const side = GlobalUnitsModel.carrierSideMap.get(name)

    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      return carrier.hits >= 3
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      if (countTowedAsSunk) {
        return carrier.hits >= 3
      }
      return carrier.hits >= 3 && !carrier.towed
    }
  }

  isFlightDeckAvailable(carrierName, side, comingFromHangar) {
    let hits = 0
    let carrier
    if (side === GlobalUnitsModel.Side.JAPAN) {
      carrier = GlobalUnitsModel.jpFleetUnits.get(carrierName)
      hits = carrier.hits
    } else {
      carrier = GlobalUnitsModel.usFleetUnits.get(carrierName)
      hits = carrier.hits
    }

    if (carrier.name === GlobalUnitsModel.Carrier.MIDWAY) {
      if (GlobalGameState.midwayBox0Damaged) hits++
      if (GlobalGameState.midwayBox1Damaged) hits++
      if (GlobalGameState.midwayBox2Damaged) hits++
    }
    // return false if both slots either damaged or occupied by an air unit
    const flightDeckBox = this.airOperationsModel.getAirBoxForNamedShip(side, carrierName, "FLIGHT")

    let boxName = Object.values(flightDeckBox)[0]

    const units = this.getAllAirUnitsInBox(boxName)

    // for carriers if hits + units length >= 2 unavailable, for Midway 3
    const capacity = carrierName.toUpperCase().includes("MIDWAY") ? 3 : 2

    const totalUnavailableSlots = hits + units.length
    let retVal = totalUnavailableSlots < capacity

    const currentLoad = this.numUnitsOnCarrier(carrierName, side)

    // if this is a move from hangar -> flight deck we don't care about capacity
    if (!comingFromHangar) {
      const baseCapacity = carrierName === GlobalUnitsModel.Carrier.MIDWAY ? 7 : 5
      retVal = retVal && currentLoad < baseCapacity
    }

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
  setCarrierBowDamaged(name, damaged) {
    let d = damaged ?? true

    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      carrier.bowDamaged = d
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      carrier.bowDamaged = d
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

  setCarrierSternDamaged(name, damaged) {
    let d = damaged ?? true
    if (name === GlobalUnitsModel.Carrier.MIDWAY) {
      return false
    }
    const side = GlobalUnitsModel.carrierSideMap.get(name)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const carrier = GlobalUnitsModel.jpFleetUnits.get(name)
      carrier.sternDamaged = d
    } else {
      const carrier = GlobalUnitsModel.usFleetUnits.get(name)
      carrier.sternDamaged = d
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
    if (!name || name === "SUNK") {
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
  drawJapanCards(num, initial, testCards) {
    this.cardModel.drawJapanCards(num, initial, testCards)
  }

  replaceCardWithOtherCard(card, otherCard, side) {
    this.cardModel.replaceCardWithOtherCard(card, otherCard, side)
  }

  drawUSCards(num, initial, testCards) {
    this.cardModel.drawUSCards(num, initial, testCards)
  }

  japanHandContainsCard(cardNum) {
    return this.cardModel.japanHandContainsCard(cardNum)
  }

  usHandContainsCard(cardNum) {
    return this.cardModel.usHandContainsCard(cardNum)
  }

  setCardPlayed(cardNum, side) {
    this.cardModel.setCardPlayed(cardNum, side)
  }

  getCardPlayed(cardNum, side) {
    return this.cardModel.getCardPlayed(cardNum, side)
  }

  getNumberFleetsOnMap() {
    return this.mapModel.getNumberFleetsOnMap()
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

    if (
      locationB === undefined ||
      locationB.currentHex === undefined ||
      locationA === undefined ||
      locationA.currentHex === undefined
    ) {
      return NaN
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
    if (locationA.currentHex === undefined) return undefined

    let hexA = {
      q: locationA.currentHex.q,
      r: locationA.currentHex.r,
    }

    let locations =
      fleetA.side === GlobalUnitsModel.Side.JAPAN ? this.getUSFleetLocations() : this.getJapanFleetLocations()

    let shortestDist = 100

    // if no fleets on the board (for Japan) use Midway instead
    if (fleetA.side === GlobalUnitsModel.Side.JAPAN && this.allCarriersSunk(GlobalUnitsModel.Side.US)) {
      const hexB = {
        q: Controller.MIDWAY_HEX.currentHex.q,
        r: Controller.MIDWAY_HEX.currentHex.r,
      }
      const dist = distanceBetweenHexes(hexA, hexB)
      return dist
    }

    let found = false
    for (let fleet of locations.keys()) {
      if (fleet.toUpperCase().includes("MAP") || fleet.includes("SG")) {
        continue
      }
      found = true // will stay false if no fleets on map
      const locationB = locations.get(fleet)
      // this fleet may be sunk (or moved to off map fleet box) so continue...
      if (locationB === HexCommand.OFFBOARD || locationB.boxName === HexCommand.FLEET_BOX) {
        continue
      }
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
    let jpVal = Math.max(1, GlobalGameState.JP_AF - distances.jp_af)
    jpVal = Math.min(4, jpVal)

    jpVal -= GlobalGameState.midwayAirOpsCompleted
    jpVal = Math.max(0, jpVal)

    let usVal = Math.max(1, GlobalGameState.US_CSF - distances.us_csf, GlobalGameState.US_MIDWAY - distances.us_midway)
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
      if (tf === "MIF") {
        return "MIF"
      } else if (tf.includes("DMCV")) {
        return "IJN-DMCV"
      }
      return "1AF"
    }
    if (tf.toUpperCase() != "MIDWAY") {
      if (tf.includes("DMCV")) {
        return "US-DMCV"
      }
      return "CSF"
    }
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

      case Controller.EventTypes.NAVAL_BATTLE_ROLL:
        this.dieRollEventHandler.handleNavalBattleDiceRollEvent(event)
        break

      case Controller.EventTypes.MIDWAY_GARRISON:
        this.dieRollEventHandler.handlStatusChangeEvent(event)
        break

      case Controller.EventTypes.TARGET_SELECTION:
        this.selectionEventHandler.handleSelectTargetEvent(event)
        break
      case Controller.EventTypes.TARGET_SELECTION_ROLL:
        this.dieRollEventHandler.handleTargetSelectionDiceRollEvent(event)
        break

      case Controller.EventTypes.ATTACK_RESOLUTION_ROLL:
        this.dieRollEventHandler.handleAttackResolutionDiceRollEvent(event)
        break

      case Controller.EventTypes.CARRIER_DAMAGE:
      case Controller.EventTypes.SUBMARINE_ATTACK_ROLL:
        this.damageHandler.handleCarrierDamageEvent(event)
        break

      case Controller.EventTypes.MIDWAY_DAMAGE:
        this.damageHandler.handleMidwayDamageEvent(event)
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

      case Controller.EventTypes.NAVAL_BOMBARDMENT_ROLL:
        this.dieRollEventHandler.handleNavalBombardmentDiceRollEvent(event)
        break

      case Controller.EventTypes.TROUBLED_RECON_ROLL:
        this.dieRollEventHandler.handleTroubledReconnaissanceDiceRollEvent(event)
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

      case Controller.EventTypes.ASSIGN_DMCV_CARRIER:
        this.selectionEventHandler.handleSelectDMCVCarrierEvent(event)
        break

      case Controller.EventTypes.CARD_PLAY:
        this.cardEventHandler.handleCardEvent(event)
        break
      default:
        console.log(`Unknown event type: ${event.type}`)
    }
  }
}
