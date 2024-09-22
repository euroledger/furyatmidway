import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"
import GlobalGameState from "../src/model/GlobalGameState"
import { createFleetMove } from "./TestUtils"
import HexCommand from "../src/commands/HexCommand"
import { doAttackFireRolls, doCarrierDamageRolls, getAirUnitOnFlightDeck, autoAllocateDamage } from "../src/DiceHandler"

describe("Controller tests", () => {
  let controller
  let counters
  let saf1, saf2, sdb, stb
  let haf1, haf2, hdb, htb
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb1

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  function addUnitToStrikeGroup(name, box, index) {
    let counterData = counters.get(name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: box,
        counterData,
        index,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })
  }

  function placeStrikeGroupsOnMapUS(box) {
    const strikeCounter = {
      name: "US-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/usStrike1.png",
      width: "2.1%",
      box: box,
      side: GlobalUnitsModel.Side.US,
    }

    //  Strike Group moves onto map - test location, moved etc.
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeCounter,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 5,
            q: 7,
            r: 2,
            row: "G",
            side: "us",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })
  }
  function placeStrikeGroupsOnMapJapan(box) {
    const strikeCounter = {
      name: "JP-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/jpStrike1.png",
      width: "2.1%",
      box: box,
      side: GlobalUnitsModel.Side.JAPAN,
    }

    //  Strike Group moves onto map - test location, moved etc.
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeCounter,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 5,
            q: 7,
            r: 2,
            row: "G",
            side: "jp",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })
  }

  function setupUSStrikeGroups() {
    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    etb = counters.get("Enterprise-TBD1")

    hf1 = counters.get("Hornet-F4F4-1")
    hf2 = counters.get("Hornet-F4F4-2")
    hdb1 = counters.get("Hornet-SBD3-1")
    hdb2 = counters.get("Hornet-SBD3-2")
    htb1 = counters.get("Hornet-TBD1")

    addUnitToStrikeGroup(edb1.name, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 0)
    addUnitToStrikeGroup(etb.name, GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 1)
    placeStrikeGroupsOnMapUS(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    createFleetMove(controller, 7, 2, "1AF", GlobalUnitsModel.Side.JAPAN) // G-5
  }

  function setupJapanStrikeGroups() {
    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")
    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")

    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")
    sdb = counters.get("Soryu-D3A-1")
    stb = counters.get("Soryu-B5N-2")

    addUnitToStrikeGroup(haf1.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 0)
    addUnitToStrikeGroup(haf2.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 1)
    addUnitToStrikeGroup(hdb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 2)
    addUnitToStrikeGroup(htb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 3)
    addUnitToStrikeGroup(saf1.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 4)
    addUnitToStrikeGroup(saf2.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 5)
    addUnitToStrikeGroup(sdb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 6)
    addUnitToStrikeGroup(stb.name, GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 7)

    placeStrikeGroupsOnMapJapan(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    createFleetMove(controller, 7, 1, "1AF", GlobalUnitsModel.Side.US) // G-4
    createFleetMove(controller, 7, 2, "CSF", GlobalUnitsModel.Side.US) // G-5
  }
  test("Attack on Kaga and Akagi by two Enterprise units, one dive bomber, one torpedo unit", () => {
    setupUSStrikeGroups()
    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.US

    GlobalGameState.currentCarrierAttackTarget = GlobalUnitsModel.Carrier.KAGA
    controller.setAirUnitTarget(edb1, GlobalUnitsModel.Carrier.KAGA)
    controller.setAirUnitTarget(edb2, GlobalUnitsModel.Carrier.AKAGI)

    expect(GlobalGameState.carrierTarget1).toEqual(GlobalUnitsModel.Carrier.KAGA)
    expect(GlobalGameState.carrierTarget2).toEqual(GlobalUnitsModel.Carrier.AKAGI)

    // move US strike group to same hex as Japan 1AF
    let location2 = {
      currentHex: {
        q: 7,
        r: 2,
      },
    }
    let strikeGroupsAtLocation = controller.getAllStrikeGroupsInLocation(location2, GlobalUnitsModel.Side.US)
    expect(strikeGroupsAtLocation[0].name).toEqual("US-SG1")

    let attackers = controller.getStrikeUnitsAttackingCarrier()
    expect(attackers.length).toEqual(1)
    let attackAircraftOnDeck = controller.attackAircraftOnDeck()
    expect(attackAircraftOnDeck).toEqual(false)

    let combinedAttack = controller.combinedAttack()
    expect(combinedAttack).toEqual(false)

    let dieRolls = [3, 4]

    let hits = doAttackFireRolls(controller, dieRolls)
    expect(hits).toEqual(1)

    expect(attackers[0].aircraftUnit.hitsScored).toEqual(1)

    GlobalGameState.currentCarrierAttackTarget = GlobalUnitsModel.Carrier.AKAGI
    const kdb = counters.get("Kaga-D3A-1")
    const ktb = counters.get("Kaga-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, ktb)

    attackers = controller.getStrikeUnitsAttackingCarrier()
    expect(attackers.length).toEqual(1)
    attackAircraftOnDeck = controller.attackAircraftOnDeck()
    expect(attackAircraftOnDeck).toEqual(true)

    combinedAttack = controller.combinedAttack()
    expect(combinedAttack).toEqual(false)

    dieRolls = [3, 4]

    hits = doAttackFireRolls(controller, dieRolls)
    expect(hits).toEqual(2)

    expect(attackers[0].aircraftUnit.hitsScored).toEqual(2)
  })

  test("Attack on TF16 by Japanese units, planes on Hornet deck", () => {
    hdb1 = counters.get("Hornet-SBD3-1")
    htb1 = counters.get("Hornet-TBD1")
    // attack aircraft on deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 0, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 1, htb1)
    setupJapanStrikeGroups()

    let strikeGroup = GlobalUnitsModel.jpStrikeGroups.get(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(8)

    GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.TASK_FORCE_16
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN

    GlobalGameState.currentCarrierAttackTarget = GlobalUnitsModel.Carrier.HORNET
    controller.setAirUnitTarget(hdb, GlobalUnitsModel.Carrier.HORNET)
    controller.setAirUnitTarget(htb, GlobalUnitsModel.Carrier.HORNET)
    controller.setAirUnitTarget(sdb, GlobalUnitsModel.Carrier.HORNET)
    controller.setAirUnitTarget(stb, GlobalUnitsModel.Carrier.HORNET)
    // move JP strike group to same hex as US CSF
    let location2 = {
      currentHex: {
        q: 7,
        r: 2,
      },
    }
    const strikeGroupsAtLocation = controller.getAllStrikeGroupsInLocation(location2, GlobalUnitsModel.Side.JAPAN)
    expect(strikeGroupsAtLocation[0].name).toEqual("JP-SG1")

    let attackers = controller.getStrikeUnitsAttackingCarrier()
    expect(attackers.length).toEqual(4)

    const attackAircraftOnDeck = controller.attackAircraftOnDeck()
    expect(attackAircraftOnDeck).toEqual(true)

    const combinedAttack = controller.combinedAttack()
    expect(combinedAttack).toEqual(true)

    const dieRolls = [4, 6, 4, 3, 5, 5, 1, 3]

    const hits = doAttackFireRolls(controller, dieRolls)
    expect(hits).toEqual(5)

    expect(attackers[0].aircraftUnit.hitsScored).toEqual(1)
    expect(attackers[1].aircraftUnit.hitsScored).toEqual(2)
    expect(attackers[2].aircraftUnit.hitsScored).toEqual(0)
    expect(attackers[3].aircraftUnit.hitsScored).toEqual(2)
  })

  test("Attack on Midway", () => {
    // @TODO
  })

  test("Attack by Midway-based planes", () => {
    // @TODO
  })

  test("Damage Allocation no planes on deck", () => {
    const carrier = GlobalUnitsModel.Carrier.ENTERPRISE

    GlobalGameState.currentCarrierAttackTarget = carrier
    GlobalGameState.carrierAttackHits = 2

    const dieRolls = [1, 4]
    doCarrierDamageRolls(controller, dieRolls)

    const bowDamaged = controller.getCarrierBowDamaged(carrier)
    expect(bowDamaged).toEqual(true)

    const sternDamaged = controller.getCarrierSternDamaged(carrier)
    expect(sternDamaged).toEqual(true)

    const hits = controller.getCarrierHits(carrier)

    expect(hits).toEqual(2)
  })

  test("Eliminate planes on deck and in hangar if carrier sunk", () => {
    const carrier = GlobalUnitsModel.Carrier.ENTERPRISE
    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    etb = counters.get("Enterprise-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 0, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 1, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 2, ef2)

    GlobalGameState.currentCarrierAttackTarget = carrier
    GlobalGameState.carrierAttackHits = 3

    autoAllocateDamage(controller)

    const sunk = controller.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE)
    expect(sunk).toEqual(true)

    const edb1Eliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, edb1.name)
    expect(edb1Eliminated).toEqual(true)
    const edb2Eliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, edb2.name)
    expect(edb2Eliminated).toEqual(true)
    const etbEliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, etb.name)
    expect(etbEliminated).toEqual(true)
    const ef1Eliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, ef1.name)
    expect(ef1Eliminated).toEqual(true)
    const ef2Eliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, ef2.name)
    expect(ef2Eliminated).toEqual(true)
  })

  test("Damage Allocation planes on deck both bow and stern", () => {
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    // attack aircraft on deck
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, edb2)

    const carrier = GlobalUnitsModel.Carrier.ENTERPRISE

    let unit = getAirUnitOnFlightDeck(controller, carrier, "BOW")
    expect(unit.name).toEqual(edb1.name)

    unit = getAirUnitOnFlightDeck(controller, carrier, "STERN")
    expect(unit.name).toEqual(edb2.name)

    GlobalGameState.currentCarrierAttackTarget = carrier
    GlobalGameState.carrierAttackHits = 2

    const dieRolls = [1, 4]
    doCarrierDamageRolls(controller, dieRolls)

    const bowDamaged = controller.getCarrierBowDamaged(carrier)
    expect(bowDamaged).toEqual(true)

    const sternDamaged = controller.getCarrierSternDamaged(carrier)
    expect(sternDamaged).toEqual(true)

    const hits = controller.getCarrierHits(carrier)
    expect(hits).toEqual(2)

    const edb1Eliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, edb1.name)
    expect(edb1Eliminated).toEqual(true)

    const edb2Eliminated = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_ELIMINATED, edb2.name)
    expect(edb2Eliminated).toEqual(true)
  })

  test("Inflict Damage on Carrier from Two Successive Strikes, Damage should be Cumulative", () => {
    const carrier = GlobalUnitsModel.Carrier.ENTERPRISE

    GlobalGameState.currentCarrierAttackTarget = carrier
    GlobalGameState.carrierAttackHits = 2

    autoAllocateDamage(controller)

    const bowDamaged = controller.getCarrierBowDamaged(carrier)
    expect(bowDamaged).toEqual(true)

    const sternDamaged = controller.getCarrierSternDamaged(carrier)
    expect(sternDamaged).toEqual(true)

    const hits = controller.getCarrierHits(carrier)
    expect(hits).toEqual(2)

    autoAllocateDamage(controller)
    const isSunk = controller.isSunk(carrier)

    expect(isSunk).toEqual(true)
  })
})
