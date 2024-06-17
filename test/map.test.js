import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import { flatHexToPixel, convertCoords } from "../src/components/HexUtils"
import HexCommand from "../src/commands/HexCommand"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Check Japan fleet unit can be added to map model", () => {
    // get map positions for coords (1,2)
    let hex = {
      q: 1,
      r: 2,
    }

    let { x, y } = flatHexToPixel({ q: hex.q, r: hex.r })

    // 2. set row and col from this q, r update
    const { q1, r1 } = convertCoords(hex.q, hex.r)

    let to = {
      currentHex: {
        q: hex.q,
        r: hex.r,
        x: x,
        y: y,
        row: q1,
        col: r1,
      },
    }

    let from = HexCommand.OFFBOARD

    // fire view event to update map
    controller.viewEventHandler({
      type: Controller.EventTypes.FLEET_SETUP,
      data: {
        initial: true,
        id: "1AF",
        from,
        to,
        side: GlobalUnitsModel.Side.JAPAN,
      },
    })

    const loc = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    expect(loc.currentHex.q).toEqual(1)
    expect(loc.currentHex.r).toEqual(2)

    expect(loc.currentHex.row).toBe("A")
    expect(loc.currentHex.col).toBe(2)

    const jpmaps = controller.getJapanFleetLocations()
    expect(jpmaps.size).toEqual(1)
  })

  test("Check US fleet unit can be added to map model", () => {
    // get map positions for coords (1,2)
    let hex = {
      q: 7,
      r: 1,
    }

    let { x, y } = flatHexToPixel({ q: hex.q, r: hex.r })

    // 2. set row and col from this q, r update
    const { q1, r1 } = convertCoords(hex.q, hex.r)

    let to = {
      currentHex: {
        q: hex.q,
        r: hex.r,
        x: x,
        y: y,
        row: q1,
        col: r1,
      },
    }

    let from = HexCommand.OFFBOARD

    // fire view event to update map
    controller.viewEventHandler({
      type: Controller.EventTypes.FLEET_SETUP,
      data: {
        initial: true,
        id: "CSF",
        from,
        to,
        side: GlobalUnitsModel.Side.US,
      },
    })

    const loc = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    expect(loc.currentHex.q).toEqual(7)
    expect(loc.currentHex.r).toEqual(1)

    expect(loc.currentHex.row).toBe("G")
    expect(loc.currentHex.col).toBe(4)

    const usmaps = controller.getUSFleetLocations()
    expect(usmaps.size).toEqual(1)
  })
})
