import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalInit from "./model/GlobalInit"

export const airUnitData = [
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    name: "Akagi-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    name: "Akagi-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_HANGER,
    name: "Akagi-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    name: "Akagi-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    name: "Kaga-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    name: "Kaga-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_HANGER,
    name: "Kaga-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    name: "Kaga-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD2_CAP,
    name: "Hiryu-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-B5N-2",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-A6M-2b-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    name: "Soryu-A6M-2b-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-D3A-1",
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-B5N-2",
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    name: "Soryu-A6M-2b-2",
  },

]

function calcTestData() {
  const testData = []

  for (const unit of airUnitData) {
    let boxName = unit.boxName

    let name = unit.name
    let nextAction = unit.nextAction
    testData.push({
      name: name,
      boxName: boxName,
      nextAction: nextAction,
    })
  }

  return testData
}

function calcRandomTestData(unit, controller) {
  const units = Array.from(GlobalInit.counters.values())
  const airCounters = units.filter((unit) => unit.constructor.name === "AirUnit")
  // for (const unit of airUnitData) {
  let carrier = controller.getCarrierForAirUnit(unit.name)
  let boxes = controller.getBoxesForCarrier(carrier, false)

  // 1. if this is an attack aircraft, remove CAP from list
  const aircraftUnit = controller.getAirUnit(unit.name)

  if (aircraftUnit.attack) {
    boxes = boxes.filter((b) => !b.includes("CAP"))
  }

  // 2. if any box is full, remove that box from list
  boxes = boxes.filter((b) => controller.getAllFreeZonesInBox(b).length !== 0)

  // 3. If the flight deck has empty slots, remove hangar from list
  const flightDeckAirBox = JapanAirBoxOffsets.filter(
    (b) => b.carriers.includes(carrier) && b.name.includes("FLIGHT")
  )[0]

  const fdBoxes = controller.getAllFreeZonesInBox(flightDeckAirBox.name).length

  if (fdBoxes > 0) {
    boxes = boxes.filter((b) => !b.includes("HANGAR"))
  }

  // 4. Pick random box from the list
  const rn = Math.floor(Math.random() * boxes.length)

  // 5. Add air unit to box
  let nextAction = unit.nextAction
  return {
    name: unit.name,
    boxName: boxes[rn],
    nextAction: nextAction,
  }
}

export default calcRandomTestData
