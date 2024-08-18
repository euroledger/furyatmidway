import React, { useState } from "react"
import "../../board.css"
import "./counter.css"

function PopUpStrikeCounter({ counterData }) {
  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
  })

  return (
    <>
      <div>
        <input
          type="image"
          src={counterData.image}
          style={{
            position: "absolute",
            width: 27,
            height: 27,
            left: position.left,
            top: position.top,
            zIndex: 101,
            marginLeft: "5px",
            marginTop: "-15px"
          }}
          id="popupcounter"
        />
      </div>
    </>
  )
}

export default PopUpStrikeCounter
