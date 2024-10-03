import { React, useState } from "react"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

function AirAttackCounter({ controller, airUnit, index, myCarrier, myIdx, lefty, setAttackTargetsSelected }) {
  
  const onDrag = () => {
  }

  const handleDropUS = (airUnit) => {
    // if unit was previously assigned the other carrier - remove from map
    controller.removeAirUnitTarget(airUnit)
    controller.setAirUnitTarget(airUnit, myCarrier)

    const map = controller.getTargetMap()
    // how many air units have been allocated to attack this carrier
    let size = controller.getTargetMapSizeForCarrier(myCarrier)

    let i = controller.getTargetMapSize()
    let j = controller.getAttackingStrikeUnits(true).length

    if (i == j) {
      const targets = controller.getAttackTargets()
      GlobalGameState.carrierTarget1 = targets[0]
      if (targets.length=== 2) {
        GlobalGameState.carrierTarget2 = targets[1]
      }
      // all units allocated a target
      setAttackTargetsSelected(() => true)
    }

    const top = size === 1 ? "57%" : "52%"
    let left
    // idx is carrier 1 or 2
    if (myIdx === 1) {
      left = size === 1 ? "10.4%" : "13.4%"
    } else {
      left = size === 1 ? "75.4%" : "78.4%"
    }

    setPosition(() => ({
      left: left,
      top: top,
    }))
    if (size === 2) {
      setZindex(() => zIndex + 1)
    }
  }

  const handleDropJapan = (airUnit) => {
    controller.removeAirUnitTarget(airUnit)
    controller.setAirUnitTarget(airUnit, myCarrier)
    // how many air units have been allocated to attack this carrier
    let size = controller.getTargetMapSizeForCarrier(myCarrier)

    let i = controller.getTargetMapSize()
    // let j = controller.getAttackingStrikeUnitsTEST(GlobalUnitsModel.TaskForce.TASK_FORCE_16).length
    let j = controller.getAttackingStrikeUnits(true).length

    if (i == j) {

      const targets = controller.getAttackTargets()
      GlobalGameState.carrierTarget1 = targets[0]
      if (targets.length=== 2) {
        GlobalGameState.carrierTarget2 = targets[1]
      }
      // all units allocated a target
      setAttackTargetsSelected(() => true)
    }
    const toppy = 64 - (size * 2)
    const top = "" + toppy + "%"

    let left, leftplop
    if (myIdx === 1) {
      leftplop = 7.4 + (1 * size)
    } else {
      leftplop = 73 + (1 * size)
    }
    left = "" + leftplop + "%"

    setPosition(() => ({
      left: left,
      top: top,
    }))
    if (size > 1) {
      setZindex(() => (size * 10))
    }
  }
  const handleDrop = (e, airUnit) => {
    if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US) {
      handleDropUS(airUnit)
    } else {
      handleDropJapan(airUnit)
    }
  }
  const leftStr = 40 + index * 10
  let l = "" + leftStr + "%"

  // if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
    l = "" + lefty + "%"
  // }
  const [position, setPosition] = useState({
    left: l,
    top: "10%",
  })

  const [zIndex, setZindex] = useState(10)
  return (
    <div>
      <input
        draggabble="true"
        onDragStart={onDrag}
        onDragEnd={(e) => handleDrop(e, airUnit)}
        type="image"
        src={airUnit.image}
        style={{
          width: "50px",
          height: "50px",
          position: "absolute",
          left: position.left,
          top: position.top,
          zIndex: zIndex,
        }}
        id="bollocks"
      />
    </div>
  )
}

export default AirAttackCounter
