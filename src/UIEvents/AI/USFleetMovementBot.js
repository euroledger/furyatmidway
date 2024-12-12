
import { getRandomElementFrom } from "../../Utils"
import { usCSFStartHexes } from "../../components/MapRegions"

export function moveUSCSFFleet() {
  // if initial setup choose randomly from start regions
  return getRandomElementFrom(usCSFStartHexes)
}
