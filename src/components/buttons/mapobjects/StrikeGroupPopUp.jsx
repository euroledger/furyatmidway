import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import "../../board.css"
import PopUpStrikeCounter from "./PopUpStrikeCounter"
import BaseUnit from "./BaseUnit"

function StrikeGroupPopUp({ strikeGroup, fleetUnits, popUpPosition, hex, side }) {
  let index = 0
  const fleetCounters = fleetUnits.map((fleetUnit) => {
    // let newFleetUnit = new BaseUnit(
    //   fleetUnit.name,
    //   fleetUnit.longName,
    //   {
    //     left: 3 + 30 * index,
    //     top: 30
    //   },
    //   { x: 50, y: 68 }, // offsets
    //   fleetUnit.image,
    //   fleetUnit.width
    // )
    let pos = {
      left: 3 + 30 * index,
      top: 30
    }
    index += 1
    return <PopUpStrikeCounter pos={pos} image={fleetUnit.image}></PopUpStrikeCounter>
  })
  const sgCounters = strikeGroup.map((strikeGroupUnit) => {
    // strikeGroupUnit.position.left = 3 + 30 * index
    // strikeGroupUnit.position.top = 30
    index += 1
    let pos = {
      left: -25 + 30 * index,
      top: 30
    }
    return <PopUpStrikeCounter pos={pos} image={strikeGroupUnit.image}></PopUpStrikeCounter>
  })
  const width = 40 + index * 30

  const wstr = `${width}px`
  const row = hex.currentHex.row
  const col = hex.currentHex.col

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
        width: wstr,
        height: "50px",
        background: "white",
        background: bg,
        borderRadius: "3px",
        color: "white",
        border: "1px solid white",
      }}
    >
      <p style={{ marginTop: "2px", marginLeft: "2px", fontSize: "8px" }}>{coords}</p>

      {fleetCounters}
      {sgCounters}
    </div>
  )
}

export default StrikeGroupPopUp
