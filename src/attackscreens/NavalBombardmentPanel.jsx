import { React } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"

export function NavalBombardmentHeader() {
  const cardImage = `/images/cards/MID_Card05.gif`

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
        Roll the die. Midway Garrison reduced by die roll / 2 (rounded down)
      </p>
    </div>
  )
}

export function NavalBombardmentFooter() {
  const show = GlobalGameState.dieRolls.length > 0

  let msg = "Midway Garrison Reduced to"
  if (GlobalGameState.dieRolls[0] === 1) {
    "No Change to Midway Garrison Level; Stays at"
  }
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
          {msg} &nbsp;<strong>{GlobalGameState.midwayGarrisonLevel}</strong>&nbsp;
        </p>
      )}
    </>
  )
}
