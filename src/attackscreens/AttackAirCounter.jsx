import { React, useState } from "react"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

function AirAttackCounter({
  controller,
  airUnit,
  index,
  myCarrier,
  myIdx,
  lefty,
  setAttackTargetsSelected,
  attackAirCounterUpdate,
}) {
  const [zIndex, setZindex] = useState(10)

  const onDrag = () => {}

  const leftStr = 40 + index * 10
  let l = "" + leftStr + "%"

  // if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
  l = "" + lefty + "%"
  // }
  const [position, setPosition] = useState({
    left: l,
    top: "10%",
  })

  const [uuid, setUUid] = useState()

  const setUSAttackAirUnit = (airUnit, carrier, index) => {

    // if unit was previously assigned the other carrier - remove from map
    controller.removeAirUnitTarget(airUnit)
    controller.setAirUnitTarget(airUnit, carrier)

    // how many air units have been allocated to attack this carrier
    let size = controller.getTargetMapSizeForCarrier(carrier)

    let i = controller.getTargetMapSize()
    let j = controller.getAttackingStrikeUnits(true).length

    if (i == j) {
      const targets = controller.getAttackTargets()
      console.log("++++++++++ QUACK 3 set carrierTarget1 to", targets[0])
      GlobalGameState.carrierTarget1 = targets[0]
      if (targets.length === 2) {
        GlobalGameState.carrierTarget2 = targets[1]
      }
      // all units allocated a target
      setAttackTargetsSelected(() => true)
    }
    // const top = size === 1 ? "57%" : "52%"
    let left, top
    // idx is carrier 1 or 2
    
    console.log(">>>>>>>>>>>>>>>>>>> CARRIER INDEX=", index)

    // index 1 is left carrier, 2 is right carrier
    if (index === 1) {
      // left = size === 1 ? "10.4%" : "13.4%"
      if (size === 1) {
        left = "10.4%"
        top = "57%"
      } else if (size === 2) {
        left = "11.9%" 
        top = "54.5%"
      } else {
        left = "13.4%"
        top = "52%"
      }
    } else {
      // left = size === 1 ? "75.4%" : "78.4%"
      // left = size === 1 ? "75.4%" : "78.4%"
      if (size === 1) {
        left = "75.4%"
        top = "57%"
      } else if (size === 2) {
        left = "76.9%" 
        top = "54.5%"
      } else {
        left = "78.4%"
        top = "52%"
      }
    }

    setPosition(() => ({
      left: left,
      top: top,
    }))
    // if (size === 2) {
    //   setZindex(() => zIndex + 1)
    // }
    if (size > 1) {
      setZindex(() => size * 10)
    } else {
      setZindex(() => 5)
    }
  }
  const setJapanAttackAirUnit = (airUnit, carrier, index) => {
    controller.removeAirUnitTarget(airUnit)

    controller.setAirUnitTarget(airUnit, carrier)
    // how many air units have been allocated to attack this carrier
    let size = controller.getTargetMapSizeForCarrier(carrier)

    let i = controller.getTargetMapSize()
    // let j = controller.getAttackingStrikeUnitsTEST(GlobalUnitsModel.TaskForce.TASK_FORCE_16).length
    let j = controller.getAttackingStrikeUnits(true).length

    if (i == j) {
      const targets = controller.getAttackTargets()
      GlobalGameState.carrierTarget1 = targets[0]
      if (targets.length === 2) {
        GlobalGameState.carrierTarget2 = targets[1]
      }
      // all units allocated a target
      setAttackTargetsSelected(() => true)
    }
    const toppy = 64 - size * 2
    const top = "" + toppy + "%"

    let left, leftplop
    if (index === 1) {
      leftplop = 7.4 + 1 * size
    } else {
      leftplop = 73 + 1 * size
    }
    left = "" + leftplop + "%"

    setPosition(() => ({
      left: left,
      top: top,
    }))
    if (size > 1) {
      setZindex(() => size * 10)
    } else {
      setZindex(() => 5)
    }
  }
  if (
    airUnit.name === attackAirCounterUpdate.unit.name &&
    myCarrier !== attackAirCounterUpdate.carrier &&
    myIdx !== attackAirCounterUpdate && 
    uuid !== attackAirCounterUpdate.uuid
  ) {
    console.log("I am ", airUnit.name, " -> ATTACK AIR COUNTER UPDATE = ", attackAirCounterUpdate)

    if (attackAirCounterUpdate.side === GlobalUnitsModel.Side.US) {
      setUSAttackAirUnit(attackAirCounterUpdate.unit, attackAirCounterUpdate.carrier, attackAirCounterUpdate.id)
    } else {
      setJapanAttackAirUnit(attackAirCounterUpdate.unit, attackAirCounterUpdate.carrier, attackAirCounterUpdate.id)
    }
    setUUid(attackAirCounterUpdate.uuid)
  }



  const handleDropUS = (airUnit) => {
    setUSAttackAirUnit(airUnit, myCarrier, myIdx)
  }



  const handleDropJapan = (airUnit) => {
    setJapanAttackAirUnit(airUnit, myCarrier, myIdx)
  }

  const handleDrop = (e, airUnit) => {
    if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US) {
      handleDropUS(airUnit)
    } else {
      handleDropJapan(airUnit)
    }
  }
 

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
