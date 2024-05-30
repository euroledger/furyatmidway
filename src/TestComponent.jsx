import React from "react"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"

function TestComponent({ testClicked, setAirUnitUpdate }) {
  const testUi = async () => {
    console.log("I AM TESTING!")
    // set state in order of commands for air units
    let boxName = GlobalUnitsModel.AirBox.JP_CD1_CAP
    let position1 = JapanAirBoxOffsets.find((box) => box.name === boxName)
    // setAirUnitUpdate({
    //   name: "Akagi-A6M-2b-1",
    //   position: position1.offsets[0],
    //   boxName,
    //   index: 0,
    // })
  }
  if (testClicked) {
    testUi()
  }
  return <></>
}

export default TestComponent
