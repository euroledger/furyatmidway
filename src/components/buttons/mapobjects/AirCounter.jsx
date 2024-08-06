import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import "./counter.css"
import { setValidDestinationBoxes } from "../../../controller/AirOperationsHandler"

function AirCounter({ getAirBox, setAirBox, counterData, side }) {
  const {
    loading,
    controller,
    onStop,
    airUnitUpdate,
    setIsMoveable,
    setAlertShow,
    setEnabledUSBoxes,
    setEnabledJapanBoxes,
  } = useContext(BoardContext)
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  })

  const onDrag = () => {
    setIsMoveable(true)
    setSelected(() => true)

    if (
      counterData.aircraftUnit.moved ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR
    ) {
      return
    }

    setValidDestinationBoxes(controller, counterData.name, counterData.side)
    setBoxes(counterData)

    // only the selected (clicked) air unit should be draggable
    console.log("SET SELECTED TO TRUE")
  }
  const [selected, setSelected] = useState(false)

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
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
      controller.viewEventHandler({
        type: Controller.EventTypes.AIR_UNIT_MOVE,
        data: {
          name: airUnitUpdate.boxName,
          counterData,
          index: airUnitUpdate.index,
          side: theSide,
          loading: loading,
        },
      })
    } else {
      controller.viewEventHandler({
        type: Controller.EventTypes.AIR_UNIT_SETUP,
        data: {
          name: airUnitUpdate.boxName,
          counterData,
          index: airUnitUpdate.index,
          side: theSide,
        },
      })
    }
  }

  const japanDrop = (counterData) => {
    console.log("TRYING DROP....selected = ", selected)
    if (
      (counterData.carrier != GlobalGameState.getJapanCarrier() &&
        GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS
    ) {
      // cannot move units from carrier other than the current one being set up
      return false
    }
    const { name, offsets } = getAirBox()
    if (!offsets) {
      console.log("QUACK 1")

      return false
    }
    // attack is true if the air unit is torpedo or dive bomber, i.e., not a fighter
    const airUnit = controller.getJapanAirUnit(counterData.name)
    if (!airUnit) {
      console.log("QUACK 2")

      // error
      return false
    }
    if (
      airUnit.attack &&
      (name === GlobalUnitsModel.AirBox.JP_CD1_CAP || name === GlobalUnitsModel.AirBox.JP_CD2_CAP)
    ) {
      console.log("*** Air Unit is not a figher unit -> Cannot be used for CAP!")

      setAlertShow(true)
      return false
    }

    return offsets
  }

  const usDrop = (counterData) => {
    if (
      (counterData.carrier != GlobalGameState.getUSCarrier() ||
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_SETUP_AIR) &&
      GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS
    ) {
      // cannot move units from carrier other than the current one being set up
      return false
    }
    const { name, offsets } = getAirBox()
    if (!offsets) {
      return false
    }

    // attack is true if the air unit is torpedo or dive bomber, i.e., not a fighter
    const airUnit = controller.getUSAirUnit(counterData.name)
    if (!airUnit) {
      // error
      return false
    }
    if (
      airUnit.attack &&
      (name === GlobalUnitsModel.AirBox.US_TF16_CAP ||
        name === GlobalUnitsModel.AirBox.US_TF17_CAP ||
        name === GlobalUnitsModel.AirBox.US_MIDWAY_CAP)
    ) {
      console.log("*** Air Unit is not a figher unit -> Cannot be used for CAP!")

      setAlertShow(true)
      return false
    }

    return offsets
  }
  const handleDrop = (event) => {
    console.log("HANDLE DROP selected = ", selected)
    event.preventDefault()

    const { name, offsets, index, side } = getAirBox()

    if (side != theSide) {
      return
    }
    if (counterData.aircraftUnit.moved) {
      console.log("QUACK 100")
      return
    }

    const unit = controller.getAirUnitInBox(name, index)
    if (unit) {
      console.log("QUACK 200")

      // already a unit in that box
      return
    }
    if (!selected) {
      console.log("QUACK 300")

      return
    }
    if (theSide === GlobalUnitsModel.Side.JAPAN) {
      if (!japanDrop(counterData)) {
        console.log("QUACK 400")

        return
      }
    } else {
      if (!usDrop(counterData)) {
        return
      }
    }

    console.log("MOVE US UNIT ", counterData.name, "TO ", name)
    setPosition({
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
    })

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
      controller.viewEventHandler({
        type: Controller.EventTypes.AIR_UNIT_MOVE,
        data: {
          name,
          counterData,
          index,
          side: theSide,
        },
      })
      // remove valid destinations (do not allow change move, use undo for that)
      controller.setValidAirUnitDestinations(counterData.name, new Array())
      setBoxes(counterData)
      setSelected(false)
      return
    }

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name,
        counterData,
        index,
        side: theSide,
      },
    })

    // reset air box for next counter
    setAirBox({})
  }

  const setBoxes = (counterData) => {
    const destBoxes = controller.getValidAirUnitDestinations(counterData.name)
    if (counterData.side === GlobalUnitsModel.Side.JAPAN) {
      setEnabledJapanBoxes(() => destBoxes)
    } else {
      setEnabledUSBoxes(() => destBoxes)
    }
  }
  const handleClick = (e) => {
    if (
      counterData.aircraftUnit.moved ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR
    ) {
      return
    }
    setValidDestinationBoxes(controller, counterData.name, counterData.side)
    setBoxes(counterData)

    // only the selected (clicked) air unit should be draggable
    setSelected(true)
  }

  const handleRightClick = (e) => {
    e.preventDefault()
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  // console.log(counterData.name, "->", counterData.aircraftUnit.moved)
  const transform = counterData.aircraftUnit.moved ? "rotate(45deg)" : ""

  // console.log(counterData.name, transform)
  return (
    <div>
      {/* <a> */}
      <input
        type="image"
        src={counterData.image}
        name="saveForm2"
        style={{
          position: "absolute",
          width: counterData.width,
          left: position.left,
          top: position.top,
          zIndex: zx,
          "&:focus": {
            borderRadius: "2px",
            border: "3px solid rgb(197,9,9)",
          },
          transform: transform,
        }}
        id="saveForm2"
        onMouseEnter={onDrag}
        onMouseLeave={onStop}
        draggabble="true"
        onDragStart={onDrag}
        onDragEnd={handleDrop}
        onClick={(e) => handleClick(e)}
        onContextMenu={(e) => handleRightClick(e)}
        zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 11}
      />
      <span className="circle"></span>
      {/* </a> */}
    </div>
  )
  //   });
}

export default AirCounter
