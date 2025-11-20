import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import "./counter.css"
import {
  setValidDestinationBoxes,
  moveOrphanedCAPUnitsToEliminatedBox,
  moveOrphanedCAPUnitsToEliminatedBoxNight,
  moveOrphanedAirUnitsInReturn1Boxes,
  setValidDestinationBoxesNightOperations,
  checkForReorganization,
  checkAllBoxesForReorganization,
  getReorgUnitsCAP,
} from "../../../controller/AirOperationsHandler"
import HexCommand from "../../../commands/HexCommand"

function AirCounter({ getAirBox, setAirBox, counterData, side }) {
  const {
    loading,
    controller,
    onStop,
    airUnitUpdate,
    testUpdate,
    setIsMoveable,
    setAlertShow,
    setEnabledUSBoxes,
    setEnabledJapanBoxes,
    setEnabledJapanReorgBoxes,
    setEnabledUSReorgBoxes,
    setReorgAirUnits,
    enabledUSReorgBoxes,
    enabledJapanReorgBoxes,
  } = useContext(BoardContext)
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  })
  const [alertSent, setAlertSent] = useState(false)

  const location = controller.getAirUnitLocation(counterData.name)
  const checkForAirUnitReorganization = () => {
    if (side === GlobalUnitsModel.Side.JAPAN && enabledJapanReorgBoxes) {
      setEnabledJapanReorgBoxes(() => false)
      return
    }
    if (side === GlobalUnitsModel.Side.US && enabledUSReorgBoxes) {
      setEnabledUSReorgBoxes(() => false)
      return
    }
    // disable the "other" side
    if (side === GlobalUnitsModel.Side.JAPAN) {
      setEnabledUSReorgBoxes(() => false)
    }
    if (side === GlobalUnitsModel.Side.US && enabledUSReorgBoxes) {
      setEnabledJapanReorgBoxes(() => false)
    }
    const location = controller.getAirUnitLocation(counterData.name)

    // 1. check across boxes first
    // 1a check cap and cap return boxes separately (they can merge with Flight Deck or Hangar)
    if (location.boxName !== undefined && location.boxName.includes("CAP")) {
      const reorgUnits = getReorgUnitsCAP(side, location.boxName, counterData)
      if (reorgUnits.length > 0) {
        setReorgAirUnits(reorgUnits)
        if (side === GlobalUnitsModel.Side.JAPAN) {
          setEnabledJapanReorgBoxes(() => true)
        } else {
          setEnabledUSReorgBoxes(() => true)
        }
        return
      } else {
        // 2. still check for units in same box even if CAP

        let reorgUnits = checkForReorganization(controller, location.boxName, null, false)
        if (reorgUnits.length > 0) {
          setReorgAirUnits(reorgUnits)
          if (side === GlobalUnitsModel.Side.JAPAN) {
            setEnabledJapanReorgBoxes(() => true)
          } else {
            setEnabledUSReorgBoxes(() => true)
          }
          return
        } else {
          setReorgAirUnits([])
        }
      }
    } else {
      if (
        location.boxName !== undefined &&
        !location.boxName.includes("HANGAR") &&
        !location.boxName.includes("FLIGHT")
      ) {
        let reorgUnits = checkAllBoxesForReorganization(controller, counterData, location.boxName, side, false)
        if (reorgUnits.length > 0) {
          setReorgAirUnits(reorgUnits)
          if (side === GlobalUnitsModel.Side.JAPAN) {
            setEnabledJapanReorgBoxes(() => true)
          } else {
            setEnabledUSReorgBoxes(() => true)
          }
          return
        } else {
          setReorgAirUnits([])
        }
      }
      // 2. check for units in same box
      let reorgUnits = checkForReorganization(controller, location.boxName, null, false)
      if (reorgUnits.length > 0) {
        setReorgAirUnits(reorgUnits)
        if (side === GlobalUnitsModel.Side.JAPAN) {
          setEnabledJapanReorgBoxes(() => true)
        } else {
          setEnabledUSReorgBoxes(() => true)
        }
        return
      } else {
        setReorgAirUnits([])
      }
    }
  }

  const onDrag = () => {
    // console.log("AIR UNIT DRAG ->", counterData)
    const location = controller.getAirUnitLocation(counterData.name)

    if (!location.boxName.includes("CAP RETURNING") && GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_RETURN) {
      return // disallow all non CAP Return moves when it's the other side's go
    }

    setIsMoveable(true)
    // only the selected (clicked) air unit should be draggable
    setSelected(() => true)

    const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

    // if carrier fleet is off board that side cannot fly operations from carriers
    if (counterData.carrier !== GlobalUnitsModel.Carrier.MIDWAY) {
      if (side === GlobalUnitsModel.Side.US && locationCSF && locationCSF.boxName === HexCommand.FLEET_BOX) {
        return
      }
      if (side === GlobalUnitsModel.Side.JAPAN && location1AF && location1AF.boxName === HexCommand.FLEET_BOX) {
        moveOrphanedCAPUnitsToEliminatedBoxNight(counterData.side)
        return
      }
    }

    if (location.boxName.includes("ELIMINATED")) {
      return
    }
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
    ) {
      if (location.boxName.includes("FLIGHT")) {
        return // cannot launch air operations at night
      }

      if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN &&
        counterData.side === GlobalUnitsModel.Side.JAPAN
      ) {
        setValidDestinationBoxesNightOperations(
          controller,
          counterData.name,
          counterData.side,
          counterData.aircraftUnit.moved
        )
        setBoxes(counterData, location.boxName)
        return
      } else if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US &&
        counterData.side === GlobalUnitsModel.Side.US
      ) {
        if (counterData.aircraftUnit.moved) {
          setEnabledUSBoxes(() => [])
          return
        }
        setValidDestinationBoxesNightOperations(controller, counterData.name, counterData.side)
        setBoxes(counterData, location.boxName)
        return
      } else {
        return // us counter in Japan phase or vice versa, do nothing
      }
    }

    // Only CAP Units can be moved during the other side's air operation (at the end
    // of all airstrikes to return to carrier)

    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      (GlobalGameState.sideWithInitiative !== undefined &&
        GlobalGameState.sideWithInitiative !== counterData.side &&
        !location.boxName.includes("CAP RETURNING"))
    ) {
      return
    }

    if (
      counterData.aircraftUnit.moved ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR
    ) {
      if (counterData.side === GlobalUnitsModel.Side.JAPAN) {
        setEnabledJapanBoxes(() => [])
      } else {
        setEnabledUSBoxes(() => [])
      }
      return
    }
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_RETURN
    ) {
      setValidDestinationBoxes(controller, counterData.name, counterData.side)
    }
    setBoxes(counterData, location.boxName)
  }
  const [selected, setSelected] = useState(false)

  const [theSide, setSide] = useState(side)

  const doUpdate = async (update) => {
    const unit = controller.getAirUnitInBox(update.boxName, update.index)

    // Ensure we only send this alert once so we can debug it
    if (unit && !alertSent && unit.name !== counterData.name) {
      console.log("DEBUG trying to move unit", counterData.name, "update=", update)
      console.log("DEBUG airboxmodel=", controller.getBoxMap())

      console.log("DEBUG update.handle=", update.handle)
      console.log("UNIT ALREADY THERE -> ", unit.name)

      alert(`ERROR unit already there -> ${update.boxName}, index ${update.index}`)
      // GlobalGameState.alertSent = true
      setAlertSent(true)
      return
    }

    setPosition(() => ({
      left: update.position.left + "%",
      top: update.position.top - 0.2 + "%",
    }))

    if (
      GlobalGameState.gamePhase !== GlobalGameState.PHASE.JAPAN_SETUP &&
      GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_SETUP_AIR
    ) {
      if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_TARGET_SELECTION &&
        update.boxName.includes("CAP")
      ) {
        // CAP moves done in air unit handler
        return
      }

      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.INITIATIVE_DETERMINATION) {
        // return moves done in air operations handler
        return
      }
      if (update.log !== false) {
        controller.viewEventHandler({
          type: Controller.EventTypes.AIR_UNIT_MOVE,
          data: {
            name: update.boxName,
            counterData,
            index: update.index,
            side: theSide,
            loading: loading,
          },
        })
      }
    } else {
      controller.viewEventHandler({
        type: Controller.EventTypes.AIR_UNIT_SETUP,
        data: {
          name: update.boxName,
          counterData,
          index: update.index,
          side: theSide,
        },
      })
    }
  }

  // HUMAN STUFF
  const doUpdatePoo =
    counterData.name === airUnitUpdate.name &&
    airUnitUpdate.position != undefined &&
    position.left !== airUnitUpdate.position.left + "%" &&
    position.top !== airUnitUpdate.position.top + "%"
  if (doUpdatePoo) {
    console.log("I am ", counterData.name, " -> HUMAN AIR UNIT UPDATE = ", testUpdate)

    doUpdate(airUnitUpdate)
  } else {
    // console.log("Name:", counterData.name, " airUnitUpdate.position=",  airUnitUpdate.position)
  }

  // AI STUFF
  if (
    counterData.name === testUpdate.name &&
    testUpdate.position != undefined &&
    position.left !== testUpdate.position.left + "%" &&
    position.top !== testUpdate.position.top + "%"
  ) {
    console.log("I am ", counterData.name, " -> AIR UNIT (TEST/AI) UPDATE = ", testUpdate)
    console.log(
      "DEBUG, current position, (",
      position.left,
      position.top,
      "), test update position=(",
      testUpdate.position.left,
      testUpdate.position.top,
      ")"
    )

    doUpdate(testUpdate)
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
    if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.MIDWAY_ATTACK) {
      if (
        (counterData.carrier != GlobalGameState.getUSCarrier() ||
          GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_SETUP_AIR) &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
      ) {
        // cannot move units from carrier other than the current one being set up
        return false
      }
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
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
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

  const setBoxes = async (counterData, box) => {
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
    ) {
      if (
        (box !== undefined && box === GlobalUnitsModel.AirBox.JP_CD1_CAP) ||
        box === GlobalUnitsModel.AirBox.JP_CD2_CAP ||
        box === GlobalUnitsModel.AirBox.US_TF16_CAP ||
        box === GlobalUnitsModel.AirBox.US_TF17_CAP ||
        box === GlobalUnitsModel.AirBox.US_MIDWAY_CAP
      ) {
        await moveOrphanedCAPUnitsToEliminatedBoxNight(counterData.side, box, counterData)
      }
    }
    if (box !== undefined && box.includes("CAP RETURNING")) {
      const reorgUnits = await moveOrphanedCAPUnitsToEliminatedBox(counterData.side, box, counterData)
      // if (reorgUnits != undefined && reorgUnits.length > 0) {
      //   setReorgAlertShow(true)
      // }
    }
    if (box !== undefined && box.includes("RETURNING (1)")) {
      await moveOrphanedAirUnitsInReturn1Boxes(counterData.side, box, counterData)
    }
    const destBoxes = controller.getValidAirUnitDestinations(counterData.name)
    if (counterData.side === GlobalUnitsModel.Side.JAPAN) {
      setEnabledJapanBoxes(() => destBoxes)
    } else {
      setEnabledUSBoxes(() => destBoxes)
    }
  }
  const handleClick = (e) => {
    // do not reorgsanise air units in strike boxes or Midway air units
    if (!location.boxName.includes("STRIKE") && counterData.carrier !== GlobalUnitsModel.Carrier.MIDWAY) {
      checkForAirUnitReorganization()
    }

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
    setBoxes(counterData, location.boxName)

    // only the selected (clicked) air unit should be draggable
    setSelected(true)
  }

  const handleRightClick = (e) => {
    e.preventDefault()
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  const transform =
    counterData.aircraftUnit.moved || counterData.aircraftUnit.airOpMoved !== undefined ? "rotate(45deg)" : ""

  const outline = counterData.border ? "3px solid rgb(184,29,29)" : ""

  let disp = "block"
  if (
    !loading &&
    (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.INITIATIVE_DETERMINATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_AIR_OPERATION)
  ) {
    if (location.boxName.includes("OFFBOARD")) {
      disp = "none"
    }
  }

  return (
    <div>
      <input
        hidden={GlobalGameState.hide(counterData)}
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
          outline: outline,
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
