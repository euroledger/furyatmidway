
import { getRandomElementFrom } from "../../Utils"
import { getAllHexes } from "../../components/HexUtils"
import { usCSFStartHexes } from "../../components/MapRegions"


// Create array of all hexes 

const HEXES = getAllHexes()

export function placeUSCSFFleetAction() {
  // initial setup choose randomly from start regions
  return getRandomElementFrom(usCSFStartHexes)
}

export function doUSFleetMovementAction(regions, offboardPossible) {
    // regions is all valid hexes this fleet can move to

    // for now choose randomly
    // return getRandomElementFrom(regions)

    return  { q: 4, r: 1 } // QUACK HARD WIRED FOR TESTING ONLY
}
