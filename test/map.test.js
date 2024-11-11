import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { createFleetMove } from "./TestUtils"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Check Japan fleet unit can be added to map model", () => {
    createFleetMove(controller, 1, 2, "1AF", GlobalUnitsModel.Side.JAPAN)
    const loc = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    expect(loc.currentHex.q).toEqual(1)
    expect(loc.currentHex.r).toEqual(2)

    expect(loc.currentHex.row).toBe("A")
    expect(loc.currentHex.col).toBe(2)

    const jpmaps = controller.getJapanFleetLocations()
    expect(jpmaps.size).toEqual(1)
  })

  test("Check US fleet unit can be added to map model", () => {
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US)

    const loc = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    expect(loc.currentHex.q).toEqual(7)
    expect(loc.currentHex.r).toEqual(1)

    expect(loc.currentHex.row).toBe("G")
    expect(loc.currentHex.col).toBe(4)

    const usmaps = controller.getUSFleetLocations()
    expect(usmaps.size).toEqual(1)
  })

  test("Determine Number of Fleets in Same Hex", () => {
    createFleetMove(controller, 5, -1, "CSF", GlobalUnitsModel.Side.US) // E-1
    createFleetMove(controller, 5, 1, "1AF-USMAP", GlobalUnitsModel.Side.US) // E-3

    const numFleetsOnMap = controller.getNumberFleetsOnMap()
    expect(numFleetsOnMap).toEqual(4)

    let csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    let fleetsInSameHexAsCSF = controller.getAllFleetsInLocation(csfLocation, GlobalUnitsModel.Side.US, false)    
    expect(fleetsInSameHexAsCSF.length).toEqual(1)

    const previousPosition = new Map()
    previousPosition.set("")
    // Both fleets move to C-2
    createFleetMove(controller, 3, 1, "CSF", GlobalUnitsModel.Side.US) // E-1
    createFleetMove(controller, 3, 1, "1AF-USMAP", GlobalUnitsModel.Side.US) // E-3

    csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    fleetsInSameHexAsCSF = controller.getAllFleetsInLocation(csfLocation, GlobalUnitsModel.Side.US, false)    
    expect(fleetsInSameHexAsCSF.length).toEqual(2)

  })
})
