import React, { useState } from "react"
import "./button.css"

function OffMapFleetBox({ side, enabled }) {

  let pos = { left: "28.8%", top: "19%" }

  if (side === "US") {
    pos = { left: "63.8%", top: "20%" }
  }

  const [position, setPosition] = useState(pos)

  return (
    <>
      {enabled && (
        <div
          style={{
            background: "##1a66a1",
            color: "white",
            borderRadius: "2px",
            borderStyle: "solid",
            borderWidth: "1px",
            height: "40px",
            width: "200px",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "13px",
            paddingLeft: "5px",
            paddingRight: "5px",
            left: position.left,
            top: position.top,
            borderColor: "white",
            zIndex: 1
          }}
        >
          {/* <p style={{ fontSize: "12px" }}>off-map fleets</p> */}
          <p
              style={{
                marginTop: "-41px",
                marginLeft: "-10px",
                backgroundColor: "#104668",
                display: "block",
                width: "75px",
                fontSize: "9px",
              }}
            >
              Off-Map Fleet Box
            </p>
        </div>
      )}
    </>
  )
}

export default OffMapFleetBox
