import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import GlobalGameState from "../src/model/GlobalGameState"
import GlobalInit from "../src/model/GlobalInit"
import { saveGameState, loadGameState } from "../src/SaveLoadGame"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
    global.localStorage = {
      state: {},
      setItem(key, item) {
        this.state[key] = item
      },
      getItem(key) {
        return this.state[key]
      },
    }
  })

  function clearState() {
    controller = new Controller()
    counters = loadCounters(controller)
  }

  test("Save and Reload Game State to/from Local Storage", () => {
    // set locations of fleet and air units
    let kaf1 = counters.get("Kaga-A6M-2b-1")
    let kaf2 = counters.get("Kaga-A6M-2b-2")
    let kdb = counters.get("Kaga-D3A-1")
    let ktb = counters.get("Kaga-B5N-2")

    let aaf1 = counters.get("Akagi-A6M-2b-1")
    let aaf2 = counters.get("Akagi-A6M-2b-2")
    let adb = counters.get("Akagi-D3A-1")
    let atb = counters.get("Akagi-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 1, kaf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 1, kaf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGER, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGER, 1, ktb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, adb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN2, 1, atb)

    let haf1 = counters.get("Hiryu-A6M-2b-1")
    let haf2 = counters.get("Hiryu-A6M-2b-2")
    let hdb = counters.get("Hiryu-D3A-1")
    let htb = counters.get("Hiryu-B5N-2")

    let saf1 = counters.get("Soryu-A6M-2b-1")
    let saf2 = counters.get("Soryu-A6M-2b-2")
    let sdb = counters.get("Soryu-D3A-1")
    let stb = counters.get("Soryu-B5N-2")

    // set game state variables (eg markers, turn phase etc)
    GlobalGameState.midwayInvasionLevel = 3
    GlobalGameState.midwayGarrisonLevel = 4
    GlobalGameState.midwayAttackDeclaration = true
    GlobalGameState.jpCardsDrawn = true
    GlobalGameState.usCardsDrawn = true
    GlobalGameState.usFleetPlaced = true

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 1, saf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 0, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 1, saf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN2, 1, stb)
    const location = {
      currentHex: {
        q: 7,
        r: 1,
        x: 290,
        y: 206,
        row: "G",
        col: 4,
      },
    }
    
    controller.setFleetUnitLocation("CSF", location, GlobalUnitsModel.Side.US)

    GlobalInit.controller.drawJapanCards(3, true)
    GlobalInit.controller.drawUSCards(2, true)

    // save to local storage
    saveGameState(controller)

    let kaf1Location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
    expect(kaf1Location.boxName).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)

    // clear game state somehow
    controller.clearModels()

    kaf1Location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
    expect(kaf1Location).toBeUndefined()

    // load from local storage - check correct
    const { airUpdates, jpfleetUpdates, usfleetUpdates, logItems } = loadGameState(GlobalInit.controller)
    kaf1 = airUpdates.filter((a) => a.name === "Akagi-A6M-2b-1")[0]
    expect(kaf1.boxName).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(logItems.size).toBeGreaterThan(0)
  })
})
