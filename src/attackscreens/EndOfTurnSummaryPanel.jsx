import { React, useEffect, useState, createRef } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import { doDamageAllocation } from "../DiceHandler"
import GlobalUnitsModel from "../model/GlobalUnitsModel"


export function EndOfTurnSummaryHeaders({ controller }) {
  const japanCVMsg = "IJN CVs Sunk (1 VP each):"
  const usCVMsg = "US CVs Sunk (1 VP each):"
  const midwayControlMsg = "Midway Controlled By:"

  const japanCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.JAPAN)
  const usCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US)

  const numJapanCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.JAPAN).length
  const numUSCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US).length

  const japanCSFMsg = "CSF Left Map:"
  const us1AFMsg = "1AF Left Map:"

  const csfLeft = GlobalGameState.CSFLeftMap ? "YES" : "NO"
  const af1Left = GlobalGameState.AF1LeftMapLeftMap ? "YES" : "NO"

  const csfVPs = GlobalGameState.CSFLeftMap ? 1 : 0
  const af1VPs = GlobalGameState.AF1LeftMap ? 1 : 0

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

  // GlobalGameState.winner = ""
  if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 7) {
    GlobalGameState.winner = controller.victoryCheck()
  } else {
    controller.calculateVPs()
  }

  let vmsg = ""

  if (GlobalGameState.gameTurn === 3) {
    vmsg = "Automatic Victory"
  }

  if (GlobalGameState.gameTurn === 7) {
    vmsg = "Result - winner is: "
  }

  const gameTurn3Winner = GlobalGameState.gameTurn === 3 && GlobalGameState.winner !== ""
  let imageUS = "/images/usaflag.jpg"
  let imageJP = "/images/japanflag.jpg"
  const gameContinuesMsg =
    GlobalGameState.gameTurn === 3 && GlobalGameState.winner === "" ? "Neither Side has Achieved Victory" : ""
    return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "33%",
          }}
        >
          <div
            style={{
              color: "white",
              marginLeft: "10px",
              fontSize: "24px",
            }}
          >
            VICTORY POINTS
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "-100px",
              marginTop: "30px",
            }}
          >
            <img src={imageUS} alt="test" width="80px" height="60px" />
          </div>
          {!gameTurn3Winner && (
            <div
              style={{
                marginLeft: "20px",
              }}
            >
              <p
                style={{
                  color: "white",
                  marginTop: "5px",
                  fontSize: "54px",
                }}
              >
                &emsp;<strong>{GlobalGameState.usVPs}</strong>&emsp;
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            width: "33%",
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
                marginLeft: "2px",
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
                marginLeft: "-4px",
              }}
            >
              {japanCSFMsg}&emsp;
              {csfLeft}
              &emsp;&emsp;&emsp;&emsp;<strong>{csfVPs}</strong>
              <br></br>
            </p>
            <p
              style={{
                color: "white",
                marginTop: "5px",
                marginLeft: "-2px",
              }}
            >
              {us1AFMsg}&emsp;
              {af1Left}
              &emsp;&emsp;&emsp;&emsp;<strong>{af1VPs}</strong>
              <br></br>
            </p>

            <p
              style={{
                color: "white",
                marginTop: "5px",
              }}
            >
              {midwayControlMsg}  &nbsp;<strong>{midwayControl}</strong>&nbsp;&nbsp;<strong>    2</strong>&emsp;  <br></br>
            </p>
            <p
              style={{
                marginTop: "20px",
                color: "white",
              }}
            >
              {gameContinuesMsg}
            </p>

            {(gameTurn3Winner || GlobalGameState.gameTurn === 7) && (
              <p
                style={{
                  marginTop: "50px",
                  marginLeft: "-30px",
                  color: "white",
                }}
              >
                &emsp;
                <strong>
                  {vmsg}&nbsp;{GlobalGameState.winner}
                </strong>
                !!
              </p>
            )}

            {!GlobalGameState.winner && (
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
            )}
          </div>

          <div></div>
          <div></div>
        </div>
        <div
          style={{
            width: "33%",
          }}
        >
          <div
            style={{
              color: "white",
              marginLeft: "30px",
              fontSize: "24px",
            }}
          >
            VICTORY POINTS
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "-40px",
              marginTop: "30px",
            }}
          >
            <img src={imageJP} alt="test" width="80px" height="60px" />
          </div>
          {!gameTurn3Winner && (
            <div
              style={{
                marginLeft: "40px",
              }}
            >
              <p
                style={{
                  color: "white",
                  marginTop: "5px",
                  fontSize: "54px",
                }}
              >
                &emsp;<strong>{GlobalGameState.japanVPs}</strong>&emsp;
              </p>
            </div>
          )}
        </div>
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
