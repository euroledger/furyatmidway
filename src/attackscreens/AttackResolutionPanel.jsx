import { React } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { allFleetsSunk, removeMIFFleet } from "../PlayerState/StateUtils"
import { sideBeingAttacked } from "../Utils"

export function AttackResolutionHeaders() {}

export function AttackResolutionFooters({
  totalHits,
  attackResolved,
  setAttackResolved,
  setFleetUnitUpdate,
  setGameOverAlertShow,
}) {
  // const show = GlobalGameState.dieRolls.length > 0

  const show = true
  const hits = totalHits === -1 ? "" : totalHits
  const msg = "Total Number of Hits:"

  let isMIFtheTarget = GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.MIF

  let midwayMsg = ""
  if (GlobalGameState.currentCarrierAttackTarget.toUpperCase() === GlobalUnitsModel.TaskForce.MIDWAY) {
    midwayMsg = "(Max. 2 hits per air attack)"
  }
  let mifMsg = ""
  let milStr = ""
  if (isMIFtheTarget && !attackResolved && GlobalGameState.dieRolls.length > 0) {
    setAttackResolved(true)
    GlobalGameState.midwayInvasionLevel -= totalHits === -1 ? 0 : totalHits

    if (GlobalGameState.midwayInvasionLevel < 0) {
      GlobalGameState.midwayInvasionLevel = 0
    }
    console.log("DEBUG CHECK MIF FOR SUNK")
    if (GlobalGameState.midwayInvasionLevel === 0) {
      console.log("DEBUG SUNK REMOVE MIF FLEET")
      removeMIFFleet(setFleetUnitUpdate)
    }
  }
  if (isMIFtheTarget && GlobalGameState.dieRolls.length > 0) {
    milStr = "" + GlobalGameState.midwayInvasionLevel

    if (totalHits > 0) {
      mifMsg = "Midway Invasion Force reduced to"
    } else {
      mifMsg = "Midway Invasion Force remains at"
    }
  }
  // if (isMIFtheTarget && !attackResolved) {
  //   if (totalHits > 0) {
  //     mifMsg = "Midway Invasion Force reduced to"
  //   } else {
  //     mifMsg = "Midway Invasion Force remains at"
  //   }
  // }

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
              <p
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {midwayMsg}
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
                  {mifMsg} &nbsp;<strong>{milStr}</strong>&nbsp;
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
