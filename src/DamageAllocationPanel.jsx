import { React, useState } from "react"
import "./cap.css"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalGameState from "./model/GlobalGameState"
import Controller from "./controller/Controller"

export function DamageHeaders({ controller, capAirUnits, setCapAirUnits }) {
  const [eliminatedSteps, setEliminatedSteps] = useState(0)

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Number of Hits to Allocate:"

  const fleetBeingAttacked = controller.getFleetForTaskForce(GlobalGameState.airAttackTarget, sideBeingAttacked)
  const location = controller.getFleetLocation(fleetBeingAttacked, sideBeingAttacked)

  const strikeGroups = controller.getAllStrikeGroupsInLocation(location, GlobalGameState.sideWithInitiative)

  let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroups[0].box)

  const airCounters = unitsInGroup.map((airUnit) => {
    const outline = airUnit.aircraftUnit.intercepting ? "5px solid rgb(184,29,29)" : ""
    return (
      <div>
        <input
          onClick={() => handleClick(airUnit)}
          type="image"
          src={airUnit.image}
          style={{
            width: "80px",
            height: "80px",
            marginLeft: "20px",

            marginRight: "55px",
            outline: outline,
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "5px",
            color: "white",
          }}
        >
          {airUnit.name}
        </p>
      </div>
    )
  })
  const handleClick = (airUnit) => {
    // if (airUnit.aircraftUnit.intercepting) {
    //   setCapSteps(() => capSteps - airUnit.aircraftUnit.steps)
    // } else {
    //   setCapSteps(() => capSteps + airUnit.aircraftUnit.steps)
    // }
    // airUnit.aircraftUnit.intercepting = !airUnit.aircraftUnit.intercepting
    // setCapAirUnits(() => controller.getAllCAPDefenders(sideBeingAttacked))
    // GlobalGameState.updateGlobalState()
  }
  return (
    <>
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {msg} &nbsp;<strong>{GlobalGameState.capHits}</strong>&nbsp;
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {airCounters}
      </div>
      <div>
        <p
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Select Steps to Elimintate
        </p>
      </div>
      <div>
        <p
          style={{
            display: "flex",
            marginTop: "50px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Steps Eliminated: &nbsp;<strong>{eliminatedSteps}</strong>&nbsp;
        </p>
      </div>
    </>
  )
}

export function DamageFooters() {
  //   const show =  GlobalGameState.capHits > 0
  //   const msg="Number of Hits:"
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
  //             {msg} &nbsp;<strong>{GlobalGameState.capHits}</strong>&nbsp;
  //           </p>
  //         </div>
  //       )}
  //     </>
  //   )
}
