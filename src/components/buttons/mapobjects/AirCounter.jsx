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

    if (GlobalGameState.sideWithInitiative && counterData.side !== GlobalGameState.sideWithInitiative) {
      return
    }
    // only the selected (clicked) air unit should be draggable
    setSelected(() => true)

    if (
      counterData.aircraftUnit.moved ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR
    ) {
      return
    }

    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
    ) {
      setValidDestinationBoxes(controller, counterData.name, counterData.side)
    }
    setBoxes(counterData)
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

    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
    ) {
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
    if (
      counterData.carrier != GlobalGameState.getJapanCarrier() &&
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP &&
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
    const airUnit = controller.getJapanAirUnit(counterData.name)
    if (!airUnit) {
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
    event.preventDefault()

    const { name, offsets, index, side } = getAirBox()

    if (side != theSide) {
      return
    }
    if (counterData.aircraftUnit.moved) {
      return
    }

    const unit = controller.getAirUnitInBox(name, index)
    if (unit) {
      // already a unit in that box
      return
    }
    if (!selected) {
      return
    }
    if (theSide === GlobalUnitsModel.Side.JAPAN) {
      if (!japanDrop(counterData)) {
        return
      }
    } else {
      if (!usDrop(counterData)) {
        return
      }
    }

    setPosition({
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
    })

    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
    ) {
      controller.viewEventHandler({
        type: Controller.EventTypes.AIR_UNIT_MOVE,
        data: {
          name,
          counterData,
          index,
          side: theSide,
        },
      })
      const units = controller.getStrikeGroupsNotMoved(theSide)
      if (units.length === 0) {
        GlobalGameState.phaseCompleted = true
      } else {
        GlobalGameState.phaseCompleted = false
      }
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
    if (counterData.side !== GlobalGameState.sideWithInitiative) {
      return
    }
    if (
      counterData.aircraftUnit.moved ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR
    ) {
      return
    }
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
    ) {
      setValidDestinationBoxes(controller, counterData.name, counterData.side)
    }
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

  let disp = "block"
  if (
    !loading &&
    (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK)
  ) {
    if (side !== GlobalGameState.sideWithInitiative) {
      // console.log(
      //   "side with initiative=",
      //   GlobalGameState.sideWithInitiative,
      //   "name:",
      //   counterData.name,
      //   "Computer SAys NOOOOOO, phase=",
      //   GlobalGameState.gamePhase,
      //   "side=",
      //   side
      // )
      disp = "none"
    }
  }
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
          display: disp,
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
        // zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 11}
      />
      <span className="circle"></span>
      {/* </a> */}
    </div>
  )
  //   });
}

export default AirCounter
