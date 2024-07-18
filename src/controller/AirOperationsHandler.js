// this should be a state (box) flow model

import GlobalUnitsModel from "../model/GlobalUnitsModel"

// which determines valid moves for air units based on their current location (ie box)
export const VALID_DESTINATIONS = {
  carrier: "",
  box: "",
}
function getValidUSDestinations(controller, parentCarrier, side, useMidway) {
  // For returning strikers, always return to carrier in same TF if possible, or other TF if not
  let destinationsArray = new Array()
  const thisTF = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInTF = controller.getAllCarriersInTaskForce(thisTF, side)

  for (const carrier of carriersInTF) {
    if (!controller.isSunk(carrier.name) && controller.isHangarAvailable(carrier.name)) {
      // this unit can go to its parent carrier hangar
      const box = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
      destinationsArray.push(box)
    }
  }
  if (destinationsArray.length === 0 && parentCarrier !== "Midway") {
    destinationsArray = tryOtherTaskForce(controller, parentCarrier, side, useMidway)
  }

  return destinationsArray
}

function getValidJapanDestinations(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  if (controller.isSunk(parentCarrier)) {
    // console.log(parentCarrier, "sunk, try other carrier")
    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
  } else if (controller.isHangarAvailable(parentCarrier)) {
    const box = controller.getAirBoxForNamedShip(side, parentCarrier, "HANGAR")
    destinationsArray.push(box)
  } else {
    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
    if (destinationsArray.length === 0) {
      destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
    }
  }
  return destinationsArray
}
function tryOtherTaskForce(controller, parentCarrier, side, useMidway) {
  let destinationsArray = new Array()
  const taskForce = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInOtherTaskForce = controller.getCarriersInOtherTF(taskForce, side)
  if (useMidway) {
    // add Midway base to carriers
    carriersInOtherTaskForce.push(GlobalUnitsModel.usFleetUnits.get(GlobalUnitsModel.Carrier.MIDWAY))
  }
  for (const carrier of carriersInOtherTaskForce) {
    // console.log("----------> try", carrier.name)
    if (!controller.isSunk(carrier.name)) {
      if (controller.isHangarAvailable(carrier.name)) {
        const box = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

        destinationsArray.push(box)
      }
      // else {
      //   console.log("NO room on carrier", carrier.name)
      // }
    }
  }
  return destinationsArray
}
function tryOtherCarrier(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  const otherCarrier = controller.getOtherCarrierInTF(parentCarrier, side)
  if (!otherCarrier) {
    return destinationsArray // empty list, eg TF 17 has no other carrier
  }
  if (controller.isSunk(otherCarrier.name)) {
    // otherwise...try carriers in other task force
    // if no options -> unit is eliminated
    // console.log(otherCarrier.name,"sunk, try other task force")
    destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
  } else if (controller.isHangarAvailable(otherCarrier.name)) {
    const box = controller.getAirBoxForNamedShip(side, otherCarrier.name, "HANGAR")
    destinationsArray.push(box)
  }
  return destinationsArray
}
export function doReturn1(controller, name, side, useMidway) {
  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinations(controller, parentCarrier, side, useMidway)
  } else {
    destinationsArray = getValidJapanDestinations(controller, parentCarrier, side)
  }
  controller.setValidAirUnitDestinations(name, destinationsArray)

  if (destinationsArray.length === 0) {
    // no available carrier - unit elimintated
    controller.setAirUnitEliminated(name, side)
  }
  return destinationsArray
}

export function doReturn2(controller, name, side) {
  const parentCarrier = controller.getCarrierForAirUnit(name)
  const tf = controller.getTaskForceForCarrier(parentCarrier, side)
  const destBox = controller.getReturn2AirBoxForNamedTaskForce(side, tf)

  const boxArray = new Array()
  if (destBox) {
    boxArray.push(destBox)
    controller.setValidAirUnitDestinations(name, boxArray)
  }
}

export function getStep1Fighters(airUnits) {
  return airUnits.filter((unit) => unit.aircraftUnit.steps === 1 && unit.aircraftUnit.attack === false)
}

export function getStep1DiveBombers(airUnits) {
  return airUnits.filter(
    (unit) =>
      unit.aircraftUnit.steps === 1 && unit.aircraftUnit.attack === true && unit.aircraftUnit.diveBomber === true
  )
}

export function getStep1TorpedoPlanes(airUnits) {
  return airUnits.filter(
    (unit) =>
      unit.aircraftUnit.steps === 1 && unit.aircraftUnit.attack === true && unit.aircraftUnit.diveBomber === false
  )
}

function checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto) {
  if (step1Fighters.length >= 2) {
    if (!auto) {
      return step1Fighters
    } else {
      // Midway fighters and dive bombers have different strength ratings, always eliminate
      // unit with lower strength first
      if (step1Fighters[0].aircraftUnit.strength <= step1Fighters[1].aircraftUnit.strength) {
        step1Fighters[0].aircraftUnit.steps = 0 // elim first unit
        step1Fighters[1].aircraftUnit.steps = 2
      } else {
        step1Fighters[0].aircraftUnit.steps = 2
        step1Fighters[1].aircraftUnit.steps = 0
      }
    }
  } else if (step1DiveBombers.length >= 2) {
    if (!auto) {
      return step1DiveBombers
    } else {
      if (step1DiveBombers[0].aircraftUnit.strength <= step1DiveBombers[1].aircraftUnit.strength) {
        step1DiveBombers[0].aircraftUnit.steps = 0 // elim first unit
        step1DiveBombers[1].aircraftUnit.steps = 2
      } else {
        step1DiveBombers[0].aircraftUnit.steps = 2
        step1DiveBombers[1].aircraftUnit.steps = 0
      }
    }
  } else {
    if (!auto) {
      return step1TorpedoPlanes
    } else {
      if (step1TorpedoPlanes[0].aircraftUnit.strength <= step1TorpedoPlanes[1].aircraftUnit.strength) {
        step1TorpedoPlanes[0].aircraftUnit.steps = 0 // elim first unit
        step1TorpedoPlanes[1].aircraftUnit.steps = 2
      } else {
        step1TorpedoPlanes[0].aircraftUnit.steps = 2
        step1TorpedoPlanes[1].aircraftUnit.steps = 0
      }
    }
  }
  return null
}
// toBox is the destination box, hangar for returning strike, flight deck for returning CAP
// auto - if true automatically reorganise, false return object with reorg possibilities (for UI)
export function checkForReorganization(controller, fromBox, toBox, auto) {
  // 1. For a given box get all the air units in this box
  const airUnits = controller.getAllAirUnitsInBox(fromBox)

  // 2. Check to see if there are any 1 step units of the same type
  let step1Fighters = getStep1Fighters(airUnits)
  let step1DiveBombers = getStep1DiveBombers(airUnits)
  let step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)

  // 3. if any type has 2 or more units - reorganise these units
  if (step1Fighters.length >= 2 || step1DiveBombers.length >= 2 || step1TorpedoPlanes.length >= 2) {
    return checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto)
  }

  // 4. check to see if a reorg can be done in the toBox, then across boxeas
  if (!toBox) {
    return null
  }
  const airUnitsToBox = controller.getAllAirUnitsInBox(toBox)
  let step1FightersToBox = getStep1Fighters(airUnitsToBox)
  let step1DiveBombersToBox = getStep1DiveBombers(airUnitsToBox)
  let step1TorpedoPlanesToBox = getStep1TorpedoPlanes(airUnitsToBox)

  if (step1FightersToBox.length >= 2 || step1DiveBombersToBox.length >= 2 || step1TorpedoPlanesToBox.length >= 2) {
    return checkPlanesInBox(step1FightersToBox, step1DiveBombersToBox, step1TorpedoPlanesToBox, auto)
  }

  // 5. If there are 2 or more units across the from and to boxes - reorganise across
  // the boxes, note always eliminate the unit in the to Box so that creates space
  // for incoming unit
  step1Fighters = step1Fighters.concat(step1FightersToBox)
  step1DiveBombers = step1DiveBombers.concat(step1DiveBombersToBox)
  step1TorpedoPlanes = step1TorpedoPlanes.concat(step1TorpedoPlanesToBox)
  if (step1Fighters.length >= 2 || step1DiveBombers.length >= 2 || step1TorpedoPlanes.length >= 2) {
    return checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto)
  }
  return null
}

export function handleAirUnitMoves(controller, side) {
  // 1. loop through all air units for this side
  const airUnits = controller.getAllAirUnits(side)

  // 2. for each air unit get the location

  // 3. use the following logic to work out what that unit can do
  for (let unit of airUnits) {
    const location = controller.getAirUnitLocation(unit.name)
    if (location.boxName.includes("RETURNING (1)")) {
      // see if US CSF within two hexes of Midway
      let hexesBetweenMidwayAndCSF = controller.numHexesBetweenFleets(
        { name: "MIDWAY", side: GlobalUnitsModel.Side.US },
        { name: "CSF", side: GlobalUnitsModel.Side.US }
      )
      const useMidway = hexesBetweenMidwayAndCSF <= 2
      const destinations = doReturn1(controller, unit.name, side, useMidway)
      if (destinations.length === 0) {
        // check for possible reorganisation
        checkForReorganization(controller, location.boxName, side)
      }
    }
    if (location.boxName.includes("RETURNING (2)")) {
      doReturn2(controller, unit.name, side)
    }
  }
}
