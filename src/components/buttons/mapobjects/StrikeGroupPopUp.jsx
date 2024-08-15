import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import "../../board.css"
import PopUpStrikeCounter from "./PopUpStrikeCounter"

function StrikeGroupPopUp({ strikeGroup, popUpPosition, hex, side }) {
  const width =  strikeGroup.length * 50 
  const sgCounters = strikeGroup.map((strikeGroupUnit, index) => {
    strikeGroupUnit.position.left = 3 + (30 * index)
    strikeGroupUnit.position.top = 30
    return <PopUpStrikeCounter counterData={strikeGroupUnit}></PopUpStrikeCounter>
  })

  const row=hex.currentHex.row
  const col=hex.currentHex.col

  const sideStr = side === GlobalUnitsModel.Side.US ? "USN" : "IJN"
  const coords = `${sideStr} - Hex ${row}${col}`
  
  const leftOffset = side === GlobalUnitsModel.Side.US ? 600 : 170
  const topOffset = side === GlobalUnitsModel.Side.US ? 150 : 130

  const bg = side === GlobalUnitsModel.Side.US ? "rgba(92, 131, 228, 0.8)" : "rgba(228, 92, 92, 0.8)"
  return (
    <div
      style={{
        position: "absolute",
        left: popUpPosition.x + leftOffset,
        top: popUpPosition.y + topOffset,
        zIndex: 100,
        width: "150px",
        height: "50px",
        background: "white",
        background: bg,
        borderRadius: "3px",
        color: "white",
        border: "1px solid white",
      }}
    >
      <p style={{ marginTop: "2px", marginLeft: "2px", fontSize: "8px" }}>{coords}</p>

      {sgCounters}
    </div>
  )
}

export default StrikeGroupPopUp
