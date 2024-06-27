import GlobalUnitsModel from "./GlobalUnitsModel"

export function calculateSearchValues(controller) {
  const distanceToClosestFleet1AF = controller.closestEnemyFleet({ name: "1AF", side: GlobalUnitsModel.Side.JAPAN })
  const distanceToClosestFleetCSF = controller.closestEnemyFleet({ name: "CSF", side: GlobalUnitsModel.Side.US })
  const distanceToClosestFleetMidway = controller.closestEnemyFleet({ name: "MIDWAY", side: GlobalUnitsModel.Side.US })

  return {
    jp_af: distanceToClosestFleet1AF,
    us_csf: distanceToClosestFleetCSF,
    us_midway: distanceToClosestFleetMidway,
  }
}

export function calculateSearchResults(controller, distances) {
  const results = controller.calcSearchResults(distances)
  return results
}
