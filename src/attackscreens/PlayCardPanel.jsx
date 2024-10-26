import { React } from "react"
import "./cap.css"
import { EventCardFooter } from "./EventCardFooters"

export function CardAlertHeaders({ cardNumber, showCardFooter }) {
  
  if (cardNumber === 0) {
    return
  }
  let msg=showCardFooter ? "" : "Do you wish to play this card?"

  let cardStr = "" + cardNumber
  if (cardNumber < 10) {
    cardStr = "0" + cardNumber
  }
  const cardImage = `/images/cards/MID_Card${cardStr}.gif`
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
          <img
            src={cardImage}
            style={{
              width: "180px",
              height: "250px",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          ></img>
          <div>
            <p>{msg}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export function CardAlertFooters({ cardNumber, showCardFooter, setShowDice }) {
  return (
    <EventCardFooter
      cardNumber={cardNumber}
      showCardFooter={showCardFooter}
      setShowDice={setShowDice}
    ></EventCardFooter>
  )
}
