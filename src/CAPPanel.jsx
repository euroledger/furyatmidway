import { React, useState } from "react"
import "./cap.css"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalGameState from "./model/GlobalGameState"
import Controller from "./controller/Controller"

export function CAPHeaders({ controller, setNumCapSteps }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false)

  const [steps, setSteps] = useState(0)

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Target For Air Attack:"

  const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.airAttackTarget, sideBeingAttacked)

  const capUnits = controller.getAllAirUnitsInBox(capBox)

  const handleClick = (airUnit) => {
    if (airUnit.aircraftUnit.intercepting) {
      console.log("AIR UNIT STEPS = ", airUnit.aircraftUnit.steps)
      setSteps(() => steps - airUnit.aircraftUnit.steps)
      setNumCapSteps(() => steps - airUnit.aircraftUnit.steps)
    } else {
      setSteps(() => steps + airUnit.aircraftUnit.steps)
      setNumCapSteps(() => steps + airUnit.aircraftUnit.steps)
    }
    airUnit.aircraftUnit.intercepting = !airUnit.aircraftUnit.intercepting
    console.log("CLICKED on", airUnit.name, "intercepting =", airUnit.aircraftUnit.intercepting)
    GlobalGameState.updateGlobalState()
    
  }
  const airCounters = capUnits.map((airUnit) => {
    const outline = airUnit.aircraftUnit.intercepting ? "5px solid rgb(184,29,29)" : ""
    console.log("OUTLINE=", outline)
    return (
      <div>
        <input
          onClick={() => handleClick(airUnit)}
          type="image"
          src={airUnit.image}
          style={{
            width: "80px",
            height: "80px",
            marginRight: "75px",
            outline: outline
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "-10px",
            color: "white",
          }}
        >
          {airUnit.name}
        </p>
      </div>
    )
  })

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
          {msg} &nbsp;<strong>{GlobalGameState.airAttackTarget}</strong>&nbsp;
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
          Select Air Units to Intercept or Close if no interception
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
          Steps Selected: &nbsp;<strong>{steps}</strong>&nbsp;
        </p>
      </div>
    </>
  )
}

export function CAPFooters() {
  const show = GlobalGameState.dieRolls > 0

  return (
    <>
      {/* {show && (
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
            {msg} &nbsp;<strong>{GlobalGameState.airAttackTarget}</strong>&nbsp;
          </p>
        </div>
      )} */}
    </>
  )
}
