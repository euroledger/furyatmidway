import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalGameState from "./model/GlobalGameState"
import GlobalUnitsModel from "./model/GlobalUnitsModel"

function getUSSetupZones(box) {
  // if (box.name.includes("STRIKE")) {
  //   return box.name
  // }
  if (
    !box.name.includes(GlobalGameState.getUSCarrier().toUpperCase()) &&
    box.name != GlobalUnitsModel.AirBox.US_TF16_CAP &&
    box.name != GlobalUnitsModel.AirBox.US_TF17_CAP &&
    box.name != GlobalUnitsModel.AirBox.US_MIDWAY_CAP
  ) {
    return []
  }
  if (box.name === GlobalUnitsModel.AirBox.US_TF16_CAP && GlobalGameState.currentTaskForce !== 1) {
    return []
  }
  if (box.name === GlobalUnitsModel.AirBox.US_TF17_CAP && GlobalGameState.currentTaskForce !== 2) {
    return []
  }
  if (box.name === GlobalUnitsModel.AirBox.US_MIDWAY_CAP && GlobalGameState.currentTaskForce !== 3) {
    return []
  }
  if (box.name.includes("RETURN")) {
    return []
  }
  return box.name
}

function getJapanSetupZones(box) {
  // if (box.name.includes("STRIKE")) {
  //   return box.name
  // }
  if (
    !box.name.includes(GlobalGameState.getJapanCarrier().toUpperCase()) &&
    box.name != GlobalUnitsModel.AirBox.JP_CD1_CAP &&
    box.name != GlobalUnitsModel.AirBox.JP_CD2_CAP
  ) {
    return []
  }
  if (box.name === GlobalUnitsModel.AirBox.JP_CD2_CAP && GlobalGameState.currentCarrierDivision === 1) {
    return []
  }
  if (box.name === GlobalUnitsModel.AirBox.JP_CD1_CAP && GlobalGameState.currentCarrierDivision === 2) {
    return []
  }
  if (box.name.includes("RETURN")) {
    return []
  }
  return box.name
}

export function getUSEnabledAirBoxes() {
  const usZones = USAirBoxOffsets.flatMap((box) => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
      return getUSSetupZones(box)
    }
  })
  return usZones
}

export function getJapanEnabledAirBoxes() {
  const jpZones = JapanAirBoxOffsets.flatMap((box) => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      const boxes = getJapanSetupZones(box)
      return getJapanSetupZones(box)
    }
  })
  return jpZones
}
