import { React, useState } from "react"
import "./cap.css"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalGameState from "./model/GlobalGameState"
import Controller from "./controller/Controller"
import { doDamageAllocation } from "./DiceHandler"

export function DamageHeaders({ controller, eliminatedSteps, setEliminatedSteps, setStepsLeft }) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Number of Hits to Allocate:"

  const fleetBeingAttacked = controller.getFleetForTaskForce(GlobalGameState.airAttackTarget, sideBeingAttacked)
  const location = controller.getFleetLocation(fleetBeingAttacked, sideBeingAttacked)

  const strikeGroups = controller.getAllStrikeGroupsInLocation(location, GlobalGameState.sideWithInitiative)

  let unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroups[0].box)

  let totalSteps = 0
  const airCounters = unitsInGroup.map((airUnit) => {
    if (airUnit.aircraftUnit.steps === 0) {
      console.log("SET STEPS LEFT TO 0")
      setStepsLeft(0)
      return <></>
    }
    totalSteps += airUnit.aircraftUnit.steps
    const stepStr = `(${airUnit.aircraftUnit.steps})`
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
        <p
          style={{
            marginTop: "-10px",
            marginLeft: "55px",
            color: "white",
          }}
        >
          {stepStr}
        </p>
      </div>
    )
  })
  setStepsLeft(totalSteps)

  const handleClick = (airUnit) => {
    if (eliminatedSteps === GlobalGameState.capHits) {
      return // don't allow more steps to be eliminated than is necessary
    }
    doDamageAllocation(controller, airUnit)
    setEliminatedSteps(() => eliminatedSteps + 1)
    GlobalGameState.updateGlobalState()
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
          {msg} &nbsp;<strong>{GlobalGameState.capHits}</strong>&nbsp; <br></br>
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
          Select Steps to Elimintate <br></br>
          (click on air unit to eliminate a step)
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

export function DamageFooters({ eliminatedSteps }) {
  console.log("eliminatedSteps = ", eliminatedSteps)
  const show = eliminatedSteps === GlobalGameState.capHits
  return (
    <>
      {show && (
        <div
          style={{
            marginTop: "10px",
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
            All Done!
          </p>
        </div>
      )}
    </>
  )
}
