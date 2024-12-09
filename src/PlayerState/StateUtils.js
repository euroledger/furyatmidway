import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { allHexesWithinDistance, removeHexFromRegion } from "../components/HexUtils"
import { createMapUpdateForFleet } from "../AirUnitTestData"
import { delay } from "../Utils"
export const DELAY_MS = 1

export function goToDMCVState(side) {
  if (side === GlobalUnitsModel.Side.US) {
    if (GlobalGameState.usDMCVCarrier === "SUNK") {
      return false
    }
    const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
    if (usDMCVLocation !== undefined && usDMCVLocation.boxName === HexCommand.FLEET_BOX) {
      return false
    }
    return (
      (GlobalInit.controller.getDamagedCarriers(side).length > 0 && GlobalGameState.usDMCVFleetPlaced === false) ||
      (usDMCVLocation !== undefined && GlobalGameState.usDMCVFleetPlaced === true) // could be sunk
    )
  }
  if (GlobalGameState.jpDMCVCarrier === "SUNK") {
    return false
  }
  const jpDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

  if (jpDMCVLocation !== undefined && jpDMCVLocation.boxName === HexCommand.FLEET_BOX) {
    return false
  }
  return (
    (GlobalInit.controller.getDamagedCarriers(side).length > 0 && GlobalGameState.jpDMCVFleetPlaced === false) ||
    (jpDMCVLocation !== undefined && GlobalGameState.jpDMCVFleetPlaced === true)
  )
}

function testForOffMapBoxesJapan(setEnabledJapanFleetBoxes) {
  const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const mifLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
  const ijnDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

  if (GlobalGameState.gameTurn === 4) {
    GlobalGameState.fleetSpeed = 4
    GlobalGameState.dmcvFleetSpeed = 2
    if (af1Location !== undefined && af1Location.currentHex.q <= 4) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        setEnabledJapanFleetBoxes(true)
      }
    }
    if (mifLocation !== undefined && mifLocation.boxName !== HexCommand.FLEET_BOX && mifLocation.currentHex.q <= 2) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        setEnabledJapanFleetBoxes(true)
      }
    }
    if (
      ijnDMCVLocation !== undefined &&
      ijnDMCVLocation.boxName !== HexCommand.FLEET_BOX &&
      ijnDMCVLocation.currentHex.q <= 2
    ) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
        setEnabledJapanFleetBoxes(true)
      }
    }
  } else {
    GlobalGameState.fleetSpeed = 2
    GlobalGameState.dmcvFleetSpeed = 1

    if (
      af1Location !== undefined &&
      af1Location.boxName !== HexCommand.FLEET_BOX &&
      af1Location.currentHex !== undefined &&
      af1Location.currentHex.q <= 2
    ) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        setEnabledJapanFleetBoxes(true)
      }
    }
    if (
      mifLocation !== undefined &&
      mifLocation.boxName !== HexCommand.FLEET_BOX &&
      mifLocation.currentHex !== undefined &&
      mifLocation.currentHex.q <= 1
    ) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        setEnabledJapanFleetBoxes(true)
      }
    }
    if (
      ijnDMCVLocation !== undefined &&
      ijnDMCVLocation.currentHex !== undefined &&
      ijnDMCVLocation.boxName !== HexCommand.FLEET_BOX &&
      ijnDMCVLocation.currentHex.q <= 1
    ) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
        setEnabledJapanFleetBoxes(true)
      }
    }
  }
}

export function initialiseIJNFleetMovement({
  setUSMapRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setJpAlertShow,
  setEnabledJapanFleetBoxes,
}) {
  testForOffMapBoxesJapan(setEnabledJapanFleetBoxes)
  setUSMapRegions([])
  // if this is not turn 1 derive japan regions from position of fleet(s)
  if (GlobalGameState.gameTurn !== 1) {
    const locationOfCarrier = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    if (locationOfCarrier !== undefined && locationOfCarrier.currentHex !== undefined) {
      // IJN 1AF Fleet is not allowed to move to same hex as other fleets, remove IJN-DMCV hex from region
      let jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, GlobalGameState.fleetSpeed, true)
      const jpDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

      if (jpDMCVLocation !== undefined && jpDMCVLocation.currentHex !== undefined) {
        jpRegion = removeHexFromRegion(jpRegion, jpDMCVLocation.currentHex)
      }
      setJapanMapRegions(jpRegion)

      const jpMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

      // MIF Regions set separately
      if (jpMIFLocation !== undefined && jpMIFLocation.currentHex !== undefined) {
        jpRegion = allHexesWithinDistance(jpMIFLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
        if (jpDMCVLocation !== undefined && jpDMCVLocation.currentHex !== undefined) {
          jpRegion = removeHexFromRegion(jpRegion, jpDMCVLocation.currentHex)
        }
        setJapanMIFMapRegions(jpRegion)
      }
      if (GlobalGameState.gameTurn === 4) {
        // Initial placement of MIF
        setJapanMIFMapRegions(japanMIFStartHexes)
      }
    }
  } else {
    if (GlobalGameState.midwayAttackDeclaration === true) {
      setJapanMapRegions(japanAF1StartHexesMidway)
    } else {
      setJapanMapRegions(japanAF1StartHexesNoMidway)
    }
  }
  setJpAlertShow(true)
  GlobalGameState.phaseCompleted = false
}

export async function goToMidwayAttackOrUSFleetMovement({
  setMidwayNoAttackAlertShow,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setFleetUnitUpdate,
}) {
  if (GlobalGameState.gameTurn !== 4) {
    if (!GlobalGameState.midwayAttackDeclaration) {
      setMidwayNoAttackAlertShow(true)
    } else {
      GlobalGameState.midwayAttackResolved = false
      GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_ATTACK
      GlobalGameState.carrierHitsDetermined = false

      let distance = GlobalInit.controller.numHexesBetweenFleets(
        { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
        { name: "MIDWAY" }
      )
      calcAirOpsPointsMidway(distance)
      GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN
    }
  } else {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
  }

  setJapanMapRegions([])
  setJapanMIFMapRegions([])

  GlobalGameState.phaseCompleted = true
  GlobalGameState.jpFleetPlaced = true
  if (GlobalGameState.gameTurn === 4) {
    GlobalGameState.mifFleetPlaced = true
  }
  const update1 = createMapUpdateForFleet(GlobalInit.controller, "1AF", GlobalUnitsModel.Side.JAPAN)
  const update2 = createMapUpdateForFleet(GlobalInit.controller, "IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
  const update3 = createMapUpdateForFleet(GlobalInit.controller, "MIF", GlobalUnitsModel.Side.JAPAN)
  if (update1 !== null) {
    setFleetUnitUpdate(update1)
  }
  await delay(1)
  if (update2 !== null) {
    setFleetUnitUpdate(update2)
  }
  await delay(1)
  if (update3 !== null) {
    setFleetUnitUpdate(update3)
  }
  await delay(1)
}
