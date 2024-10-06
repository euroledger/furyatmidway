import { React, useEffect, useState, createRef } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import { doDamageAllocation } from "../DiceHandler"

// @TODO Move this into Util file somewhere (or to controller?)

// @TODO extend this component to allow damage to CAP units (in response to fighter escort counterattack)
export function DamageHeaders({ controller, eliminatedSteps, setEliminatedSteps, setStepsLeft, capAirUnits }) {
  const [elRefs, setElRefs] = useState([])

  const msg = "Number of Hits to Allocate:"

  let unitsInGroup = capAirUnits ?? controller.getAttackingStrikeUnits()
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    // filter out fighters as AA hits must be allocated to attack aircraft
    unitsInGroup = controller.getAttackingStrikeUnits(true)
  }
  const arrLength = unitsInGroup.length
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    )
  }, [])

  useEffect(() => {
    if (GlobalGameState.testStepLossSelection === -1) {
      return
    }
    const myRef = elRefs[GlobalGameState.testStepLossSelection]
    if (myRef !== undefined && myRef.current !== undefined) {
      myRef.current.click(myRef.current)
    }
  }, [GlobalGameState.testStepLossSelection])

  let totalSteps = 0
  const airCounters = unitsInGroup.map((airUnit, i) => {
    if (airUnit.aircraftUnit.steps === 0) {
      setStepsLeft(0)
      if (!capAirUnits) GlobalGameState.attackingStepsRemaining = 0
      return <></>
    }
    totalSteps += airUnit.aircraftUnit.steps
    const stepStr = `(${airUnit.aircraftUnit.steps})`
    return (
      <div>
        <input
          ref={elRefs[i]}
          onClick={() => handleClick(airUnit)}
          type="image"
          src={airUnit.image}
          style={{
            width: "60px",
            height: "60px",
            marginLeft: "15px",
            marginRight: "50px",
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
            marginLeft: "40px",
            color: "white",
          }}
        >
          {stepStr}
        </p>
      </div>
    )
  })
  setStepsLeft(totalSteps)
  if (!capAirUnits) GlobalGameState.attackingStepsRemaining = totalSteps

  const handleClick = (airUnit) => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
      if (eliminatedSteps === GlobalGameState.capHits) {
        // setEliminatedSteps(0)
        return // don't allow more steps to be eliminated than is necessary
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
      if (eliminatedSteps === GlobalGameState.fighterHits) {
        // setEliminatedSteps(0)
        return // don't allow more steps to be eliminated than is necessary
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
      if (eliminatedSteps === GlobalGameState.antiaircraftHits) {
        // setEliminatedSteps(0)
        return // don't allow more steps to be eliminated than is necessary
      }
    }

    doDamageAllocation(controller, airUnit)
    setEliminatedSteps(() => eliminatedSteps + 1)
    GlobalGameState.updateGlobalState()
  }
  let hitsToAllocate = GlobalGameState.capHits !== undefined ? GlobalGameState.capHits : 0

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    hitsToAllocate = GlobalGameState.antiaircraftHits !== undefined ? GlobalGameState.antiaircraftHits : 0
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    // console.log("Set hits to allocate to fighterHits =", GlobalGameState.fighterHits)
    hitsToAllocate = GlobalGameState.fighterHits !== undefined ? GlobalGameState.fighterHits : 0
  }
  // console.log("Hits to allocate=", hitsToAllocate)

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
          {msg} &nbsp;<strong>{hitsToAllocate}</strong>&nbsp; <br></br>
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
            marginLeft: "10px",
          }}
        >
          Select Steps to Eliminate <br></br>
        </p>
        <p
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginLeft: "10px",
          }}
        >
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

export function DamageFooters({ eliminatedSteps, capAirUnits }) {
  let show = eliminatedSteps === GlobalGameState.capHits
  if (capAirUnits) {
    show = eliminatedSteps === GlobalGameState.fighterHits
  } else {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
      show = eliminatedSteps === GlobalGameState.antiaircraftHits
    }
  }
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
