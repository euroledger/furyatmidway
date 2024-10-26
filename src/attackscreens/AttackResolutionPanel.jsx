import { React } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { SingleCarrier } from "./SingleCarrier"

export function AttackResolutionHeaders({ controller }) {
  const msg = "Target For Air Attack:"

  const attackers = controller.getStrikeUnitsAttackingCarrier()

  let dbDRM = "No Attack Planes On Deck: No (Dive Bomber) DRM"
  let torpDRM = "Not a combined attack: No (Torpedo Bomber) DRM"
  const attackAircraftOnDeck = controller.attackAircraftOnDeck()
  if (attackAircraftOnDeck) {
    dbDRM = "Attack Planes On Deck: +1 (Dive Bomber) DRM"
  }
  const combinedAttack = controller.combinedAttack()
  if (combinedAttack) {
    torpDRM = "Combined attack: +1 (Torpedo Bomber) DRM"
  }

  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    dbDRM = "Midway Dive Bomber DRM: -1"
    torpDRM = "Midway Torpedo Bomber DRM: -1"
  }

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
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {dbDRM}
        </p>
      </div>
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {torpDRM}
        </p>
      </div>
    </>
  )
}

export function AttackResolutionFooters({ totalHits }) {
  // const show = GlobalGameState.dieRolls.length > 0

  const show = true
  const hits = totalHits === -1 ? "" : totalHits
  const msg = "Total Number of Hits:"


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
                (click <strong>Next...</strong> to continue)
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
