import { React } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"

export function TroubledReconnaissanceHeader() {
  const cardImage = `/images/cards/MID_Card07.gif`

  return (
    <div   style={{
        display: "flex",
      
      }}>
      <div>
        <img
          src={cardImage}
          style={{
            width: "90px",
            height: "120px",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        ></img>
      </div>
      <p
        style={{
          display: "flex",
          marginLeft: "50px",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Roll the die. Result is the Japanese Search Value for the turn.
        <br></br>
        (Negates Card #6 "High Speed Reconnaissance")
      </p>
    </div>
  )
}

export function TroubledReconnaissanceFooter() {
  const show = GlobalGameState.dieRolls.length > 0

  let msg = "Japanese Search Value set to"
  return (
    <>
      {show && (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginLeft: "-40px",
          }}
        >
          {msg} &nbsp;<strong>{GlobalGameState.SearchValue.JP_AF}</strong>&nbsp;
        </p>
      )}
    </>
  )
}
