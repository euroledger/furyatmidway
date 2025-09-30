import { getRandomElementFrom } from "../../Utils"
import { getAllHexes } from "../../components/HexUtils"
import { usCSFStartHexes } from "../../components/MapRegions"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

// Create array of all hexes

const HEXES = getAllHexes()

export function placeUSCSFFleetAction() {
  // initial setup choose randomly from start regions
  return getRandomElementFrom(usCSFStartHexes)
}

export function doUSFleetMovementAction(controller, regions, offboardPossible) {
  console.log(">>>>>>> MOVE US FLEET: PLANNING <<<<<<<<")

  let hexesBetween1AFAndCSF = controller.numHexesBetweenFleets(
    { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
    { name: "CSF", side: GlobalUnitsModel.Side.US }
  )
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
    return { q: 4, r: 1 } // QUACK HARD WIRED FOR TESTING ONLY
  }
  if (GlobalGameState.gameTurn === 2) {
    return { q: 3, r: 3 } // QUACK HARD WIRED FOR TESTING ONLY
  }
    if (GlobalGameState.gameTurn === 3) {
    return { q: 5, r: 4 } // QUACK HARD WIRED FOR TESTING ONLY
  }
}
