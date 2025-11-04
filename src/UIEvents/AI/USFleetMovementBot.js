import { getRandomElementFrom } from "../../Utils"
import { getAllHexes } from "../../components/HexUtils"
import { usCSFStartHexes, usCSFPreferredStartHexes } from "../../components/MapRegions"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { distanceBetweenHexes, allHexesWithinDistance, removeHexFromRegion } from "../../components/HexUtils"
import GlobalInit from "../../model/GlobalInit"
import Controller from "../../controller/Controller"
import { rowIHexes } from "../../components/MapRegions"
import { goToDMCVState } from "../../PlayerState/StateUtils"
import HexCommand from "../../commands/HexCommand"
import Command from "../../commands/Command"

// Create array of all hexes

const HEXES = getAllHexes()

export function placeUSCSFFleetAction() {
  // initial setup choose randomly from start regions
  const num = Math.floor(Math.random() * 6) + 1
  // 66% chance US Sets up in preferred region, 33% random

  // TODO make it 50-50 if US using defensive strategy
  if (num <= 4) {
    const pos = getRandomElementFrom(usCSFPreferredStartHexes)
    return pos
  }
  return getRandomElementFrom(usCSFStartHexes)
}

// returns list of hexes sorted according to distance to location (shortest distance at element 0)
function sortDistances(regions, location) {
  const sortedRegions = regions.sort(function (a, b) {
    if (distanceBetweenHexes(a, location) < distanceBetweenHexes(b, location)) {
      return 1
    }
    return -1
  })

  return sortedRegions
}

// test all hexes in region list, find the one closes to hex
export function closestHexTo(regions, hex) {
  let distance = 100
  let target, currentDist
  for (const regionHex of regions) {
    currentDist = distanceBetweenHexes(hex, regionHex)
    if (regionHex === Controller.MIDWAY_HEX.currentHex) {
      continue
    }
    if (currentDist < distance) {
      distance = currentDist
      target = regionHex
    }
  }
  return { distance, target }
}
// test all hexes in region list, find the one furthest away from hex
export function furthestHexFrom(regions, hex) {
  let dist = -100
  let targetHex, currentDist
  for (const regionHex of regions) {
    currentDist = distanceBetweenHexes(hex, regionHex)
    if (currentDist > dist) {
      dist = currentDist
      targetHex = hex
    }
  }
  return { dist, targetHex }
}

export function distanceFromColI(regions) {
  let dist = 100
  let targetHex, currentDist
  for (const hex of regions) {
    for (const rowIHex of rowIHexes) {
      currentDist = distanceBetweenHexes(hex, rowIHex)
      if (currentDist < dist) {
        dist = currentDist
        targetHex = hex
      }
    }
  }
  return { dist, targetHex }
}

export function doUSDMCVFleetMovementAction(controller, usDMCVRegions) {
  const dmcvLocation = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
  const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  if (dmcvLocation === undefined) {
    // Initial placement should be any hex adjacent to CSF closest to a hex in row I

    let usRegions = allHexesWithinDistance(csfLocation.currentHex, 1, true)
    if (GlobalGameState.gameTurn === 4) {
      usRegions = allHexesWithinDistance(csfLocation.currentHex, 2, true)
    }

    const { dist, targetHex } = distanceFromColI(usRegions)

    // Also take account of position of 1AF
    // If within 3 hexes don't place (it could chase us)

    const current1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    const currentCSFLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    let distanceFrom1AFToCSF = 100
    if (currentCSFLocation !== undefined && current1AFLocation !== undefined) {
      distanceFrom1AFToCSF = distanceBetweenHexes(currentCSFLocation.currentHex, current1AFLocation.currentHex)
    }
    if (GlobalGameState.gameTurn <= 4) {
      if (dist <= 4 && distanceFrom1AFToCSF > 3) {
        return targetHex
      } else if (dist <= 2) {
        return targetHex
      }
    } else {
      if (dist <= 2) {
        return targetHex
      }
    }
    // only place DMCV fleet if distance to rowI is
    // turns 1-3 4 hexes or less (night turn to come, allows DMCV to move 2 hexes)
    // turns 5-7 2 hexes or less
    console.log("DEBUG DO NOT PLACE DMCV")

    return undefined
  }

  // TODO ------ if offboardPossible - move OFF THE BOARD

  // Move closer to row I
  const { targetHex } = distanceFromColI(usDMCVRegions)
  return targetHex
}

function doTurn4FleetMovement(regions, dmcvLocation) {
  // IJN region hex closes to Midway
  const current1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const currentCSFLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  // console.log("DEBUG current1AFLocation=", current1AFLocation)
  const ijnRegions = allHexesWithinDistance(current1AFLocation.currentHex, 2, true)
  // console.log("DEBUG ijnRegions=", ijnRegions)
  const sortedHexes = sortDistances(ijnRegions, Controller.MIDWAY_HEX.currentHex)
  // console.log("DEBUG sortedHexes=", sortedHexes)

  let oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // TODO
  // If a carrier has 2 hits and no DMCV yet placed
  // AND CSF is > 4 hexes from Row I -> head for row I

  // get current distance of fleet from Col I
  const { dist } = distanceFromColI([currentCSFLocation.currentHex])

  // get closest hex to Col I - move here if current range > 4
  const { targetHex } = distanceFromColI(regions)
  // const { dist, targetHex } = distanceFromColI(regions)

  if (goToDMCVState(GlobalUnitsModel.Side.US) && !GlobalGameState.usDMCVFleetPlaced && dist > 4) {
    // go to closest hex to row I
    return targetHex
  }

  // either use currrent 1AF location or hex closest to Midway that it can get to
  let ijnFleetLocation = oneOrZero === 1 ? current1AFLocation.currentHex : sortedHexes[0]
  // console.log("DEBUG US FLEET HEADING TOWARD", ijnFleetLocation)
  const distanceFrom1AFToCSF = distanceBetweenHexes(currentCSFLocation.currentHex, ijnFleetLocation)

  let targetHexes = new Array()
  for (const region of regions) {
    const distanceFromRegionTo1AF = distanceBetweenHexes(region, ijnFleetLocation)

    // console.log(
    //   "***DEBUG region=",
    //   region,
    //   "distanceFrom1AFToCSF=",
    //   distanceFrom1AFToCSF,
    //   "distanceFromRegionTo1AF=",
    //   distanceFromRegionTo1AF
    // )
    if (distanceFromRegionTo1AF < distanceFrom1AFToCSF) {
      targetHexes.push(region)
    }
  }

  if (dmcvLocation !== undefined && dmcvLocation.currentHex !== undefined && targetHexes.length > 1) {
    targetHexes = removeHexFromRegion(targetHexes, dmcvLocation.currentHex)
  }

  if (targetHexes.length === 0) {
    targetHexes = regions
  }
  // console.log(
  //   "DEBUG distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex)=",
  //   distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex)
  // )

  // make sure the two fleets (US CSF AND DMCV DON'T END UP IN THE SAME HEX)
  if (
    dmcvLocation !== undefined &&
    targetHexes.length === 1 &&
    dmcvLocation.currentHex !== undefined &&
    distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex) === 0
  ) {
    targetHexes = regions
  }

  let fleetHex = getRandomElementFrom(targetHexes)

  // return { q: 3, r: 1 }

  oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // 50-50 to move away if fleets are 3-5 hexes (to put any IJN airstrikes out of range
  if (
    oneOrZero === 1 &&
    GlobalGameState.distanceBetweenCarrierFleets >= 3 &&
    GlobalGameState.distanceBetweenCarrierFleets <= 5
  ) {
    fleetHex = furthestHexFrom(regions, current1AFLocation.currentHex)
  }

  return fleetHex
}
function doTurns2And3FleetMovement(regions, dmcvLocation) {
  // IJN region hex closes to Midway
  const current1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const currentCSFLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  // console.log("DEBUG current1AFLocation=", current1AFLocation)
  const ijnRegions = allHexesWithinDistance(current1AFLocation.currentHex, 2, true)
  // console.log("DEBUG ijnRegions=", ijnRegions)
  const sortedHexes = sortDistances(ijnRegions, Controller.MIDWAY_HEX.currentHex)
  // console.log("DEBUG sortedHexes=", sortedHexes)

  let oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // TODO
  // If a carrier has 2 hits and no DMCV yet placed
  // AND CSF is > 4 hexes from Row I -> head for row I

  // get current distance of fleet from Col I
  const { dist } = distanceFromColI([currentCSFLocation.currentHex])

  // get closest hex to Col I - move here if current range > 4
  const { targetHex } = distanceFromColI(regions)
  // const { dist, targetHex } = distanceFromColI(regions)

  if (goToDMCVState(GlobalUnitsModel.Side.US) && !GlobalGameState.usDMCVFleetPlaced && dist > 4) {
    // go to closest hex to row I
    return targetHex
  }

  // either use currrent 1AF location or hex closest to Midway that it can get to
  let ijnFleetLocation = oneOrZero === 1 ? current1AFLocation.currentHex : sortedHexes[0]
  // console.log("DEBUG US FLEET HEADING TOWARD", ijnFleetLocation)
  const distanceFrom1AFToCSF = distanceBetweenHexes(currentCSFLocation.currentHex, ijnFleetLocation)

  let targetHexes = new Array()
  for (const region of regions) {
    const distanceFromRegionTo1AF = distanceBetweenHexes(region, ijnFleetLocation)

    // console.log(
    //   "***DEBUG region=",
    //   region,
    //   "distanceFrom1AFToCSF=",
    //   distanceFrom1AFToCSF,
    //   "distanceFromRegionTo1AF=",
    //   distanceFromRegionTo1AF
    // )
    if (distanceFromRegionTo1AF < distanceFrom1AFToCSF) {
      targetHexes.push(region)
    }
  }

  if (dmcvLocation !== undefined && dmcvLocation.currentHex !== undefined && targetHexes.length > 1) {
    targetHexes = removeHexFromRegion(targetHexes, dmcvLocation.currentHex)
  }

  if (targetHexes.length === 0) {
    targetHexes = regions
  }
  // console.log(
  //   "DEBUG distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex)=",
  //   distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex)
  // )

  // make sure the two fleets (US CSF AND DMCV DON'T END UP IN THE SAME HEX)
  if (
    dmcvLocation !== undefined &&
    targetHexes.length === 1 &&
    dmcvLocation.currentHex !== undefined &&
    distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex) === 0
  ) {
    targetHexes = regions
  }

  let fleetHex = getRandomElementFrom(targetHexes)

  // return { q: 3, r: 1 }

  oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // 50-50 to move away if fleets are 3-5 hexes (to put any IJN airstrikes out of range
  if (
    oneOrZero === 1 &&
    GlobalGameState.distanceBetweenCarrierFleets >= 3 &&
    GlobalGameState.distanceBetweenCarrierFleets <= 5
  ) {
    fleetHex = furthestHexFrom(regions, current1AFLocation.currentHex)
  }

  return fleetHex
}

function doTurns5To7FleetMovement(regions, dmcvLocation) {
  // IJN region hex closes to Midway
  const current1AFLocation = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const currentCSFLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const currentMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

  // IF 1AF is off the board close range to 1) DMCV, 2) MIF
  if (current1AFLocation.boxName === Command.FLEET_BOX) {
    const currentDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

    console.log(">>>>>>>>>>>> DMCV LOCATION=", currentDMCVLocation)
    if (currentDMCVLocation !== undefined && currentDMCVLocation.boxName !== Command.FLEET_BOX) {
      // IF distance to DMCV is > 5 do not and DMCV is in row 1 - do not go for DMCV
      const distanceFromCSFToDMCV = distanceBetweenHexes(currentCSFLocation.currentHex, currentDMCVLocation.currentHex)
      console.log(">>>>>>> GO AFTER DMCV, distance =", distanceFromCSFToDMCV)

      // get closest hex to DMCV
      const { target } = closestHexTo(regions, currentDMCVLocation.currentHex)
      return target
    } else if (currentMIFLocation !== undefined && currentMIFLocation.boxName !== Command.FLEET_BOX) {
      // IF distance to DMCV is > 5 do not and DMCV is in row 1 - do not go for DMCV
      const distanceFromCSFToMIF = distanceBetweenHexes(currentCSFLocation.currentHex, currentMIFLocation.currentHex)
      console.log(">>>>>>> GO AFTER MIF, distance =", distanceFromCSFToMIF)

      // get closest hex to MIF
      const { target } = closestHexTo(regions, currentMIFLocation.currentHex)
      return target
    }
    return currentCSFLocation.currentHex
  }

  const ijnRegions = allHexesWithinDistance(current1AFLocation.currentHex, 2, true)
  const sortedHexes = sortDistances(ijnRegions, Controller.MIDWAY_HEX.currentHex)

  let oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // TODO
  // If a carrier has 2 hits and no DMCV yet placed
  // AND CSF is > 4 hexes from Row I -> head for row I

  // get current distance of fleet from Col I
  const { dist } = distanceFromColI([currentCSFLocation.currentHex])

  // get closest hex to Col I - move here if current range > 4
  const { targetHex } = distanceFromColI(regions)
  // const { dist, targetHex } = distanceFromColI(regions)

  if (goToDMCVState(GlobalUnitsModel.Side.US) && !GlobalGameState.usDMCVFleetPlaced && dist > 4) {
    // go to closest hex to row I
    return targetHex
  }

  // use hex closest to Midway that it can get to

  let targetHexes = regions

  if (dmcvLocation !== undefined && dmcvLocation.currentHex !== undefined && targetHexes.length > 1) {
    targetHexes = removeHexFromRegion(regions, dmcvLocation.currentHex)
  }

  if (targetHexes.length === 0) {
    targetHexes = regions
  }

  // console.log(
  //   "DEBUG distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex)=",
  //   distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex)
  // )
  let { target } = closestHexTo(regions, Controller.MIDWAY_HEX.currentHex)
  let midwayTarget = target

  const hex1AF = closestHexTo(regions, current1AFLocation.currentHex)

  // const usStrikeAirStrength = GlobalInit.controller.getCarrierAttackAirStrength(GlobalUnitsModel.Side.US) // num air steps left

  // make sure the two fleets (US CSF AND DMCV DON'T END UP IN THE SAME HEX)
  if (
    dmcvLocation !== undefined &&
    targetHexes.length === 1 &&
    dmcvLocation.currentHex !== undefined &&
    distanceBetweenHexes(targetHexes[0], dmcvLocation.currentHex) === 0
  ) {
    targetHexes = regions
  }

  targetHexes = removeHexFromRegion(regions, Controller.MIDWAY_HEX.currentHex)

  let fleetHex = getRandomElementFrom(targetHexes)

  // return { q: 3, r: 1 }

  oneOrZero = Math.random() >= 0.5 ? 1 : 0

  // 50/50 move toward Midway if MIF is on the board
  // otherwise use fleet target selected as before

  if (
    oneOrZero === 0 &&
    currentMIFLocation.currentHex != undefined &&
    currentMIFLocation.currentHex !== HexCommand.OFFBOARD
  ) {
    return midwayTarget
  } else {
    return hex1AF.target
  }
}
export function doUSFleetMovementAction(controller, regions, offboardPossible) {
  console.log(">>>>>>> MOVE US FLEET: PLANNING <<<<<<<<")

  const dmcvLocation = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
  let hexesBetweenDMCVAndCSF = -1

  if (dmcvLocation !== undefined) {
    hexesBetweenDMCVAndCSF = controller.numHexesBetweenFleets(
      { name: "IJN-DMCV", side: GlobalUnitsModel.Side.JAPAN },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )
  }
  const turn = GlobalGameState.gameTurn
  const remainingJapanAirOps = GlobalGameState.airOperationPoints.japan
  const remainingUSAirOps = GlobalGameState.airOperationPoints.us
  const usNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
  const japanNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
  const usAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.US) // num air steps left

  // TODO function for attack air strength only
  const japanAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.JAPAN)
  // regions is all valid hexes this fleet can move to

  // Move the US Fleet taking into account:

  if (turn >= 4) {
    // Move as close as possible to Midway to prevent invasion
  } else {
    // First check if US Naval/Air assets too low
    // If so and within 2 VPs of IJN RUN AWAY

    if (usNavalStrength < 4 || usAirStrength < 6) {
      // Retreat
      // Rank all hexes, move to furthest away from 1AF
    }
    // If there is a DMCV or potential DMCV close range
    if (controller.getDamagedCarriers() && hexesBetweenDMCVAndCSF === -1) {
      // there is a crippled carrier not yet in DMCV - close to 1AF
    } else if (controller.getDamagedCarriers()) {
      // there is a DMCV Carrier
      // Close range to DMCV
    }
    // 1. VPs and Damage to Carriers/Aircraft

    if (GlobalGameState.usVPs > GlobalGameState.japanVPs + 2) {
      // Even if Midway lost currently winning
      // Rank all hexes move to closest to 1AF
    } else {
      // increase range to random hex, closer to Midway
    }
  }

  if (GlobalGameState.gameTurn === 1) {
    console.log("DO TURN 1 MOVEMENT")
    // close range with IJN

    // Close range to top left of board (assume 1AF is here)

    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    const distanceFromCSFToTopLeft = distanceBetweenHexes(csfLocation.currentHex, { q: 1, r: 1 })

    // top left is q:1, r:1
    let targetHexes = new Array()
    for (const region of regions) {
      const distanceFromRegionToTopLeft = distanceBetweenHexes(region, { q: 1, r: 1 })
      if (distanceFromRegionToTopLeft < distanceFromCSFToTopLeft) {
        targetHexes.push(region)
      }
    }
    // let targetHexes = regions.filter((region) => distanceBetweenHexes(region, {q:1, r:1} <=4 ))
    if (targetHexes.length === 0) {
      targetHexes = regions
    }

    const fleetHex = getRandomElementFrom(targetHexes)
    return fleetHex
    // return { q: 4, r: 0 } // QUACK HARD WIRED FOR TESTING ONLY
  }
  if (GlobalGameState.gameTurn === 2) {
    // CLOSE RANGE EITHER TO 1AF or WHERE WE EXPECT 1AF TO GO (ie CLOSER TO MIDWAY)

    // TODO
    // COULD MOVE AWAY TO PREVENT STRIKE ?????????
    // IF DISTANCE BETWEEN FLEETS WAS 3-5 ON TURN 1 - MOVE AWAY
    // IF DMCV ELIGIBLE AND >4 HEXES FROM ROW I - move toward row I
    console.log("DO TURN 2 MOVEMENT")
    return doTurns2And3FleetMovement(regions, dmcvLocation)
    // return { q: 2, r: 2}
  }
  if (GlobalGameState.gameTurn === 3) {
    console.log("DO TURN 3 MOVEMENT")

    console.log(
      "********** US FLEET MOVEMENT distance between fleets last turn =>",
      GlobalGameState.distanceBetweenCarrierFleets
    )
    return doTurns2And3FleetMovement(regions, dmcvLocation)
    // return { q: 6, r: -1 } // QUACK HARD WIRED FOR TESTING ONLY
  }
  if (GlobalGameState.gameTurn === 4) {
    return doTurn4FleetMovement(regions, dmcvLocation)
  }
  if (GlobalGameState.gameTurn >= 5) {
    return doTurns5To7FleetMovement(regions, dmcvLocation)
  }
}
