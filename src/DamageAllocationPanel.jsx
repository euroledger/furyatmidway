import { React } from "react"
import "./cap.css"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalGameState from "./model/GlobalGameState"
import { doDamageAllocation } from "./DiceHandler"


// @TODO Move this into Util file somewhere (or to controller?)


// @TODO extend this component to allow damage to CAP units (in response to fighter escort counterattack)
export function DamageHeaders({ controller, eliminatedSteps, setEliminatedSteps, setStepsLeft, capAirUnits }) {
  const msg = "Number of Hits to Allocate:"

  console.log("capAirUnits = ", capAirUnits)
  const unitsInGroup = capAirUnits ?? controller.getAttackingStrikeUnits()

  console.log("unitsInGroup=", unitsInGroup)
 
  let totalSteps = 0
  const airCounters = unitsInGroup.map((airUnit) => {
    if (airUnit.aircraftUnit.steps === 0) {
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
      setEliminatedSteps(0)
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
          {msg} &nbsp;<strong>{GlobalGameState.capHits !== undefined ?  GlobalGameState.capHits : 0}</strong>&nbsp; <br></br>
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
