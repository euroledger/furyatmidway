import { React, useState } from "react"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import AirAttackCounter from "./AttackAirCounter"
import { CarrierTarget } from "./CarrierTarget"
import "./attackpanel.css"

export function AttackTargetHeaders({ controller, setAttackTargetsSelected }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const [myCarrier, setMyCarrier] = useState("")
  const [myIdx, setMyIdx] = useState("")

  const display = buttonsDisabled ? "flex" : "none"

  const message1 = "Target Selected: "

  const unitsInGroup = controller.getAttackingStrikeUnits(true)

  let base = 10 + (8 - unitsInGroup.length) * 5

  if (unitsInGroup.length === 1) {
    base = 43
  }

  const airCounters = unitsInGroup.map((airUnit, index) => {
    const left = base + (10 * index)
    return (
      <AirAttackCounter
        style={{
          zIndex: 50,
        }}
        controller={controller}
        airUnit={airUnit}
        index={index}
        myCarrier={myCarrier}
        myIdx={myIdx}
        lefty={left}
        setAttackTargetsSelected={setAttackTargetsSelected}
      ></AirAttackCounter>
    )
  })
  const handleDragEnter = (e, carrier, idx) => {
    setMyCarrier(carrier)
    setMyIdx(idx)
  }
  return (
    <div
      style={{
        marginLeft: "-28px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {airCounters}
      </div>
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          marginTop: "100px",
        }}
      >
        Select a target to attack for each air unit (drag to target)
      </p>
      <CarrierTarget controller={controller} handleDragEnter={handleDragEnter}></CarrierTarget>
      <p
        style={{
          display: display,
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        {message1} &nbsp;<strong>{myCarrier}</strong>&nbsp;
      </p>
     </div>
  )
}

export function AttackTargetFooters() {
  //   const show = GlobalGameState.dieRolls > 0
  //   const msg = "Target Determined For Air Attack:"
  //   return (
  //     <>
  //       {show && (
  //         <div
  //           style={{
  //             marginTop: "10px",
  //             marginLeft: "-28px",
  //           }}
  //         >
  //           <p
  //             style={{
  //               display: "flex",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               color: "white",
  //             }}
  //           >
  //             {msg} &nbsp;<strong>{GlobalGameState.taskForceTarget}</strong>&nbsp;
  //           </p>
  //         </div>
  //       )}
  //     </>
  //   )
}
