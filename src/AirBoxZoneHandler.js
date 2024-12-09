import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import GlobalGameState from "./model/GlobalGameState"
import GlobalUnitsModel from "./model/GlobalUnitsModel"

function getUSSetupZones(box) {

  console.log("POOOOOOOOOOOOOOOO GlobalGameState.getUSCarrier()=", GlobalGameState.getUSCarrier())
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

export function getUSEnabledAirBoxes(initiative) {
  const usZones = USAirBoxOffsets.flatMap((box) => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
       if (box.name.includes("DMCV")) {
        return null
      }
      return getUSSetupZones(box)
    }
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS &&
      initiative === GlobalUnitsModel.Side.US
    ) {
      if (box.name.includes("STRIKE")) {
        return box.name
      }
    }
  })
  return usZones.filter((zone) => zone != undefined)
}

export function getJapanEnabledAirBoxes(initiative) {
  const jpZones = JapanAirBoxOffsets.flatMap((box) => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      if (box.name.includes("DMCV")) {
        return null
      }
      return getJapanSetupZones(box)
    }
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS &&
      initiative === GlobalUnitsModel.Side.JAPAN
    ) {
      if (box.name.includes("STRIKE")) {
        return box.name
      }
    }
  })
  return jpZones.filter((zone) => zone != undefined)
}
