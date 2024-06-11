import React, { useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalGameState from "../../../model/GlobalGameState"

function AirCounter({
  controller,
  onDrag,
  onStop,
  getAirBox,
  setAirBox,
  counterData,
  airUnitUpdate,
  setAlertShow,
  side,
}) {
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  })

  const [theSide, setSide] = useState(side)

  // This code for the test mode air unit updates
  if (
    counterData.name === airUnitUpdate.name &&
    position.left !== airUnitUpdate.position.left + "%" &&
    position.top !== airUnitUpdate.position.top + "%"
  ) {
    // console.log("I am ", counterData.name, " -> AIR UNIT UPDATE = ", airUnitUpdate)

    const unit = controller.getAirUnitInBox(airUnitUpdate.boxName, airUnitUpdate.index)
    if (unit) {
      alert(`ERROR unit already there -> ${airUnitUpdate.boxName}, index ${airUnitUpdate.index}`)
      return
    }

    setPosition(() => ({
      left: airUnitUpdate.position.left + "%",
      top: airUnitUpdate.position.top - 0.2 + "%",
    }))

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name: airUnitUpdate.boxName,
        counterData,
        index: airUnitUpdate.index,
        side: theSide
      },
    })
  }

  const japanDrop = (counterData) => {

    if (
      counterData.carrier != GlobalGameState.getJapanCarrier() &&
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP
    ) {
      // cannot move units from carrier other than the current one being set up
      return false
    }

    console.log("IN JAPAN DROP 2")

    const { name, offsets } = getAirBox()
    if (!offsets) {
      return false
    }

    console.log("IN JAPAN DROP 3")

    // attack is true if the air unit is torpedo or dive bomber, i.e., not a fighter
    const airUnit = controller.getAirUnit(counterData.name)
    if (!airUnit) {
      // error
      return false
    }
    console.log("IN JAPAN DROP 4")

    if (
      airUnit.attack &&
      (name === GlobalUnitsModel.AirBox.JP_CD1_CAP || name === GlobalUnitsModel.AirBox.JP_CD2_CAP)
    ) {
      console.log("*** Air Unit is not a figher unit -> Cannot be used for CAP!")

      setAlertShow(true)
      // TODO display error popup
      return false
    }
    console.log("IN JAPAN DROP 5")

    return offsets
  }
  const handleDrop = (event) => {
    event.preventDefault()

    const { name, offsets, index } = getAirBox()

    console.log("+++++++++++++++++++++++++++++++++++++ handle drop, side = ", theSide)
    if (theSide === GlobalUnitsModel.Side.JAPAN) {
      if (!japanDrop(counterData)) {
        return
      }
    }
    setPosition({
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
    })

    console.log("CALL viewEventHandler side = ", theSide)
    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name,
        counterData,
        index,
        side: theSide
      },
    })

    // reset air box for next counter
    setAirBox({})
  }

  return (
    <div>
      <input
        type="image"
        src={counterData.image}
        name="saveForm2"
        style={{
          position: "absolute",
          width: counterData.width,
          left: position.left,
          top: position.top,
          zIndex: 10,
          // transform: 'rotate(270deg)'
        }}
        id="saveForm2"
        onMouseEnter={onDrag}
        onMouseLeave={onStop}
        draggabble="true"
        onDragStart={onDrag}
        onDragEnd={handleDrop}
      />
    </div>
  )
  //   });
}

export default AirCounter
