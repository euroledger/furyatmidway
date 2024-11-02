import { React, useState, useRef, useEffect } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"

export function FleetTargetHeaders({ controller, setTargetSelected }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const [myTarget, setMyTarget] = useState(null)

  const handleClick = (target) => {
    setTargetSelected(true)
    setButtonsDisabled(true)
    setMyTarget(target.longName)
    GlobalGameState.fleetTarget = target.name
    // If target is DMCV fleet, get the damaged carrier in this fleet -> this will be the carrier target

    if (target.name.includes("DMCV")) {
      if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US) {
        GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.JAPAN_DMCV
        GlobalGameState.currentCarrierAttackTarget = GlobalGameState.jpDMCVCarrier
      } else {
        GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.US_DMCV
        GlobalGameState.currentCarrierAttackTarget = GlobalGameState.usDMCVCarrier
      }
    }
  }
  const display = buttonsDisabled ? "flex" : "none"

  const message1 = "Fleet Target Selected: "

  const createFleetButton = (fleet) => {
    return (
      <input
        onClick={() => handleClick(fleet)}
        type="image"
        src={fleet.image}
        style={{
          width: "90px",
          height: "90px",
          marginLeft: "20px",
          marginRight: "30px",
        }}
      />
    )
  }

  //   console.log(">>> attackingSG=", GlobalGameState.attackingStrikeGroup)

  const fleets = controller.getAllFleetsInLocation(
    GlobalGameState.attackingStrikeGroup.location,
    GlobalGameState.sideWithInitiative,
    true
  )

  const fleetCounters = fleets.map((fleet) => createFleetButton(fleet))

  let selectMsg = "Select a fleet target to attack"

  return (
    <div
      style={{
        marginLeft: "-28px",
      }}
    >
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        {selectMsg}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <p>{fleetCounters}</p>
      </div>

      <p
        style={{
          display: display,
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        {message1} &nbsp;<strong>{myTarget}</strong>&nbsp;
      </p>
    </div>
  )
}

export function FleetTargetFooters(targetSelected) {
  //   const show = targetSelected
  //   const msg = "Fleet Target Determined For Air Attack:"
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
  //             {msg} &nbsp;<strong>{GlobalGameState.fleetTarget}</strong>&nbsp;
  //           </p>
  //         </div>
  //       )}
  //     </>
  //   )
}
