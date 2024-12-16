import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { allHexesWithinDistance, removeHexFromRegion } from "../components/HexUtils"
import { createMapUpdateForFleet } from "../AirUnitData"
import { calculateSearchResults, calculateSearchValues } from "../model/SearchValues"
import { delay } from "../Utils"
export const DELAY_MS = 1

export function calcAirOpsPointsMidway(distanceFromFleetToMidway) {
  if (distanceFromFleetToMidway <= 2) {
    GlobalGameState.airOperationPoints.japan = 1
  } else if (distanceFromFleetToMidway <= 5) {
    GlobalGameState.airOperationPoints.japan = 2
  } else {
    // error do nothing for now
  }
}

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

export function calcAirOpsPoints({ setSearchValues, setSearchResults }) {
  const sv = calculateSearchValues(GlobalInit.controller)

  const sr = calculateSearchResults(GlobalInit.controller, {
    jp_af: Math.max(0, sv.jp_af),
    us_csf: sv.us_csf,
    us_midway: sv.us_midway,
  })

  setSearchValues(sv)
  GlobalGameState.airOperationPoints.japan = sr.JAPAN
  GlobalGameState.airOperationPoints.us = sr.US
  setSearchResults(sr)
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

export async function usFleetMovementHandler({ setFleetUnitUpdate }) {
  const update1 = createMapUpdateForFleet(GlobalInit.controller, "CSF", GlobalUnitsModel.Side.US)
  const update2 = createMapUpdateForFleet(GlobalInit.controller, "US-DMCV", GlobalUnitsModel.Side.US)

  if (update2 !== null) {
    await setFleetUnitUpdate(update2)
  }
  await delay(1)

  if (update1 !== null) {
    await setFleetUnitUpdate(update1)
  }
  await delay(1)

  GlobalGameState.updateGlobalState()
}

export async function getFleetsForCSFSeaBattle({ setJpFleet, setUsFleet }) {
  const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  let fleetsInSameHexAsCSF = new Array()
  if (csfLocation !== undefined) {
    fleetsInSameHexAsCSF = GlobalInit.controller.getAllFleetsInLocation(csfLocation, GlobalUnitsModel.Side.US, false)
    if (fleetsInSameHexAsCSF.length === 2) {
      setUsFleet("CSF")
      if (fleetsInSameHexAsCSF[0].name === "CSF") {
        setJpFleet(fleetsInSameHexAsCSF[1].name)
      } else {
        setJpFleet(fleetsInSameHexAsCSF[0].name)
      }
    }
  }
  return fleetsInSameHexAsCSF
}
export async function usFleetMovementNextStateHandler({
  setJpFleet,
  setUsFleet,
  setCardNumber,
  setSearchValues,
  setSearchResults,
  setSearchValuesAlertShow,
}) {
  const { numFleetsInSameHexAsCSF, numFleetsInSameHexAsUSDMCV } = GlobalInit.controller.opposingFleetsInSameHex()
  if (GlobalGameState.gameTurn === 4) {
    if (numFleetsInSameHexAsCSF === 2 || numFleetsInSameHexAsUSDMCV === 2) {
      if (numFleetsInSameHexAsCSF === 2) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_BATTLES_1
        getFleetsForCSFSeaBattle({ setJpFleet, setUsFleet })
      } else if (numFleetsInSameHexAsUSDMCV === 2) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_BATTLES_2
      }
    } else {
      // no sea battle -> go straight to night air operations
      GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
    }
  } else {
    if (numFleetsInSameHexAsCSF === 2 || numFleetsInSameHexAsUSDMCV === 2) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.RETREAT_US_FLEET
    } else {
      if (GlobalInit.controller.usHandContainsCard(7)) {
        setCardNumber(() => 7)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        calcAirOpsPoints({ setSearchValues, setSearchResults })
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
      }
    }
  }
}

export function isMidwayAttackPossible() {
  // if there are no attack planes on deck cannot attack Midway
  const attackUnitsOnDeck = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(false)
  if (attackUnitsOnDeck.length === 0) {
    GlobalGameState.midwayAttackDeclaration = false
    return false
  } else {
    return true
  }
}

const canUSDMCVMoveOffBoard = (dmcvLocation) => {
  let canMoveOffBoard
  if (dmcvLocation !== undefined && dmcvLocation.currentHex !== undefined && dmcvLocation.currentHex.q === 9) {
    // can move offboard
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
      canMoveOffBoard = true
    }
  }
  return canMoveOffBoard
}
const canCSFMoveOffBoard = (csfLocation) => {
  let canMoveOffBoard
  if (GlobalGameState.gameTurn === 4) {
    GlobalGameState.fleetSpeed = 4
    GlobalGameState.dmcvFleetSpeed = 2
  } else {
    GlobalGameState.fleetSpeed = 2
    GlobalGameState.dmcvFleetSpeed = 1
  }

  if (csfLocation !== undefined && csfLocation.currentHex !== undefined && csfLocation.currentHex.q >= 6) {
    // can move offboard
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      canMoveOffBoard = true
    }
  }
  return canMoveOffBoard
}

export const getUSFleetRegions = () => {
  const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

  let canCSFMoveFleetOffBoard = canCSFMoveOffBoard(csfLocation)
  let canUSDMCVMoveFleetOffBoard = canUSDMCVMoveOffBoard(usDMCVLocation)

  let usCSFRegions, usDMCVRegions
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
    GlobalGameState.phaseCompleted = true // may just want to skip any fleet movement (leave fleet where it is)
    if (csfLocation.currentHex !== undefined) {
      let regionsMinusAllFleets = allHexesWithinDistance(csfLocation.currentHex, GlobalGameState.fleetSpeed, true)

      // remove hex with IJN DMCV
      // if (GlobalGameState.gameTurn !== 4) {
      if (usDMCVLocation !== undefined && usDMCVLocation.currentHex !== undefined) {
        regionsMinusAllFleets = removeHexFromRegion(regionsMinusAllFleets, usDMCVLocation.currentHex)
      }
      // }
      usCSFRegions = regionsMinusAllFleets
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    if (
      csfLocation.currentHex === undefined &&
      (dmcvLocation.currentHex === undefined || dmcvLocation.boxName !== HexCommand.FLEET_BOX)
    ) {
      // both fleets have been removed from the map
      return {}
    }
    if (GlobalGameState.usDMCVFleetPlaced && dmcvLocation !== undefined) {
      usDMCVRegions = allHexesWithinDistance(dmcvLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
    } else {
      usDMCVRegions
    }
    if (csfLocation.currentHex !== undefined) {
      usDMCVRegions = removeHexFromRegion(usRegion, csfLocation.currentHex)
    }
  }
  return { canCSFMoveFleetOffBoard, canUSDMCVMoveFleetOffBoard, usCSFRegions, usDMCVRegions }
}

export async function setNextStateFollowingCardPlay(stateObject) {
  const { cardNumber, setCardNumber } = stateObject
  GlobalGameState.dieRolls = []

  switch (cardNumber) {
    case -1:
      break

    case 6:
      // High Speed Reconnaissance
      if (GlobalGameState.gameTurn === 1) {
        GlobalGameState.usCardsDrawn = true
        if (isMidwayAttackPossible()) {
          console.log("%%%%%%%%%%% QUACK 1 %%%%%%%%%%%%")
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
          return
        }
      }
      if (
        (GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 7) &&
        GlobalInit.controller.japanHandContainsCard(5)
      ) {
        // Now check for possible play of card 5
        setCardNumber(() => 5)
      } else {
        setCardNumber(() => 0) // reset for next card play
        if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
        }
        if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 5 || GlobalGameState.gameTurn === 7) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
          GlobalGameState.phaseCompleted = false
        }
      }
      break
      setCardNumber(() => -1) // reset for next card play
      if (GlobalGameState.carrierTarget2 !== "" && GlobalGameState.carrierTarget2 !== undefined) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_2
      } else {
        await endOfAirOperation(
          GlobalGameState.sideWithInitiative,
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
        GlobalGameState.updateGlobalState()
      }
      break
    default:
      console.log("ERROR unknown card number: ", cardNumber)
  }
}
