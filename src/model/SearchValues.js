import GlobalUnitsModel from "./GlobalUnitsModel"

export function calculateSearchValues(controller) {
  let distanceToClosestFleet1AF = controller.closestEnemyFleet({ name: "1AF", side: GlobalUnitsModel.Side.JAPAN })
  let distanceToClosestFleetCSF = controller.closestEnemyFleet({ name: "CSF", side: GlobalUnitsModel.Side.US })
  let distanceToClosestFleetMidway = controller.closestEnemyFleet({ name: "MIDWAY", side: GlobalUnitsModel.Side.US })

  if (distanceToClosestFleetCSF === undefined) {
    distanceToClosestFleetCSF = 100
  }
  if (distanceToClosestFleet1AF === undefined) {
    distanceToClosestFleet1AF = 100
  }
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
