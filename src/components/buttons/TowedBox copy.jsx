import { useEffect, useContext, useState } from "react"
import "./button.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App"
import GlobalInit from "../../model/GlobalInit"
import GlobalGameState from "../../model/GlobalGameState"

function TowedBox() {
  const { towedCVSelected } = useContext(BoardContext)
  let pos

  switch (towedCVSelected) {
    case GlobalUnitsModel.Carrier.ENTERPRISE:
      pos = { left: "54.8%", top: "75%" }
      break
    case GlobalUnitsModel.Carrier.HORNET:
      pos = { left: "61.2%", top: "75%" }
      break
    case GlobalUnitsModel.Carrier.YORKTOWN:
      pos = { left: "76.9%", top: "75%" }
      break
    default:
      pos = { left: -1000, top: -1000 }
  }
  const [position, setPosition] = useState(pos)

  useEffect(() => {
    setPosition({
      left: pos.left,
      top: pos.top,
    })
  }, [towedCVSelected])

  let hide = false
  let carrier = GlobalInit.controller.getCarrier(towedCVSelected)
  if (carrier !== undefined) {
    hide = carrier.side === GlobalUnitsModel.Side.US && GlobalGameState.hideCounters
  }

  hide = false
  return (
    <>
      {!hide &
      (
        <div
          style={{
            background: "#cc0000",
            // background: "red",

            color: "white",
            borderRadius: "40px",
            borderStyle: "solid",
            borderWidth: "1px",
            height: "25px",
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
          }}
        >
          <p style={{ fontSize: "12px" }}>towed</p>
        </div>
      )}
    </>
  )
}

export default TowedBox
