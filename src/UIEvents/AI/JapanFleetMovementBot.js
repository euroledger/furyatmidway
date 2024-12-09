import GlobalGameState from "../../model/GlobalGameState"
import { japanAF1StartHexesMidway, japanAF1StartHexesNoMidway } from "../../components/MapRegions"
import { getRandomElementFrom } from "../../Utils"

export function moveJapan1AFFleet() {
  // if initial setup choose randomly from start regions
  if (GlobalGameState.midwayAttackDeclaration) {
    return getRandomElementFrom(japanAF1StartHexesMidway)
  } else {
    return getRandomElementFrom(japanAF1StartHexesNoMidway)
  }
}
