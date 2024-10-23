import { React, useEffect, useState, createRef } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import { doDamageAllocation } from "../DiceHandler"

export function StrikeLostDamageHeaders({ controller, eliminatedSteps, setEliminatedSteps, cardNumber, setStepsLeft }) {
  const [elRefs, setElRefs] = useState([])

  const msg = "Number of Hits to Allocate:"

  console.log("controller=", controller)

  let unitsInGroup = controller.getAttackingStrikeUnits()
  console.log("POO unitsInGroup=", unitsInGroup)

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
    if (myRef !== undefined && myRef.current !== undefined && myRef.current !== null) {
      myRef.current.click(myRef.current)
    }
  }, [GlobalGameState.testStepLossSelection])

  let totalSteps = 0

  const airCounters = unitsInGroup.map((airUnit, i) => {
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
  GlobalGameState.attackingStepsRemaining = totalSteps

  const handleClick = (airUnit) => {
    const hits = cardNumber === 11 ? 2 : 1

    if (eliminatedSteps === hits) {
      return
    }

    doDamageAllocation(controller, airUnit)
    setEliminatedSteps(() => eliminatedSteps + 1)
    GlobalGameState.updateGlobalState()
  }

  const hitsToAllocate = 2
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

export function StrikeLostDamageFooters({ eliminatedSteps }) {
  const show = eliminatedSteps === 2 // if card is 11

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
