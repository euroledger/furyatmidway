import { flatHexToPixel, convertCoords } from "../src/components/HexUtils"
import HexCommand from "../src/commands/HexCommand"
import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"


export const createFleetMove = (controller, q, r, name, side) => {
  let hex = {
    q: q,
    r: r,
  }

  let { x, y } = flatHexToPixel({ q: hex.q, r: hex.r })

  // 2. set row and col from this q, r update
  const { q1, r1 } = convertCoords(hex.q, hex.r)

  let to = {
    currentHex: {
      q: hex.q,
      r: hex.r,
      x: x,
      y: y,
      row: q1,
      col: r1,
    },
  }

  let from = HexCommand.OFFBOARD

  // fire view event to update map
  controller.viewEventHandler({
    type: Controller.EventTypes.FLEET_SETUP,
    data: {
      initial: true,
      id: name,
      from,
      to,
      side,
    },
  })
}
