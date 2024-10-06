import { React } from "react"
import "./cap.css"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import Controller from "../controller/Controller"

export function EscortHeaders({ controller, setEscortSteps }) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Target For Air Attack:"

  const fleetBeingAttacked = controller.getFleetForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)

  let location
  if (fleetBeingAttacked === "MIDWAY") {
    location = Controller.MIDWAY_HEX
  } else {
    location = controller.getFleetLocation(fleetBeingAttacked, sideBeingAttacked)
  }

  const strikeGroups = controller.getAllStrikeGroupsInLocation(location, GlobalGameState.sideWithInitiative)

  const sgs = strikeGroups.filter((group => !group.attacked))
  let fighters = controller.getAllFightersInBox(sgs[0].box)

  let NoFightersMsg = "Roll 1 Die for each Fighter Step"
  if (fighters.length === 0) {
    NoFightersMsg = "No Escort Fighters. Click Close to move on to next phase"
  }

  const airCounters = fighters.map((airUnit) => {
    const outline = airUnit.aircraftUnit.intercepting ? "5px solid rgb(184,29,29)" : ""
    return (
      <div>
        <input
          type="image"
          src={airUnit.image}
          style={{
            width: "80px",
            height: "80px",
            marginLeft: "40px",

            marginRight: "45px",
            outline: outline,
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "15px",
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
          {NoFightersMsg}
        </p>
      </div>
    </>
  )
}

export function EscortFooters({ controller, setFightersPresent }) {
  const show =  GlobalGameState.dieRolls.length > 0

    const msg="Number of Hits:"
 
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
              {msg} &nbsp;<strong>{GlobalGameState.fighterHits}</strong>&nbsp;
            </p>
          </div>
        )}
      </>
    )
}
