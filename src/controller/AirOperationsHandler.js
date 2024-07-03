// this should be a state (box) flow model

import GlobalUnitsModel from "../model/GlobalUnitsModel"

// which determines valid moves for air units based on their current location (ie box)
export const VALID_DESTINATIONS = {
  carrier: "",
  box: "",
}
function getValidUSDestinations(controller, name) {
  // iterate over US carriers, check for flight deck damage, capacity



}
function doReturn1(controller, name, side) {
  // console.log("AIR UNIT ", name, " WANTS TO GO TO HANGAR..!")

  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  const flightDeckDamaged = controller.isFlightDeckDamaged(parentCarrier, side)
  const currentLoad = controller.numUnitsOnCarrier(parentCarrier, side)

  // console.log("\t => parent carrier = ", parentCarrier)
  // console.log("\t => flight deck damaged = ", flightDeckDamaged)
  // console.log("\t => currentLoad = ", currentLoad)

  // for US (only) any carrier in the TF or other TF (or Midway) is also valid
  // add to destinations...basically any undamaged carrier with capacity (Midway must be in range)

  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinations()
  } else {
    if (!flightDeckDamaged && currentLoad < 5) {
      // this unit can go to its parent carrier hangar
      const validDestination = {
        carrier: parentCarrier,
        box: "HANGAR",
      }
      destinationsArray.push(validDestination)
    } else {
      // Also if carrier is sunk..
      if (pcarrier.isSunk) {
        // get other carrier in task force if any
      }

      // Try other carrier in same CarDiv

      // Try carriers in other CarDiv

      // if no options -> unit is eliminated
    }
  }
  controller.setValidAirUnitDestinations(name, destinationsArray)
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
