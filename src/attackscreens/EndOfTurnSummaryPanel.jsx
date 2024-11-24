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

  let winner = "None"
  if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 7) {
    winner = controller.victoryCheck()
  }

  let vmsg = "Automatic Victory"

  if (GlobalGameState.gameTurn === 7) {
    vmsg = "Game Result - Winner:"
  }

  let imageUS = "/images/usaflag.jpg"
  let imageJP = "/images/japanflag.jpg"

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
              fontSize: "24px"

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
          <div style={{
            marginLeft: "20px"
          }}>
            <p
              style={{
                color: "white",
                marginTop: "5px",
                fontSize: "54px"
              }}
            >
              &emsp;<strong>{GlobalGameState.usVPs}</strong>&emsp;
            </p>
          </div>
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
            <p
              style={{
                marginTop: "20px",
                color: "white",
              }}
            >
              Japan VPs:&emsp;<strong>{GlobalGameState.japanVPs}</strong>&emsp;
            </p>
            <p
              style={{
                marginTop: "5px",
                color: "white",
              }}
            >
              US VPs:&emsp;<strong>{GlobalGameState.usVPs}</strong>&emsp;
            </p>
            {winner && (
              <p
                style={{
                  marginTop: "50px",

                  color: "white",
                }}
              >
                &emsp;
                <strong>
                  {vmsg}&nbsp;{winner}
                </strong>
                !!
              </p>
            )}
            {!winner && (
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
              fontSize: "24px"

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
          <div style={{
            marginLeft: "40px"
          }}>
            <p
              style={{
                color: "white",
                marginTop: "5px",
                fontSize: "54px"
              }}
            >
              &emsp;<strong>{GlobalGameState.japanVPs}</strong>&emsp;
            </p>
          </div>
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
