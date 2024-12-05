import { React } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { SingleCarrier } from "./SingleCarrier"

export function AttackResolutionHeaders() {
  
}

export function AttackResolutionFooters({ totalHits, attackResolved, setAttackResolved }) {
  // const show = GlobalGameState.dieRolls.length > 0


  const show = true
  const hits = totalHits === -1 ? "" : totalHits
  const msg = "Total Number of Hits:"

  let isMIFtheTarget = GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.MIF

  let mifMsg = ""
  if (isMIFtheTarget && !attackResolved && GlobalGameState.dieRolls.length > 0) {
    setAttackResolved(true)
    GlobalGameState.midwayInvasionLevel-= totalHits === -1 ? 0 : totalHits
  }
  if (isMIFtheTarget) {
    if (totalHits > 0) {
      mifMsg = "Midway Invasion Force reduced to"
    } else {
      mifMsg = "Midway Invasion Force remains at"
    }
  }

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

            {!isMIFtheTarget && (
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
            )}
             {isMIFtheTarget && (
              <div
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>
                  {mifMsg} &nbsp;<strong>{GlobalGameState.midwayInvasionLevel}</strong>&nbsp;
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
