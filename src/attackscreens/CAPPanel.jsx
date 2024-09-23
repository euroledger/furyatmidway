import { React } from "react"
import "./cap.css"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"

export function CAPHeaders({ controller, setCapAirUnits, capSteps, setCapSteps }) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Target For Air Attack:"

  const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)
  const capUnits = controller.getAllAirUnitsInBox(capBox)

  const bg =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? "rgba(92, 131, 228, 0.8)"
      : "rgba(228, 92, 92, 0.8)"

  const handleClick = (airUnit) => {
    if (airUnit.aircraftUnit.intercepting) {
      setCapSteps(() => capSteps - airUnit.aircraftUnit.steps)
    } else {
      setCapSteps(() => capSteps + airUnit.aircraftUnit.steps)
    }
    airUnit.aircraftUnit.intercepting = !airUnit.aircraftUnit.intercepting
    setCapAirUnits(() => controller.getAllCAPDefenders(sideBeingAttacked))
    GlobalGameState.updateGlobalState()
  }
  const attackers = controller.getAttackingStrikeUnits(false)
  const strikeCounters = attackers.map((airUnit) => {
    return (
      <div>
        <img
          src={airUnit.image}
          style={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
            marginTop: "-20px",
          }}
        ></img>
      </div>
    )
  })
  const airCounters = capUnits.map((airUnit) => {
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
          {msg} &nbsp;<strong>{GlobalGameState.taskForceTarget}</strong>&nbsp;
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            zIndex: 100,
            width: "400px",
            height: "70px",
            background: bg,
            borderRadius: "3px",
            color: "white",
            border: "1px solid white",
            marginBottom: "10px",
          }}
        >
          <p style={{ marginLeft: "5px" }}>Incoming Strike Group</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "7px",
            }}
          >
            {strikeCounters}
          </div>
        </div>
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
          Steps Selected: &nbsp;<strong>{capSteps}</strong>&nbsp;
        </p>
      </div>
    </>
  )
}

export function CAPFooters({ controller, setFightersPresent }) {
  const show = GlobalGameState.dieRolls.length > 0

  const msg = "Number of Hits:"

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const fighters = controller.anyFightersInStrike(GlobalGameState.taskForceTarget, sideBeingAttacked)

  let fighterMsg = ""
  if (!fighters) {
    setFightersPresent(false)
    fighterMsg = "There are no fighters in this strike group - combat strengths increased by 1"
  }

  return (
    <>
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
          {fighterMsg}
          <br></br>
        </p>
        {show && (
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
        )}
      </div>
    </>
  )
}
