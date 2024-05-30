import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalUnitsModel from "./model/GlobalUnitsModel"

const airUnitData = [
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    name: "Akagi-A6M-2b-1",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    name: "Akagi-A6M-2b-2",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    name: "Akagi-D3A-1",
    index: 1,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_AKAGI_HANGER,
    name: "Akagi-B5N-2",
    index: 0,
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    name: "Kaga-A6M-2b-1",
    index: 1,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    name: "Kaga-A6M-2b-2",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    name: "Kaga-D3A-1",
    index: 1,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_KAGA_HANGER,
    name: "Kaga-B5N-2",
    index: 0,
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_CD2_CAP,
    name: "Hiryu-A6M-2b-1",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-A6M-2b-2",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-D3A-1",
    index: 2,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    name: "Hiryu-B5N-2",
    index: 3,
    nextAction: true,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    name: "Soryu-A6M-2b-1",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    name: "Soryu-A6M-2b-2",
    index: 1,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-D3A-1",
    index: 0,
  },
  {
    boxName: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    name: "Soryu-B5N-2",
    index: 1,
    nextAction: true,
  },
]
function calcTestData() {
  const testData = []

  for (const unit of airUnitData) {
    let boxName = unit.boxName
    let index = unit.index // TODO Calc first free slot in this box
    let name = unit.name
    let nextAction = unit.nextAction

    let position1 = JapanAirBoxOffsets.find((box) => box.name === boxName)
    testData.push({
      name: name,
      position: position1.offsets[index],
      boxName: boxName,
      index: index,
      nextAction: nextAction,
    })
  }

  return testData
}

export default calcTestData
