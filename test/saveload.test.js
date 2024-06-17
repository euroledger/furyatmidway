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

  test("Save and Reload Game State to/from Local Storage", () => {
    // set locations of fleet and air units

    // set game state variables (eg markers, turn phase etc)

    // save to local storage

    // clear game state somehow

    // load from local storage - check correct
  })
})
