import "../../board.css"
import PopUpStrikeCounter from "./PopUpStrikeCounter"

function StrikeGroupPopUp({ strikeGroup, popUpPosition, hex }) {
  const width =  strikeGroup.length * 50 
  const sgCounters = strikeGroup.map((strikeGroupUnit, index) => {
    strikeGroupUnit.position.left = 3 + (30 * index)
    strikeGroupUnit.position.top = 30
    return <PopUpStrikeCounter counterData={strikeGroupUnit}></PopUpStrikeCounter>
  })

  const row=hex.currentHex.row
  const col=hex.currentHex.col

  const coords = `USN - Hex ${row}${col}`
  return (
    <div
      style={{
        position: "absolute",
        left: popUpPosition.x + 600,
        top: popUpPosition.y + 150,
        zIndex: 100,
        width: "150px",
        height: "50px",
        background: "white",
        borderRadius: "4px",
        border: "3px solid #060000",
      }}
    >
      <p style={{ marginTop: "2px", marginLeft: "2px", fontSize: "8px" }}>{coords}</p>

      {sgCounters}
    </div>
  )
}

export default StrikeGroupPopUp
