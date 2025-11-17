import { React, useEffect, useState, createRef } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import { doDamageAllocation } from "../DiceHandler"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalInit from "../model/GlobalInit"

export function DamageHeaders({
  controller,
  eliminatedSteps,
  setEliminatedSteps,
  setStepsLeft,
  disableButtons,
  capAirUnits,
}) {
  const [elRefs, setElRefs] = useState([])
  const [eliminatedUnits, setEliminatedUnits] = useState([])

  const msg = "Number of Hits to Allocate:"

  let unitsInGroup = capAirUnits ?? controller.getAttackingStrikeUnits()

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    // filter out fighters as AA hits must be allocated to attack aircraft
    unitsInGroup = controller.getAttackingStrikeUnits(true)
  }
  const arrLength = unitsInGroup.length

  console.log(">>>> arrLEngth=", arrLength)
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    )
  }, [])

  // TODO have array of air units, one for each step: display the names of elimintated steps
  useEffect(() => {
    if (GlobalGameState.testStepLossSelection === -1) {
      return
    }
    const myRef = elRefs[GlobalGameState.testStepLossSelection]
    if (myRef !== undefined && myRef.current !== undefined && myRef.current !== null) {
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

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
      totalSteps += airUnit.aircraftUnit.steps
    } else {
      if (!capAirUnits) {
        if (
          airUnit.aircraftUnit.attack ||
          GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
        ) {
          totalSteps += airUnit.aircraftUnit.steps
        }
      }
    }
    const stepStr = `(${airUnit.aircraftUnit.steps})`
    return (
      <div>
        <input
          ref={elRefs[i]}
          onClick={(e) => handleClick(e, airUnit)}
          type="image"
          // disabled={disableButtons}
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

  const handleClick = (e, airUnit) => {
    // TODO
    // We need a general utility function that checks:
    //    i) if this is an AI screen
    //    ii) if this is a human button click
    // => if so, disallow the click

    // then we can get rid of disable buttons
    if (disableButtons && e.clientX !== 0 && e.clientY !== 0) {
      // AI screen, disallow human clicks by checking mouse click location
      return
    }
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
      GlobalGameState.attackingStepsRemaining = totalSteps
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
      if (eliminatedSteps === GlobalGameState.antiaircraftHits) {
        // setEliminatedSteps(0)
        return // don't allow more steps to be eliminated than is necessary
      }
      GlobalGameState.attackingStepsRemaining = totalSteps
    }

    doDamageAllocation(controller, airUnit)
  
    setEliminatedSteps(() => eliminatedSteps + 1)

    GlobalGameState.updateGlobalState()

    setEliminatedUnits(()=> [...eliminatedUnits,airUnit])
  }
  let hitsToAllocate = GlobalGameState.capHits !== undefined ? GlobalGameState.capHits : 0
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    hitsToAllocate = GlobalGameState.antiaircraftHits !== undefined ? GlobalGameState.antiaircraftHits : 0
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    hitsToAllocate = GlobalGameState.fighterHits !== undefined ? GlobalGameState.fighterHits : 0
  }

  let side = GlobalGameState.sideWithInitiative
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    if (side === GlobalUnitsModel.Side.US) {
      side = GlobalUnitsModel.Side.JAPAN
    } else {
      side = GlobalUnitsModel.Side.US
    }
  }

  const selectionMsg = disableButtons ? `${side} Selects Steps to Eliminate` : "Select Steps to Eliminate"
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
          {selectionMsg}
          <br></br>
        </p>
        {!disableButtons && (
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
        )}
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
