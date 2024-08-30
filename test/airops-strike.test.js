import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { createFleetMove } from "./TestUtils"
import HexCommand from "../src/commands/HexCommand"
import StrikeGroupUnit from "../src/components/buttons/mapobjects/StrikeGroupUnit"

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
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4
    createFleetMove(controller, 7, 2, "1AF", GlobalUnitsModel.Side.JAPAN) // G-5
    createFleetMove(controller, 7, 2, "1AF-USMAP", GlobalUnitsModel.Side.US) // G-5

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

    haf1 = counters.get("Hiryu-A6M-2b-1")
    haf2 = counters.get("Hiryu-A6M-2b-2")
    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")

    saf1 = counters.get("Soryu-A6M-2b-1")
    saf2 = counters.get("Soryu-A6M-2b-2")
    sdb = counters.get("Soryu-D3A-1")
    stb = counters.get("Soryu-B5N-2")
  })

  test("We can add US Air Units to Strike Boxes", () => {
    // TF 16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0, 1, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1, 0, hf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1, 1, hdb1)

    let units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    expect(units.length).toEqual(2)

    units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1)
    expect(units.length).toEqual(2)
  })

  test("US Air Units added to Strike Groups and Strike Groups can move on map", () => {
    let counterData = counters.get(ef1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
        counterData,
        index: 0,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(1)

    counterData = counters.get(edb1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
        counterData,
        index: 1,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)

    //HORNET
    counterData = counters.get(hf1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
        counterData,
        index: 0,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    counterData = counters.get(hdb1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
        counterData,
        index: 1,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(2)
    expect(strikeGroup.moved).toEqual(false)

    // test that we have two strike groups, neither has yet moved
    const groups = controller.getAllStrikeGroups(GlobalUnitsModel.Side.US)
    expect(groups.length).toEqual(2)

    const strikeCounter = {
      name: "US-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/usStrike1.png",
      width: "2.1%",
      box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
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
            col: 3,
            q: 5,
            r: 1,
            row: "E",
            side: "us",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    const location = controller.getStrikeGroupLocation("US-SG1")
    expect(location.currentHex.row).toEqual("E")

    const strikeCounter2 = {
      name: "US-SG3",
      longName: "Strike Group 3",
      position: {},
      image: "/images/aircounters/usStrike3.png",
      width: "2.1%",
      box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_2,
      side: GlobalUnitsModel.Side.US,
    }
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeCounter2,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 3,
            q: 5,
            r: 1,
            row: "E",
            side: "us",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    let location2 = {
      currentHex: {
        q: 5,
        r: 1,
      },
    }

    const strikeGroupsAtLocation = controller.getAllStrikeGroupsInLocation(location2, GlobalUnitsModel.Side.US)
    expect(strikeGroupsAtLocation.length).toEqual(2)
    expect(strikeGroupsAtLocation[0].name).toEqual("US-SG1")
    expect(strikeGroupsAtLocation[1].name).toEqual("US-SG3")
  })

  test("We can add Japan Air Units to Strike Boxes", () => {
    // TF 16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0, 1, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_1, 0, saf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_1, 1, sdb)

    let units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    expect(units.length).toEqual(2)

    units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_1)
    expect(units.length).toEqual(2)
  })

  test("Japan Air Units added to Strike Groups and Strike Groups can move on map", () => {
    let counterData = counters.get(haf1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0,
        counterData,
        index: 0,
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })

    let strikeGroup = GlobalUnitsModel.jpStrikeGroups.get(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(1)
    expect(strikeGroup.moved).toEqual(false)

    counterData = counters.get(edb1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0,
        counterData,
        index: 1,
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })

    const strikeGroup0 = GlobalUnitsModel.jpStrikeGroups.get(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_0)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup0.box)
    expect(unitsInGroup.length).toEqual(2)

    // SORYU
    counterData = counters.get(saf1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2,
        counterData,
        index: 0,
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })

    counterData = counters.get(sdb.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2,
        counterData,
        index: 1,
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })

    const strikeGroup1 = GlobalUnitsModel.jpStrikeGroups.get(GlobalUnitsModel.AirBox.JP_STRIKE_BOX_2)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup1.box)
    expect(unitsInGroup.length).toEqual(2)

    // // test that we have two strike groups, neither has yet moved
    const groups = controller.getAllStrikeGroups(GlobalUnitsModel.Side.JAPAN)
    expect(groups.length).toEqual(2)

  

    //  Strike Group moves onto map - test location, moved etc.
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeGroup0,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 3,
            q: 5,
            r: 1,
            row: "E",
            side: "jp",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })

    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeGroup1,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 3,
            q: 5,
            r: 1,
            row: "E",
            side: "jp",
            x: 120,
            y: 200,
          },
        },
        side: GlobalUnitsModel.Side.JAPAN,
        loading: false,
      },
    })

    let location2 = {
      currentHex: {
        q: 5,
        r: 1,
      },
    }

    const strikeGroupsAtLocation = controller.getAllStrikeGroupsInLocation(location2, GlobalUnitsModel.Side.JAPAN)
    expect(strikeGroupsAtLocation.length).toEqual(2)
    expect(strikeGroupsAtLocation[0].name).toEqual("JP-SG1")
    expect(strikeGroupsAtLocation[1].name).toEqual("JP-SG3")


    expect(strikeGroupsAtLocation[0].moved).toBe(true)

    // get all strike groups which have not moved
    const units = controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.JAPAN)
    expect(units.length).toEqual(0)
  })

  test("US Air Units in same hex as Japanese Fleet triggers Air Attack", () => {
    let counterData = counters.get(ef1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
        counterData,
        index: 0,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    let strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    expect(unitsInGroup.length).toEqual(1)

    counterData = counters.get(edb1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
        counterData,
        index: 1,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_0)
    unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)

    //HORNET
    counterData = counters.get(hf1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
        counterData,
        index: 0,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    counterData = counters.get(hdb1.name)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
        counterData,
        index: 1,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })

    strikeGroup = GlobalUnitsModel.usStrikeGroups.get(GlobalUnitsModel.AirBox.US_STRIKE_BOX_1)

    const strikeCounter = {
      name: "US-SG1",
      longName: "Strike Group 1",
      position: {},
      image: "/images/aircounters/usStrike1.png",
      width: "2.1%",
      box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
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
            col: 3,
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

    const strikeCounter2 = {
      name: "US-SG3",
      longName: "Strike Group 3",
      position: {},
      image: "/images/aircounters/usStrike3.png",
      width: "2.1%",
      box: GlobalUnitsModel.AirBox.US_STRIKE_BOX_2,
      side: GlobalUnitsModel.Side.US,
    }
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: strikeCounter2,
        from: HexCommand.OFFBOARD,
        to: {
          currentHex: {
            col: 3,
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

    let location2 = {
      currentHex: {
        q: 7,
        r: 2,
      },
    }
    const isAirAttackTriggered = controller.checkForAirAttack(location2, GlobalUnitsModel.Side.US)
    expect(isAirAttackTriggered).toEqual(true)
  })

})
