import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { createFleetMove } from "./TestUtils"
import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"

describe("Air Search tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Search Results for distance between search unit and fleet", () => {
    // 1. Calculate distance between two carrier fleets
    createFleetMove(controller, 1, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // A,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    let hexesBetween1AFAndCSF = controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetween1AFAndCSF).toEqual(6)

    // 2. Calculate distance between 1AF and Midway
    let hexesBetween1AFAndMidway = controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetween1AFAndMidway).toEqual(5)

    // 3. Determine closest enemy fleet for:
    //  i) 1AF
    const distanceToClosestFleet1AF = controller.closestEnemyFleet({ name: "1AF", side: GlobalUnitsModel.Side.JAPAN })
    expect(distanceToClosestFleet1AF).toEqual(6)

    //  ii) CSF
    const distanceToClosestFleetCSF = controller.closestEnemyFleet({ name: "CSF", side: GlobalUnitsModel.Side.US })
    expect(distanceToClosestFleetCSF).toEqual(6)

    //  iii) Midway
    const distanceToClosestFleetMidway = controller.closestEnemyFleet({
      name: "MIDWAY",
      side: GlobalUnitsModel.Side.US,
    })
    expect(distanceToClosestFleetMidway).toEqual(5)

    // 4. Calculate Search Results
    const results = controller.calcSearchResults({
      jp_af: distanceToClosestFleet1AF,
      us_csf: distanceToClosestFleetCSF,
      us_midway: distanceToClosestFleetMidway,
    })
    expect(results.JAPAN).toEqual(1)
    expect(results.US).toEqual(3)
  })

  test("Search Results for distances with multiple fleet units on map", () => {
  
    // add three fleets to the map
    createFleetMove(controller, 1, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // A,3
    createFleetMove(controller, 4, 1, "CSF", GlobalUnitsModel.Side.US) // D,3
    createFleetMove(controller, 7, 2, "MIF", GlobalUnitsModel.Side.JAPAN) // G,5

  // 1. Calculate distance between two carrier fleets
    let hexesBetween1AFAndCSF = controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetween1AFAndCSF).toEqual(3)

    // 2. Calculate distance between 1AF and Midway
    let hexesBetween1AFAndMidway = controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetween1AFAndMidway).toEqual(5)

    // 3. Calculate distance between MIF and CSF
    let hexesBetweenMIFAndCSF = controller.numHexesBetweenFleets(
      { name: "MIF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetweenMIFAndCSF).toEqual(4)

    // 4. Calculate distance between MIF and Midway
    let hexesBetweenMIFAndMidway = controller.numHexesBetweenFleets(
      { name: "MIF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetweenMIFAndMidway).toEqual(1)

    // 5. Determine closest enemy fleet for:
    //  i) 1AF
    const distanceToClosestFleet1AF = controller.closestEnemyFleet({ name: "1AF", side: GlobalUnitsModel.Side.JAPAN })
    expect(distanceToClosestFleet1AF).toEqual(3)

    //  ii) CSF
    const distanceToClosestFleetCSF = controller.closestEnemyFleet({ name: "CSF", side: GlobalUnitsModel.Side.US })
    expect(distanceToClosestFleetCSF).toEqual(3)

    //  iii) Midway
    const distanceToClosestFleetMidway = controller.closestEnemyFleet({
      name: "MIDWAY",
      side: GlobalUnitsModel.Side.US,
    })
    expect(distanceToClosestFleetMidway).toEqual(1)

    // 6. Calculate Search Results
    const results = controller.calcSearchResults({
      jp_af: distanceToClosestFleet1AF,
      us_csf: distanceToClosestFleetCSF,
      us_midway: distanceToClosestFleetMidway,
    })
    expect(results.JAPAN).toEqual(3)
    expect(results.US).toEqual(4)
  })

  test("Search Results for distances with no US Fleets on Map", () => {
    // add three fleets to the map
    createFleetMove(controller, 3, 5, "1AF", GlobalUnitsModel.Side.JAPAN) // C,5
    createFleetMove(controller, 7, 2, "MIF", GlobalUnitsModel.Side.JAPAN) // G,5

    // 1. Calculate distance between 1AF and Midway
    let hexesBetween1AFAndMidway = controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetween1AFAndMidway).toEqual(3)

    // 2. Calculate distance between MIF and Midway
    let hexesBetweenMIFAndMidway = controller.numHexesBetweenFleets(
      { name: "MIF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US }
    )
    expect(hexesBetweenMIFAndMidway).toEqual(1)

    // 3. Determine closest enemy fleet for:
    //  i) 1AF
    const distanceToClosestFleet1AF = controller.closestEnemyFleet({ name: "1AF", side: GlobalUnitsModel.Side.JAPAN })
    expect(distanceToClosestFleet1AF).toEqual(3)

    //  ii) Midway
    const distanceToClosestFleetMidway = controller.closestEnemyFleet({
      name: "MIDWAY",
      side: GlobalUnitsModel.Side.US,
    })
    expect(distanceToClosestFleetMidway).toEqual(1)

    // 6. Calculate Search Results
    const results = controller.calcSearchResults({
      jp_af: distanceToClosestFleet1AF,
      us_csf: 100,
      us_midway: distanceToClosestFleetMidway,
    })
    expect(results.JAPAN).toEqual(3)
    expect(results.US).toEqual(4)
  })
})
