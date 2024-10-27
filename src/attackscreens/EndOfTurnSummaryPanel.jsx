import { React, useEffect, useState, createRef } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import { doDamageAllocation } from "../DiceHandler"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

// @TODO Move this into Util file somewhere (or to controller?)

// @TODO extend this component to allow damage to CAP units (in response to fighter escort counterattack)
export function EndOfTurnSummaryHeaders({ controller }) {
  const japanCVMsg = "IJN CVs Sunk (1 VP each):"
  const usCVMsg = "US CVs Sunk (1 VP each):"
  const midwayControlMsg = "Side Controlling Midway:"

  const japanCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.JAPAN)
  const usCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US)

  const numJapanCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.JAPAN).length
  const numUSCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US).length

  let japanCVsSunkMsg = ""
  if (numJapanCVsSunk > 0) {
    for (let i = 0; i < japanCVsSunk.length; i++) {
      japanCVsSunkMsg += japanCVsSunk[i]
      if (i < japanCVsSunk.length - 1) {
        japanCVsSunkMsg += ", "
      }
    }
    japanCVsSunkMsg = ` (${japanCVsSunkMsg})`
  }

  let usCVsSunkMsg = ""
  if (numUSCVsSunk > 0) {
    for (let i = 0; i < usCVsSunk.length; i++) {
      usCVsSunkMsg += usCVsSunk[i]
      if (i < usCVsSunk.length - 1) {
        usCVsSunkMsg += ", "
      }
    }
    usCVsSunkMsg = ` (${usCVsSunkMsg})`
  }

  const midwayControl = GlobalGameState.midwayControl === GlobalUnitsModel.Side.US ? "US" : "JAPAN"

  const gameContinuesMsg = GlobalGameState.gameTurn === 3 ? "Neither Side has Achieved Victory" : ""

  let winner = undefined
  if (GlobalGameState.gameTurn === 3) {
    winner = controller.victoryCheck()
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div>
          <p
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
            {japanCVMsg} &emsp;
            <strong>
              {numJapanCVsSunk}
              {japanCVsSunkMsg}
            </strong>
            &emsp; <br></br>
          </p>
          <p
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
            {usCVMsg} &emsp;
            <strong>
              {numUSCVsSunk}
              {usCVsSunkMsg}
            </strong>
            &emsp; <br></br>
          </p>
          <p
            style={{
              color: "white",
              marginTop: "5px",
            }}
          >
            {midwayControlMsg} &emsp;<strong>{midwayControl}</strong>&emsp; <br></br>
          </p>
          <p
            style={{
              marginTop: "20px",
              color: "white",
            }}
          >
            {gameContinuesMsg}
          </p>
          {winner && (
            <p
              style={{
                display: "flex",
                marginTop: "50px",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              Automatic Victory {winner} !!
            </p>
          )}
          <p
            style={{
              display: "flex",
              marginTop: "50px",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            Click "Close" to begin next turn...
          </p>
        </div>

        <div></div>
        <div></div>
      </div>
    </>
  )
}

export function EndOfTurnSummaryFooters({ eliminatedSteps, capAirUnits }) {
  // let show = eliminatedSteps === GlobalGameState.capHits
  // if (capAirUnits) {
  //   show = eliminatedSteps === GlobalGameState.fighterHits
  // } else {
  //   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
  //     show = eliminatedSteps === GlobalGameState.antiaircraftHits
  //   }
  // }
  // return (
  //   <>
  //     {show && (
  //       <div
  //         style={{
  //           marginTop: "10px",
  //           marginLeft: "-28px",
  //         }}
  //       >
  //         <p
  //           style={{
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             color: "white",
  //           }}
  //         >
  //           All Done!
  //         </p>
  //       </div>
  //     )}
  //   </>
  // )
}
