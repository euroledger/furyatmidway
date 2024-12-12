import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import { generateRandomUSAirSetup } from "../src/AirUnitData"

describe("Anti-Aircraft Fire tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Set Up US Air Units", () => {
    const [eair, hair, yair] = generateRandomUSAirSetup()
    eair.forEach((element) => {
      expect([0, 1, 2]).toContain(element)
    })
    hair.forEach((element) => {
      expect([0, 3, 4]).toContain(element)
    })
    yair.forEach((element) => {
      expect([5, 6, 7]).toContain(element)
    })
    console.log("US AIR OPENING SETUP ->")
    console.log(eair)
    console.log(hair)
    console.log(yair)
  })
})
