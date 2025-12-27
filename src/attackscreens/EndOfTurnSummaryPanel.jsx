import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalUIConstants from "../components/UIConstants"

export function EndOfTurnSummaryHeaders({ controller, sidebg }) {
  const japanCVMsg = "IJN CVs Sunk (1 VP each):"
  const usCVMsg = "US CVs Sunk (1 VP each):"
  const midwayControlMsg = "Midway Control:"

  const japanCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.JAPAN)
  const usCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US)

  const numJapanCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.JAPAN).length
  const numUSCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US).length

  const japanCSFMsg = "CSF Left Map:"
  const us1AFMsg = "1AF Left Map:"

  const csfLeft = GlobalGameState.CSFLeftMap ? "YES" : "NO"
  const af1Left = GlobalGameState.AF1LeftMap ? "YES" : "NO"

  const csfVPs = GlobalGameState.CSFLeftMap ? 1 : 0
  const af1VPs = GlobalGameState.AF1LeftMap ? 1 : 0

  let sidey = sidebg
  if (!sidebg) {
    sidey = GlobalUIConstants.Colors.JAPAN
  }
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
  const bg = GlobalGameState.gameTurn === 4 ? "black" : sidey

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

  const midwayControl = GlobalGameState.midwayControl === GlobalUnitsModel.Side.US ? "US" : "IJN"

  GlobalGameState.winner = ""
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
            // style={{
            //   marginLeft: "0px",
            // }}
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
            display: "grid",
            gridTemplateColumns: "1fr auto",
            columnGap: "48px", // more horizontal space between label and number
            rowGap: "8px", // keep vertical spacing tidy
            color: "white",
          }}
        >
          {/* Japan CVs */}
          <div>
            <div>{japanCVMsg}</div>
            {japanCVsSunkMsg && (
              <div>
                <strong>{japanCVsSunkMsg}</strong>
              </div>
            )}
          </div>
          <div>
            <strong>{numJapanCVsSunk}</strong>
          </div>

          {/* US CVs */}
          <div>
            <div>{usCVMsg}</div>
            {usCVsSunkMsg && (
              <div>
                <strong>{usCVsSunkMsg}</strong>
              </div>
            )}
          </div>
          <div>
            <strong>{numUSCVsSunk}</strong>
          </div>

          {/* CSF Left Map */}
          <div>
            {japanCSFMsg} {csfLeft}
          </div>
          <div>
            <strong>{csfVPs}</strong>
          </div>

          {/* 1AF Left Map */}
          <div>
            {us1AFMsg} {af1Left}
          </div>
          <div>
            <strong>{af1VPs}</strong>
          </div>

          {/* Midway Control */}
          <div>
            {midwayControlMsg} <strong>{midwayControl}</strong>
          </div>
          <div>
            <strong>2</strong>
          </div>
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
                marginLeft: "30px",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {(gameTurn3Winner || GlobalGameState.gameTurn === 7) && (
          <p
            style={{
              marginTop: "50px",
              marginLeft: "-16px",
              color: "white",
              fontSize: "18px",
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              color: "white",
            }}
          >
            {gameContinuesMsg && <p style={{ marginBottom: "10px" }}>{gameContinuesMsg}</p>}

            <p style={{ marginTop: "10px" }}>Click "Close" to begin next turn...</p>
          </div>
        )}
      </div>
    </>
  )
}

export function EndOfTurnSummaryFooters({ eliminatedSteps, capAirUnits }) {}
