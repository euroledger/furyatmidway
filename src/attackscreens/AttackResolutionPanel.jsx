import { React } from "react"
import "./cap.css"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import { SingleCarrier } from "./SingleCarrier"

export function AttackResolutionHeaders({ controller }) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Target For Air Attack:"

  const attackers = controller.getStrikeUnitsAttackingCarrier()

  const airCounters = attackers.map((airUnit) => {
    return (
      <div>
        <input
          type="image"
          src={airUnit.image}
          style={{
            width: "80px",
            height: "80px",
            marginLeft: "15px",
            marginRight: "35px",
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
          {msg} &nbsp;<strong>{GlobalGameState.currentCarrierAttackTarget}</strong>&nbsp;
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
          display: "inline-block",
          marginBottom: "20px",
          marginLeft: "439px",
        }}
      >
        <div
          style={{
            maxHeight: "200",
            minHeight: "200px",
          }}
        >
          <SingleCarrier controller={controller}></SingleCarrier>
        </div>
      </div>
    </>
  )
}

export function AttackResolutionFooters({ totalHits }) {
  const show = GlobalGameState.dieRolls.length > 0

  const hits = totalHits
  const msg = "Total Number of Hits:"

  const msg2 = GlobalGameState.carrierHitsDetermined
    ? "Roll to determine section damaged (1-3 is bow, 4-6 is stern)"
    : "Roll one die for each hit to determine box damaged"

  return (
    <>
      <div
        style={{
          marginTop: "10px",
          marginLeft: "-28px",

          color: "white",
        }}
      >
        {show && (
          <>
            <div>
              <p
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {msg} &nbsp;<strong>{hits}</strong>&nbsp;
              </p>
            </div>

            <div
              style={{
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                {msg2} (click <strong>Next...</strong> to continue)
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
