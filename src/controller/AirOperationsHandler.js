// this should be a state (box) flow model

import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

function getValidUSDestinationsRETURN1(controller, parentCarrier, side, useMidway) {
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
export function getValidUSDestinationsCAP(controller, parentCarrier, side) {
  // This is returning CAP, must always go to same TF
  // and we check flight deck not hangar
  let destinationsArray = new Array()
  const thisTF = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInTF = controller.getAllCarriersInTaskForce(thisTF, side)

  for (const carrier of carriersInTF) {
    const boxName = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

    const destAvailable = controller.isFlightDeckAvailable(carrier.name, side)

    // console.log(carrier.name, "-> destAvailable = ", destAvailable)
    if (!controller.isSunk(carrier.name) && destAvailable) {
      // this unit can go to its parent carrier flight deck

      // console.log("PUSH 1", boxName)
      destinationsArray.push(boxName)
    } else if (controller.isSunk(carrier.name)) {
      continue
    }
    // As this is CAP -> can go to hangar instead
    // if carrier not at capacity
    if (controller.isHangarAvailable(carrier.name)) {
      const capHangar = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
      // console.log("PUSH 2", capHangar)

      destinationsArray.push(capHangar)
    }
  }
  // Never try other task force
  return destinationsArray
}

function getValidJapanDestinationsRETURN1(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  if (controller.isSunk(parentCarrier)) {
    // console.log(parentCarrier, "sunk, try other carrier")
    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
  } else if (controller.isHangarAvailable(parentCarrier)) {
    // console.log(parentCarrier, " => Hangar avaiable")

    const box = controller.getAirBoxForNamedShip(side, parentCarrier, "HANGAR")
    destinationsArray.push(box)
  } else {
    // console.log(parentCarrier, "=> Hangar NOT avaiable")

    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
    if (destinationsArray.length === 0) {
      destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
    }
  }
  return destinationsArray
}

export function getValidJapanDestinationsCAP(controller, parentCarrier, side) {
  let destinationsArray = new Array()

  const boxName = controller.getAirBoxForNamedShip(side, parentCarrier, "FLIGHT_DECK")
  const destAvailable = controller.isFlightDeckAvailable(parentCarrier, side)

  if (!controller.isSunk(parentCarrier) && destAvailable) {
    // console.log(parentCarrier, " => Flight Deck avaiable")
    destinationsArray.push(boxName)
  }

  if (controller.getCarrierHits(parentCarrier) < 2 && controller.isHangarAvailable(parentCarrier)) {
    // console.log(parentCarrier, " => Hangar available")

    const capHangar = controller.getAirBoxForNamedShip(side, parentCarrier, "HANGAR")
    destinationsArray.push(capHangar)
    return destinationsArray
  }
  destinationsArray = destinationsArray.concat(tryOtherCarrierCAP(controller, parentCarrier, side))
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
function tryOtherCarrier(controller, parentCarrier, side, cap) {
  let destinationsArray = new Array()
  const otherCarrier = controller.getOtherCarrierInTF(parentCarrier, side)
  if (!otherCarrier) {
    return destinationsArray // empty list, eg TF 17 has no other carrier
  }
  const destAvailable = !cap
    ? controller.isHangarAvailable(otherCarrier.name)
    : controller.isFlightDeckDamaged(otherCarrier.name)

  if (controller.isSunk(otherCarrier.name)) {
    // otherwise...try carriers in other task force
    // if no options -> unit is eliminated
    // console.log(otherCarrier.name,"sunk, try other task force")
    destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
  } else if (destAvailable) {
    const boxName = !cap ? "HANGAR" : "FLIGHT_DECK"
    const box = controller.getAirBoxForNamedShip(side, otherCarrier.name, boxName)
    destinationsArray.push(box)
  }
  return destinationsArray
}
function tryOtherCarrierCAP(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  const otherCarrier = controller.getOtherCarrierInTF(parentCarrier, side)
  if (!otherCarrier) {
    return destinationsArray // empty list, eg TF 17 has no other carrier
  }
  const destAvailable = controller.isFlightDeckAvailable(otherCarrier.name, side)
  if (destAvailable) {
    const box = controller.getAirBoxForNamedShip(side, otherCarrier.name, "FLIGHT_DECK")
    destinationsArray.push(box)
  }
  if (controller.isHangarAvailable(otherCarrier.name)) {
    const capHangar = controller.getAirBoxForNamedShip(side, otherCarrier.name, "HANGAR")
    destinationsArray.push(capHangar)
  }
  return destinationsArray
}
export function doReturn1(controller, name, side, useMidway) {
  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinationsRETURN1(controller, parentCarrier, side, useMidway)
  } else {
    destinationsArray = getValidJapanDestinationsRETURN1(controller, parentCarrier, side)
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
  const destBox = controller.getReturn1AirBoxForNamedTaskForce(side, tf)

  const boxArray = new Array()
  if (destBox) {
    boxArray.push(destBox)
    controller.setValidAirUnitDestinations(name, boxArray)
  }
}
export function doStrikeBox(controller, name) {
  // For now
  // Once a unit has moved into the strike box
  // disallow further moves
  controller.setValidAirUnitDestinations(name, new Array())

  // @TODO once strike has finished, set possible return boxes as destinations
}

export function doFlightDeck(controller, name, side) {
  // Air Units on the Flight Deck can go to
  const carrierName = controller.getCarrierForAirUnit(name)

  let destinationsArray = new Array()

  const unit = controller.getAirUnitForName(name)

  //  i) CAP Box (if fighter)
  if (!unit.aircraftUnit.attack) {
    const capBox = controller.getCapBoxForNamedCarrier(carrierName, side)
    destinationsArray.push(capBox)
  }
  //  ii) Strike Box
  // Note For US air units, we will need to filter out any strike boxes 
  // containing air units from other carriers
  const strikeBoxes = controller.getStrikeBoxes(name, side)
  destinationsArray = destinationsArray.concat(strikeBoxes)
  
  //  iii) Hangar
  const hangarBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")
  destinationsArray.push(hangarBox)

  controller.setValidAirUnitDestinations(name, destinationsArray)
}

export function doHangar(controller, name, side) {
  const parentCarrier = controller.getCarrierForAirUnit(name)
  const destBox = controller.getAirBoxForNamedShip(side, parentCarrier, "FLIGHT_DECK")

  // check there is room on this carrier's flight deck
  const destAvailable = controller.isFlightDeckAvailable(parentCarrier, side)

  if (!destAvailable) {
    return
  }
  const boxArray = new Array()
  if (destBox) {
    boxArray.push(destBox)
    controller.setValidAirUnitDestinations(name, boxArray)
  }
}

export function doCapReturn(controller, name, side) {
  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinationsCAP(controller, parentCarrier, side)
  } else {
    destinationsArray = getValidJapanDestinationsCAP(controller, parentCarrier, side)
  }
  controller.setValidAirUnitDestinations(name, destinationsArray)

  if (destinationsArray.length === 0) {
    // no available carrier - unit elimintated
    controller.setAirUnitEliminated(name, side)
  }
  return destinationsArray
}

// CAP -> CAP RETURN occurs after CAP has intercepted a Strike Group
export function doCap(controller, name, side) {
  if (!GlobalGameState.airAttacksComplete) {
    controller.setValidAirUnitDestinations(name, new Array())
    return
  }
  const parentCarrier = controller.getCarrierForAirUnit(name)
  const tf = controller.getTaskForceForCarrier(parentCarrier, side)
  const destBox = controller.getCapReturnAirBoxForNamedTaskForce(side, tf)
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

function isMidwayBox(box) {
  return box.includes("MIDWAY".toUpperCase())
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

  // 4. check to see if a reorg can be done in the toBox, then across boxes
  // Can never reorganize across Midway -> Carrier (since this is never a landing option)
  // But carrier -> Midway is allowed
  if (!toBox || (isMidwayBox(fromBox) && !isMidwayBox(toBox))) {
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
  step1Fighters = step1FightersToBox.concat(step1Fighters)

  step1DiveBombers = step1DiveBombersToBox.concat(step1DiveBombers)
  step1TorpedoPlanes = step1TorpedoPlanesToBox.concat(step1TorpedoPlanes)
  if (step1Fighters.length >= 2 || step1DiveBombers.length >= 2 || step1TorpedoPlanes.length >= 2) {
    const ret = checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto)
    return ret
  }
  return null
}

function mergeUnique(arr1, arr2) {
  if (arr1 === null) {
    return arr2
  }
  if (arr2 === null) {
    return arr1
  }
  let newArray = arr1

  for (let item of arr2) {
    if (!newArray.includes(item)) {
      newArray.push(item)
    }
  }
  return newArray
}

export function checkAllJapanBoxesForReorganizationCAP(controller, unit, fromBox, side, auto) {
  let carrierName = unit.carrier
  let toBox = controller.getAirBoxForNamedShip(side, carrierName, "FLIGHT_DECK")

  let reorgUnits = new Array()

  // check reorg within CAP RETURN box
  let reorgUnitsCAP = checkForReorganization(controller, fromBox, null, auto)

  if (reorgUnitsCAP) {
    reorgUnits = reorgUnitsCAP
  }

  const hits = controller.getCarrierHits(carrierName)
  // check reorg across boxes
  // 1. Same Carrier Flight Deck
  let reorgUnitsFD = checkForReorganization(controller, fromBox, toBox, auto)
  if (reorgUnitsFD) {
    reorgUnits = mergeUnique(reorgUnits, reorgUnitsFD)
  }

  // 2. Same Carrier Hangar
  toBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")
  let reorgUnitsHangar = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnitsHangar) {
    reorgUnits = mergeUnique(reorgUnits, reorgUnitsHangar)
  }

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (hits < 2) {
        return // Japan air unit must use its own carrier if possible (ie undamaged)
      }
    }
  }
  // 3. Other Carrier in Same Task Force Flight Deck
  let carrier = controller.getOtherCarrierInTF(carrierName, side)
  if (!carrier) {
    return
  }
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

  let reorgUnitsOtherFD = checkForReorganization(controller, fromBox, toBox, auto)
  if (reorgUnitsOtherFD) {
    reorgUnits = mergeUnique(reorgUnits, reorgUnitsOtherFD)
  }
  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
  }

  // 4. Other Carrier in Same Task Force Hangar
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

  let reorgUnits3 = checkForReorganization(controller, fromBox, toBox, auto)
  reorgUnits = mergeUnique(reorgUnits, reorgUnits3)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
  }
  return null
}

export function checkAllUSBoxesForReorganizationCAP(controller, unit, fromBox, side, auto) {
  let carrierName = unit.carrier

  // check reorg within CAP RETURN box
  let reorgUnits = checkForReorganization(controller, fromBox, null, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return
  }

  // 1. Same + Other Carrier Flight Deck

  const thisTF = controller.getTaskForceForCarrier(carrierName, side)
  const carriersInTF = controller.getAllCarriersInTaskForce(thisTF, side)

  let reorgUnitsArray = new Array()

  for (const carrier of carriersInTF) {
    const toBox = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

    reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)
    if (reorgUnits) {
      reorgUnitsArray = mergeUnique(reorgUnitsArray, reorgUnits)
    }
  }
  if (reorgUnitsArray.length > 0) {
    controller.setReorganizationUnits(unit.name, reorgUnitsArray)
    return
  }
  // 2. Same + Other Carrier Hangar
  for (const carrier of carriersInTF) {
    const toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

    reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)
    if (reorgUnits) {
      reorgUnitsArray = mergeUnique(reorgUnitsArray, reorgUnits)
    }
  }
  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return
  }
  return null
}

export function checkAllBoxesForReorganization(controller, unit, fromBox, side, auto) {
  let carrierName = unit.carrier
  let toBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")

  // check reorg within box
  let reorgUnits = checkForReorganization(controller, fromBox, null, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return
  }
  // check reorg across boxes
  // 1. Same Carrier
  reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return // Japan air unit must use its own carrier if possible
    }
  }
  // 2. Other Carrier in Same Task Force
  let carrier = controller.getOtherCarrierInTF(carrierName, side)
  if (!carrier) {
    return
  }
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

  let reorgUnits2 = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits2) {
    if (reorgUnits1) {
      reorgUnits2 = mergeUnique(reorgUnits1, reorgUnits2)
    }
    controller.setReorganizationUnits(unit.name, reorgUnits2)
    return
  }

  // 3. Other Task Force Carrier(s)
  const taskForce = controller.getTaskForceForCarrier(carrier.name, side)
  const carriersInOtherTaskForce = controller.getCarriersInOtherTF(taskForce, side)

  let reorgUnits1 = new Array()
  for (const carrier of carriersInOtherTaskForce) {
    toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
    let reorgUnits2 = checkForReorganization(controller, fromBox, toBox, auto)
    if (reorgUnits2) {
      reorgUnits1 = mergeUnique(reorgUnits1, reorgUnits2)
    }
  }
  if (reorgUnits1) {
    controller.setReorganizationUnits(unit.name, reorgUnits1)
  }
  return
}

export function setValidDestinationBoxes(controller, airUnitName, side) {
  const location = controller.getAirUnitLocation(airUnitName)

  // console.log(airUnitName, "location -> ", location.boxName)
  if (location.boxName.includes("RETURNING (1)")) {
    // see if US CSF within two hexes of Midway
    let hexesBetweenMidwayAndCSF = controller.numHexesBetweenFleets(
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )

    // This is not correct, the test should be if strike hex is within 5 of Midway
    // @TODO fix this!
    const useMidway = hexesBetweenMidwayAndCSF <= 2 && side === GlobalUnitsModel.Side.US
    const destinations = doReturn1(controller, airUnitName, side, useMidway)
    if (destinations.length === 0) {
      // check for possible reorganisation
      checkAllBoxesForReorganization(controller, unit, location.boxName, side, false)
    }
  }
  if (location.boxName.includes("RETURNING (2)")) {
    doReturn2(controller, airUnitName, side)
  }
  if (location.boxName.includes("CAP RETURNING")) {
    let hexesBetweenMidwayAndCSF = controller.numHexesBetweenFleets(
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )
    const useMidway = hexesBetweenMidwayAndCSF <= 2 && side === GlobalUnitsModel.Side.US
    const destinations = doCapReturn(controller, airUnitName, side, useMidway)
    if (destinations.length === 0) {
      // check for possible reorganisation
      if (side === GlobalUnitsModel.Side.JAPAN) {
        checkAllJapanBoxesForReorganizationCAP(controller, unit, location.boxName, side, false)
      } else {
        checkAllUSBoxesForReorganizationCAP(controller, unit, location.boxName, side, false)
      }
    }
  }
  if (location.boxName.includes("CAP") && !location.boxName.includes("RETURNING")) {
    doCap(controller, airUnitName, side)
  }
  if (location.boxName.includes("HANGAR")) {
    doHangar(controller, airUnitName, side)
  }

  if (location.boxName.includes("FLIGHT")) {
    doFlightDeck(controller, airUnitName, side)
  }

  if (location.boxName.includes("STRIKE")) {
    doStrikeBox(controller, airUnitName, side)
  }
}
// This function determines which Air Boxes are valid moves for a given air unit in
// a given location, allowing for possible reorganization of step 1 units
export function handleAirUnitMoves(controller, side) {
  // 1. loop through all air units for this side
  const airUnits = controller.getAllAirUnits(side)

  // 2. for each air unit get the location

  // 3. use the following logic to work out what that unit can do
  for (let unit of airUnits) {
    setValidDestinationBoxes(controller, unit.name, side)
  }
}
