// this should be a state (box) flow model

import GlobalUnitsModel from "../model/GlobalUnitsModel"

// which determines valid moves for air units based on their current location (ie box)
export const VALID_DESTINATIONS = {
  carrier: "",
  box: "",
}
function getValidUSDestinations(controller, parentCarrier, side) {
  // For returning strikers, always return to carrier in same TF if possible, or other TF if not
  let destinationsArray = new Array()

  const thisTF = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInTF = controller.getAllCarriersInTaskForce(thisTF, side)

  for (const carrier of carriersInTF) {
    if (!controller.isSunk(carrier.name) && controller.isHangarAvailable(carrier.name)) {
      // this unit can go to its parent carrier hangar
      const validDestination = {
        carrier: carrier.name,
        box: "HANGAR",
      }
      destinationsArray.push(validDestination)
    }
  }
  if (destinationsArray.length === 0) {
    destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
  }

  return destinationsArray
}

function getValidJapanDestinations(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  if (controller.isSunk(parentCarrier)) {
    // console.log(parentCarrier, "sunk, try other carrier")
    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
  } else if (controller.isHangarAvailable(parentCarrier)) {
    // this unit can go to its parent carrier hangar
    const validDestination = {
      carrier: parentCarrier,
      box: "HANGAR",
    }
    destinationsArray.push(validDestination)
  } else {
    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
    if (destinationsArray.length === 0) {
      destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
    }
  }
  return destinationsArray
}
function tryOtherTaskForce(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  const taskForce = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInOtherTaskForce = controller.getCarriersInOtherTF(taskForce, side)
  for (const carrier of carriersInOtherTaskForce) {
    // console.log("----------> try", carrier.name)
    if (!controller.isSunk(carrier.name)) {
      if (controller.isHangarAvailable(carrier.name)) {
        // console.log("yes i can land on", carrier.name)
        const validDestination = {
          carrier: carrier.name,
          box: "HANGAR",
        }
        destinationsArray.push(validDestination)
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
    // this unit can go to its parent carrier hangar
    const validDestination = {
      carrier: otherCarrier.name,
      box: "HANGAR",
    }
    destinationsArray.push(validDestination)
  }
  return destinationsArray
}
export function doReturn1(controller, name, side) {
  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinations(controller, parentCarrier, side)
  } else {
    destinationsArray = getValidJapanDestinations(controller, parentCarrier, side)
  }
  controller.setValidAirUnitDestinations(name, destinationsArray)

  if (destinationsArray.length === 0) {
    // no available carrier - unit elimintated
    controller.setAirUnitEliminated(name, side)
  }
}
export function handleAirUnitMoves(controller, side) {
  // 1. loop through all air units for this side
  const airUnits = controller.getAllAirUnits(side)

  // 2. for each air unit get the location

  // 3. use the following logic to work out what that unit can do
  for (let unit of airUnits) {
    const location = controller.getAirUnitLocation(unit.name)
    if (location.boxName.includes("RETURNING (1)")) {
      doReturn1(controller, unit.name, side)
    }
  }
}
