import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { allHexesWithinDistance, removeHexFromRegion } from "../components/HexUtils"
import { createMapUpdateForFleet, createRemoveDMCVFleetUpdate } from "../AirUnitData"
import { calculateSearchResults, calculateSearchValues } from "../model/SearchValues"
import { delay } from "../Utils"
import { japanAF1StartHexesMidway, japanAF1StartHexesNoMidway } from "../components/MapRegions"
import HexCommand from "../commands/HexCommand"
import { setUpAirAttack } from "../controller/AirAttackHandler"
import { getValidUSDestinationsCAP } from "../controller/AirOperationsHandler"
import USAirBoxOffsets from "../components/draganddrop/USAirBoxOffsets"
import { japanMIFStartHexes } from "../components/MapRegions"
import { createFleetUpdate, createRemoveFleetUpdate } from "../AirUnitData"
import { distanceBetweenHexes, interveningHexes } from "../components/HexUtils"
import { setValidDestinationBoxesNightOperations } from "../controller/AirOperationsHandler"
import Controller from "../controller/Controller"
import { allCards } from "../CardLoader"
import { autoSave } from "../Utils"
import { moveAirUnitNight, moveAirUnitsFromHangarEndOfNightOperation } from "../UIEvents/AI/USAirOperationsBot"

import {
  setStrikeGroupAirUnitsToNotMoved,
  resetStrikeGroups,
  moveCAPtoReturnBox,
  moveOrphanedCAPUnitsToEliminatedBox,
  moveOrphanedAirUnitsInReturn1Boxes,
} from "../controller/AirOperationsHandler"
import Command from "../commands/Command"
export const DELAY_MS = 10

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
    console.log("DEBUG goToDMCVState -> usDMCVLocation=", usDMCVLocation)
    if (usDMCVLocation !== undefined && usDMCVLocation.boxName === HexCommand.FLEET_BOX) {
      return false
    }
    if (usDMCVLocation !== undefined && usDMCVLocation === HexCommand.OFFBOARD) {
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

export function testForOffMapBoxesJapan() {
  const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const mifLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
  const ijnDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

  if (GlobalGameState.gameTurn === 4) {
    GlobalGameState.fleetSpeed = 4
    GlobalGameState.dmcvFleetSpeed = 2
    if (af1Location !== undefined && af1Location.boxName !== HexCommand.FLEET_BOX && af1Location.currentHex.q <= 4) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        console.log("AF1 can move offboard")
      }
    }
    if (mifLocation !== undefined && mifLocation.boxName !== HexCommand.FLEET_BOX && mifLocation.currentHex.q <= 2) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        return true
      }
    }

    if (goToDMCVState(GlobalUnitsModel.Side.JAPAN) && !GlobalGameState.dmcvChecked && ijnDMCVLocation === undefined) {
      // can move offboard

      // if Fleet is going from offboard directly to fleet box, need to allocate DMCV
      // marker

      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
        return true
      }
    }
    if (
      ijnDMCVLocation !== undefined &&
      ijnDMCVLocation.boxName !== HexCommand.FLEET_BOX &&
      ijnDMCVLocation.currentHex.q <= 2
    ) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
        return true
      }

      // If IJN DMCV FLEET IS OFFMAP AND IN DMCV GAME PHASE CAN MOVE DIRECTLY TO FLEET BOX
      if (
        ijnDMCVLocation === undefined &&
        GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
      ) {
        return true
      }
    }
  } else {
    GlobalGameState.fleetSpeed = 2
    GlobalGameState.dmcvFleetSpeed = 1

    if (goToDMCVState(GlobalUnitsModel.Side.JAPAN) && !GlobalGameState.dmcvChecked && ijnDMCVLocation === undefined) {
      // can move offboard

      // if Fleet is going from offboard directly to fleet box, need to allocate DMCV
      // marker

      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
        return true
      }
    }
    if (
      af1Location !== undefined &&
      af1Location.boxName !== HexCommand.FLEET_BOX &&
      af1Location.currentHex !== undefined &&
      af1Location.currentHex.q <= 2
    ) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        return true
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
        return true
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
        return true
      }
    }
  }
  return false
}

export function initialiseIJNFleetMovement({
  setUSMapRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setEnabledJapanFleetBoxes,
}) {
  const enableOffMapBoxesJapan = testForOffMapBoxesJapan()
  setEnabledJapanFleetBoxes(enableOffMapBoxesJapan)
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
    }
    const jpMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

    // MIF Regions set separately
    if (jpMIFLocation !== undefined && jpMIFLocation.currentHex !== undefined) {
      const jpDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
      let jpRegion = allHexesWithinDistance(jpMIFLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      if (jpDMCVLocation !== undefined && jpDMCVLocation.currentHex !== undefined) {
        jpRegion = removeHexFromRegion(jpRegion, jpDMCVLocation.currentHex)
      }
      setJapanMIFMapRegions(jpRegion)
    }
    if (GlobalGameState.gameTurn === 4) {
      // Initial placement of MIF
      setJapanMIFMapRegions(japanMIFStartHexes)
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

export async function usFleetMovementHandler({ setFleetUnitUpdate }) {
  const update1 = createMapUpdateForFleet(GlobalInit.controller, "CSF", GlobalUnitsModel.Side.US)
  let update2 = null
  if (GlobalGameState.usDMCVCarrier !== undefined) {
    update2 = createMapUpdateForFleet(GlobalInit.controller, "US-DMCV", GlobalUnitsModel.Side.US)
  }
  if (update2 !== null) {
    setFleetUnitUpdate(update2)
  }
  await delay(1)

  if (update1 !== null) {
    setFleetUnitUpdate(update1)
  }
  await delay(1)

  GlobalGameState.updateGlobalState()
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
  await delay(50)
  if (update2 !== null) {
    setFleetUnitUpdate(update2)
  }
  await delay(1)
  if (update3 !== null) {
    setFleetUnitUpdate(update3)
  }
  await delay(1)
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
export function displayScreen() {
  if (
    GlobalGameState.jpPlayerType === GlobalUnitsModel.TYPE.AI &&
    GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI &&
    GlobalGameState.replay === false
  ) {
    return false
  }
  return true
}
export async function usFleetMovementNextStateHandler({
  setJpFleet,
  setUsFleet,
  setCardNumber,
  cardNumber,
  setSearchValues,
  setSearchResults,
}) {
  const { numFleetsInSameHexAsCSF, numFleetsInSameHexAsUSDMCV } = GlobalInit.controller.opposingFleetsInSameHex()
  if (GlobalGameState.gameTurn === 4) {
    if (numFleetsInSameHexAsCSF === 2 || numFleetsInSameHexAsUSDMCV === 2) {
      if (numFleetsInSameHexAsCSF === 2) {
        // Since Japan player allocates all hits in night battles
        // set player to Japan
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
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
  console.log(
    "attackUnitsOnDeck.length=",
    attackUnitsOnDeck,
    "GlobalInit.controller.isMidwayBaseDestroyed()=",
    GlobalInit.controller.isMidwayBaseDestroyed()
  )
  if (attackUnitsOnDeck.length === 0 || GlobalInit.controller.isMidwayBaseDestroyed()) {
    console.log("MIDWAY ATTACK NOT POSSIBLE")
    GlobalGameState.midwayAttackDeclaration = false
    return false
  } else {
    console.log("MIDWAY ATTACK POSSIBLE")

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
    if (csfLocation !== undefined && csfLocation.currentHex !== undefined && csfLocation.currentHex.q >= 6) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
        canMoveOffBoard = true
      }
    }
  } else {
    if (csfLocation !== undefined && csfLocation.currentHex !== undefined && csfLocation.currentHex.q >= 8) {
      // can move offboard
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
        canMoveOffBoard = true
      }
    }
    GlobalGameState.fleetSpeed = 2
    GlobalGameState.dmcvFleetSpeed = 1
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
      (usDMCVLocation.currentHex === undefined || usDMCVLocation.boxName === HexCommand.FLEET_BOX)
    ) {
      // both fleets have been removed from the map
      return {}
    }
    if (GlobalGameState.usDMCVFleetPlaced && usDMCVLocation !== undefined) {
      usDMCVRegions = allHexesWithinDistance(usDMCVLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
    } else {
      usDMCVRegions = allHexesWithinDistance(csfLocation.currentHex, 1, true)
    }
    if (csfLocation.currentHex !== undefined) {
      usDMCVRegions = removeHexFromRegion(usDMCVRegions, csfLocation.currentHex)
    }
  }
  return { canCSFMoveFleetOffBoard, canUSDMCVMoveFleetOffBoard, usCSFRegions, usDMCVRegions }
}

export function goToIJNFleetMovement({
  setUSMapRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setJpAlertShow,
  setEnabledJapanFleetBoxes,
}) {
  const enableOffMapBoxesJapan = testForOffMapBoxesJapan()
  setEnabledJapanFleetBoxes(enableOffMapBoxesJapan)
  setJapanMapRegions([])
  setUSMapRegions([])
  // if this is not turn 1 derive japan regions from position of fleet(s)
  if (GlobalGameState.gameTurn !== 1) {
    let locationOfCarrier = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    if (GlobalGameState.initial1AFLocation !== undefined) {
      locationOfCarrier = GlobalGameState.initial1AFLocation
    }
    let jpDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
    let jpMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

    console.log(">>>>>>>>> LOCATION OF CARRIER=", locationOfCarrier)
    if (locationOfCarrier !== undefined && locationOfCarrier.currentHex !== undefined) {
      // IJN 1AF Fleet is not allowed to move to same hex as other fleets, remove IJN-DMCV hex from region
      let jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, GlobalGameState.fleetSpeed, true)

      if (jpDMCVLocation !== undefined && jpDMCVLocation.currentHex !== undefined) {
        jpRegion = removeHexFromRegion(jpRegion, jpDMCVLocation.currentHex)
      }
      if (GlobalGameState.midwayAttackDeclaration === true) {
        let newHexArray = new Array()

        let hexesInRangeOfMidway = allHexesWithinDistance(Controller.MIDWAY_HEX.currentHex, 5, true)
        for (const hex1 of hexesInRangeOfMidway) {
          for (const hex2 of jpRegion) {
            if (hex2.q === hex1.q && hex2.r === hex1.r) {
              newHexArray.push(hex1)
            }
          }
        }

        jpRegion = newHexArray
      }
      setJapanMapRegions(jpRegion)

      if (GlobalGameState.initialMIFLocation !== undefined) {
        jpMIFLocation = GlobalGameState.initialMIFLocation
      }
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
    } else {
      if (GlobalGameState.initialMIFLocation !== undefined) {
        jpMIFLocation = GlobalGameState.initialMIFLocation
      }

      // 1AF is off board. Check to see if MIF is on the map.
      // If so, set regions according to its position
      if (jpMIFLocation !== undefined && jpMIFLocation.currentHex !== undefined) {
        let jpRegion = allHexesWithinDistance(jpMIFLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
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
export function dmcvState(side) {
  if (side === GlobalUnitsModel.Side.US) {
    const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
    if (usDMCVLocation !== undefined && usDMCVLocation.boxName === HexCommand.FLEET_BOX) {
      return false
    }
    return (
      (GlobalInit.controller.getDamagedCarriers(side).length > 0 && GlobalGameState.usDMCVFleetPlaced === false) ||
      (usDMCVLocation !== undefined && GlobalGameState.usDMCVFleetPlaced === true) // could be sunk
    )
  }
  if (GlobalGameState.jpDMCVCarrier === undefined) {
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

function goToCardPlay(cardNumber) {
  if (GlobalInit.controller.usHandContainsCard(cardNumber)) {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
  } else {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
  }
  GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
}

export async function setNextStateFollowingCardPlay(stateObject) {
  const {
    cardNumber,
    setCardNumber,
    setSearchValues,
    setSearchResults,
    setAirUnitUpdate,
    setStrikeGroupUpdate,
    setFleetUnitUpdate,
    setUsFleetRegions,
    setCarrierPlanesDitchPanelShow,
    setEndOfAirOpAlertShow,
    setMidwayWarningShow,
    setMidwayDialogShow,
    nextAction,
    capAirUnits,
    setEndOfTurnSummaryShow,
  } = stateObject
  GlobalGameState.dieRolls = []

  console.log(">>>>>>>>>>>>>>>>>> MOVING ON FROM CARD", cardNumber)
  GlobalGameState.cardsChecked.push(cardNumber)

  switch (cardNumber) {
    case -1:
      break
    case 1:
      if (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2)) {
        setCardNumber(() => 2)
        goToCardPlay(2)
      } else if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
        goToCardPlay(3)
      } else if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        goToCardPlay(4)
      } else {
        if (GlobalGameState.gameTurn === 7) {
          // determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow, 1)
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
        } else {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
        }
      }

      break
    case 2:
      if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
        goToCardPlay(3)
      } else if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        goToCardPlay(4)
      } else {
        if (GlobalGameState.gameTurn === 7) {
          // determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow, 2)
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
        } else {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
        }
      }
      break
    case 3:
      console.log("MOVE ON FROM CARD 3")
      if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        goToCardPlay(4)
      } else {
        if (GlobalGameState.gameTurn === 7) {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
          // determineMidwayInvasion(setCardNumber, setEndOfTurnSummarySho?w, -1)
        } else {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
          setEndOfTurnSummaryShow(true)
        }
      }
      break
    case 4:
      console.log("MOVE ON FROM CARD 4")
      if (GlobalGameState.gameTurn === 7) {
        // determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow, -1)
        setCardNumber(() => -1)
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
        GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      } else {
        // if playing this card has resulted in a DMCV carrier being sunk, need to remove
        // the DMCV Fleet from the map
        const carrier = GlobalInit.controller.getCarrier(GlobalGameState.currentCarrierAttackTarget)
        if (carrier && carrier.dmcv && GlobalInit.controller.isSunk(carrier.name)) {
          await removeDMCVFleetForCarrier(carrier.side, setFleetUnitUpdate)
        }
        // NOW US CARD 1 COMES INTO PLAY...
        const usPlayedCard4 = GlobalInit.controller.getCardPlayed(4, GlobalUnitsModel.Side.US)

        if (
          usPlayedCard4 &&
          carrier !== undefined &&
          carrier !== GlobalUnitsModel.Carrier.MIDWAY &&
          GlobalInit.controller.isSunk(carrier.name) &&
          GlobalInit.controller.usHandContainsCard(1)
        ) {
          setCardNumber(() => 1)
          goToCardPlay(1)
          return
        }
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
        GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      }
      break
    case 5:
      // Naval Bombardment
      if (GlobalGameState.gameTurn !== 4) {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
      } else {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
      }
      GlobalGameState.updateGlobalState()

      break
    case 6:
      // High Speed Reconnaissance
      if (GlobalGameState.gameTurn === 1) {
        GlobalGameState.usCardsDrawn = true
        if (isMidwayAttackPossible()) {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
          return
        } else {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
          GlobalGameState.usFleetMoved = false
          GlobalGameState.phaseCompleted = true
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
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
        }
        if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 5 || GlobalGameState.gameTurn === 7) {
          GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
          GlobalGameState.phaseCompleted = false
        }
      }
      break
    case 7:
      // Troubled Reconnaissance
      GlobalGameState.isFirstAirOp = true
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
      calcAirOpsPoints({ setSearchValues, setSearchResults })
      break
    case 8:
      // Semper Fi
      GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_INVASION
      break
    case 9:
      if (GlobalInit.controller.japanHandContainsCard(12)) {
        setCardNumber(() => 12)
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        setCardNumber(() => -1)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      }
      break
    case 10:
      // US Carrier Planes Ditch
      GlobalGameState.isFirstAirOp = true
      // await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
      // GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION

      await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
      setEndOfAirOpAlertShow(true)
      break

    case 11:
      setCarrierPlanesDitchPanelShow(false)

      console.log("GOING TO NEXT STATE AFTER CARD PLAY 11..................")
      // US Strike Lost
      // if the card was played we go back to AIR OPERATIONS
      // otherwise TARGET DETERMINATION
      setCardNumber(() => -1) // reset for next card play
      if (GlobalInit.controller.getCardPlayed(11, GlobalUnitsModel.Side.JAPAN)) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
      } else {
        GlobalGameState.currentPlayer = GlobalGameState.sideWithInitiative
        setUpAirAttack(GlobalInit.controller, location, GlobalGameState.attackingStrikeGroup, setCardNumber, true)
      }
      break
    case 12:
      // Elite Pilots
      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.testCapSelection = -1
        GlobalGameState.doneCapSelection = false
      } else {
        GlobalGameState.currentPlayer =
          GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
            ? GlobalUnitsModel.Side.JAPAN
            : GlobalUnitsModel.Side.US
      }
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      break

    case 13:
      setCardNumber(() => -1) // reset for next card play
      if (GlobalGameState.carrierTarget2 !== "" && GlobalGameState.carrierTarget2 !== undefined) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_2
      } else {
        await endOfAirOperation(capAirUnits, setAirUnitUpdate)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
        GlobalGameState.updateGlobalState()
      }
      break
    default:
      console.log("ERROR unknown card number: ", cardNumber)
  }
}
function decrementAirOpsPoints() {
  if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
    GlobalGameState.airOperationPoints.japan =
      GlobalGameState.airOperationPoints.japan > 0 ? GlobalGameState.airOperationPoints.japan - 1 : 0
  } else {
    GlobalGameState.airOperationPoints.us =
      GlobalGameState.airOperationPoints.us > 0 ? GlobalGameState.airOperationPoints.us - 1 : 0
  }

  GlobalGameState.phaseCompleted = true
}

export function determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow, currentCardNumber) {
  // before midway invasion, check cards playable at end of turn
  if (currentCardNumber !== -1) {
    if (
      currentCardNumber !== 1 &&
      GlobalInit.controller.usHandContainsCard(1) &&
      GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0
    ) {
      setCardNumber(() => 1)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      GlobalGameState.updateGlobalState()
      return
    }
    if (
      currentCardNumber !== 2 &&
      (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2))
    ) {
      setCardNumber(() => 2)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      GlobalGameState.updateGlobalState()
      return
    }
    if (
      currentCardNumber !== 3 &&
      (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3))
    ) {
      setCardNumber(() => 3)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      GlobalGameState.updateGlobalState()
      return
    }
    if (
      currentCardNumber !== 4 &&
      (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4))
    ) {
      setCardNumber(() => 4)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      GlobalGameState.updateGlobalState()
      return
    }
  }

  const jpMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

  // MIF Regions set separately
  if (jpMIFLocation !== undefined && jpMIFLocation.boxName !== HexCommand.FLEET_BOX) {
    const distance = distanceBetweenHexes(jpMIFLocation.currentHex, Controller.MIDWAY_HEX.currentHex)
    if (distance === 1) {
      if (GlobalInit.controller.usHandContainsCard(8)) {
        console.log(">>>>>>>>>>> SET CARD NUMBER To 8!!!!!!!!!!!!!!!!")
        setCardNumber(() => 8)
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        GlobalGameState.updateGlobalState()
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_INVASION
      }
    } else {
      setEndOfTurnSummaryShow(true)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_GAME
    }
  } else {
    setEndOfTurnSummaryShow(true)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_GAME
  }
}

export function endOfTurn() {
  return GlobalGameState.airOperationPoints.japan === 0 && GlobalGameState.airOperationPoints.us === 0
}

export function allFleetsSunk(side) {
  if (side === GlobalUnitsModel.Side.JAPAN) {
    const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    const mifLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
    const ijnDMCVLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

    return (
      af1Location.boxName === Command.FLEET_BOX &&
      mifLocation.boxName === Command.FLEET_BOX &&
      (ijnDMCVLocation === Command.FLEET_BOX || ijnDMCVLocation === undefined)
    )
  }
}

export async function removeMIFFleet(setFleetUnitUpdate) {
  const index1 = GlobalInit.controller.getNextAvailableFleetBox(GlobalUnitsModel.Side.JAPAN)
  const index2 = GlobalInit.controller.getNextAvailableFleetBox(GlobalUnitsModel.Side.US)

  let update1 = {
    name: "MIF",
    position: {
      currentHex: {
        boxName: HexCommand.FLEET_BOX,
        boxIndex: index1,
      },
    },
    initial: false,
    loading: false,
    side: GlobalUnitsModel.Side.JAPAN,
  }

  let update2 = {
    name: "MIF-USMAP",
    position: {
      currentHex: {
        boxName: HexCommand.FLEET_BOX,
        boxIndex: index2,
      },
    },
    initial: false,
    loading: false,
    side: GlobalUnitsModel.Side.US,
  }

  setFleetUnitUpdate(update1)
  await delay(1)
  setFleetUnitUpdate(update2)
  await delay(1)
  setFleetUnitUpdate({
    name: "",
    position: {},
  }) // reset to avoid updates causing problems for other markers
}

export async function checkRemoveDMCVFleet(side, setFleetUnitUpdate) {
  // BUG OF DMCV GOING TO FLEET BOX ERRONEOUSLY...
  // console.log("DEBUG US DMCV=", GlobalGameState.usDMCVCarrier)
  // console.log("DEBUG IJN DMCV=", GlobalGameState.jpDMCVCarrier)

  // console.log("DEBGUG CARRIER ATTACK TARGET=", GlobalGameState.currentCarrierAttackTarget)
  // if (
  //   side === GlobalUnitsModel.Side.US &&
  //   GlobalGameState.usDMCVCarrier !== GlobalGameState.currentCarrierAttackTarget
  // ) {
  //   return
  // }
  // if (
  //   side === GlobalUnitsModel.Side.JAPAN &&
  //   GlobalGameState.jpDMCVCarrier !== GlobalGameState.currentCarrierAttackTarget
  // ) {
  //   return
  // }
  if (GlobalInit.controller.allCarriersSunk(side, true)) {
    if (side === GlobalUnitsModel.Side.US) {
      GlobalGameState.allUSCarriersSunk = true
    } else {
      GlobalGameState.allJapanCarriersSunk = true
    }
    await delay(100)
    // 1. Create Fleet Update to remove the fleet marker for that side
    const update1 = createRemoveDMCVFleetUpdate(side)
    setFleetUnitUpdate(update1)

    await delay(100)
    // 2. Create Fleet Update to remove the fleet marker from the other side's map
    const update2 = createMapUpdateForFleet(GlobalInit.controller, update1.name, side)
    setFleetUnitUpdate(update2)

    // 3. Fire state update to display Fleet Removed alert
  }
}

export async function checkRemoveFleet(side, setFleetUnitUpdate) {
  console.log("CHECKING REMOVE FLEET")
  if (GlobalInit.controller.allCarriersSunkorDMCV(side, true)) {
    console.log("DEBUG US FLEET SUNK")
    if (side === GlobalUnitsModel.Side.US) {
      GlobalGameState.allUSCarriersSunk = true
    } else {
      GlobalGameState.allJapanCarriersSunk = true
    }
    // 1. Create Fleet Update to remove the fleet marker for that side
    await delay(10)

    const update1 = createRemoveFleetUpdate(side)
    setFleetUnitUpdate(update1)

    await delay(10)
    // 2. Create Fleet Update to remove the fleet marker from the other side's map
    const update2 = createMapUpdateForFleet(GlobalInit.controller, update1.name, side)
    setFleetUnitUpdate(update2)

    // 3. Fire state update to display Fleet Removed alert
  }
}
export async function tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate) {
  // if all carriers sunk remove fleet marker from map
  const otherSide =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  console.log("DEBUG CHECK REMOVE FLEET...")
  await checkRemoveFleet(otherSide, setFleetUnitUpdate)
  if (otherSide === GlobalUnitsModel.Side.US) {
    if (GlobalGameState.usDMCVCarrier !== "") {
      await checkRemoveDMCVFleet(otherSide, setFleetUnitUpdate)
    }
  } else {
    if (GlobalGameState.jpDMCVCarrier !== "") {
      await checkRemoveDMCVFleet(otherSide, setFleetUnitUpdate)
    }
  }

  await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative, setAirUnitUpdate)

  // reset SG attributes to allow that Strike Group and its boxes to be available
  await resetStrikeGroups(GlobalInit.controller, GlobalGameState.sideWithInitiative, setStrikeGroupUpdate)
  await GlobalInit.controller.setAllUnitsToNotMoved()
  decrementAirOpsPoints()
  GlobalGameState.sideWithInitiative = undefined
  GlobalGameState.updateGlobalState()
}

export function midwayOrAirOps() {
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
    GlobalGameState.midwayAirOpsCompleted = GlobalGameState.midwayAirOp
    console.log(">>>>>>>>>>> GO TO MIDWAY_ATTACK >>>>>>>>>>")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_ATTACK
  } else {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

// 1. For each unit in SG
//    (Use setValidDestinationBoxesNightOperations)
// 2. Display Night Landing panel -> determine damaage
// 3. Move return2 units to return1 box
// 4. Move return1 units to hangars of parent carriers
// 5. Move fighters to CAP/flight deck
// 6. Move attack aircraft to flight deck

// (ensure no flight deck is empty)
export async function endOfNightAirOperation(controller, setAirUnitUpdate, side) {
  // 1. Move CAP Units to Return 2 Box
  const capAirUnits = controller.getAllAirUnitsInCAPBoxes(side)

  await delay(10)

  if (capAirUnits.length > 0) {
    for (const unit of capAirUnits) {
      setValidDestinationBoxesNightOperations(controller, unit.name, side, true)
      const destBoxes = controller.getValidAirUnitDestinations(unit.name)

      await moveAirUnitNight(controller, unit, setAirUnitUpdate, destBoxes)

      console.log("DEBUG MOVE CAP UNIT:", unit.name, "DEST=", destBoxes)
      unit.border = false
    }
  }

  await delay(10)
  // Move Return 2 Units to Return 1
  const return2AirUnits = controller.getAllAirUnitsInReturn2Boxes(side)
  if (return2AirUnits.length > 0) {
    for (const unit of return2AirUnits) {
      setValidDestinationBoxesNightOperations(controller, unit.name, side, false)
      const destBoxes = controller.getValidAirUnitDestinations(unit.name)
      await delay(10)
      await moveAirUnitNight(controller, unit, setAirUnitUpdate, destBoxes)
    }
  }

  await delay(10)

  // Move Return 1 Units to Hangar
  const return1AirUnits = controller.getAllAirUnitsInReturn1Boxes(side)
  if (return1AirUnits.length > 0) {
    for (const unit of return1AirUnits) {
      setValidDestinationBoxesNightOperations(controller, unit.name, side, false)
      const destBoxes = controller.getValidAirUnitDestinations(unit.name)
      await moveAirUnitNight(controller, unit, setAirUnitUpdate, destBoxes)
    }
  }

  await moveAirUnitsFromHangarEndOfNightOperation(controller, side, setAirUnitUpdate)
}

export async function endOfAirOperation(capAirUnits, setAirUnitUpdate) {
  console.log("In endOfAirOperation().....GlobalGameState.taskForceTarget=", GlobalGameState.taskForceTarget)
  if (
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.JAPAN_DMCV &&
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.US_DMCV &&
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.MIF
  ) {
    if (capAirUnits) {
      await moveCAPtoReturnBox(GlobalInit.controller, capAirUnits, setAirUnitUpdate)
    }
  }

  const anySGsNotMoved = GlobalInit.controller.getStrikeGroupsNotMoved2(GlobalGameState.sideWithInitiative)

  if (!anySGsNotMoved) {
    await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative, setAirUnitUpdate)
  } else {
    return false
  }

  // RESET ELITE PILOTS FOR FUTURE AIR COMBATS
  GlobalGameState.elitePilots = false

  // ELIMIMINATE ORPHANED UNITS IN RETURN BOXES
  // (CAP RETURN TO BEGIN WITH)
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  await moveOrphanedCAPUnitsToEliminatedBox(sideBeingAttacked)
  await moveOrphanedAirUnitsInReturn1Boxes(sideBeingAttacked)

  // if (GlobalGameState.orphanedAirUnits.length > 0) {
  //   setEliminatedUnitsPanelShow(true)
  // }
  // 2. CHECK ALL INTERCEPTING CAP UNITS HAVE RETURNED TO CARRIERS

  const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(sideBeingAttacked)

  if (capUnitsReturning.length === 0) {
    return true
  }
  return false
}

export function displayAttackTargetPanel(controller) {
  if (
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.JAPAN_DMCV ||
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.US_DMCV
  ) {
    return false
  }
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIF) {
    return false
  }
  if (
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_17 ||
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY
  ) {
    return false
  }

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
    if (
      GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.AKAGI ||
      GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.KAGA
    ) {
      return false
    }
    if (controller.isSunk(GlobalUnitsModel.Carrier.AKAGI) || controller.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
      return false
    }
  }

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
    if (
      GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.HIRYU ||
      GlobalGameState.jpDMCVCarrier === GlobalUnitsModel.Carrier.SORYU
    ) {
      return false
    }
    if (controller.isSunk(GlobalUnitsModel.Carrier.HIRYU) || controller.isSunk(GlobalUnitsModel.Carrier.SORYU)) {
      return false
    }
  }

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
    if (
      GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.ENTERPRISE ||
      GlobalGameState.usDMCVCarrier === GlobalUnitsModel.Carrier.HORNET
    ) {
      return false
    }
    if (
      controller.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE, true) ||
      controller.isSunk(GlobalUnitsModel.Carrier.HORNET, true)
    ) {
      return false
    }
  }
  return true
}

export async function removeDMCVFleetForCarrier(side, setFleetUnitUpdate) {
  let update1 = {
    position: {},
  }
  let update2 = {
    position: {},
  }

  // update1.position.currentHex = HexCommand.OFFBOARD
  // update2.position.currentHex = HexCommand.OFFBOARD
  update1.position.currentHex = HexCommand.FLEET_BOX
  update2.position.currentHex = HexCommand.FLEET_BOX

  if (side === GlobalUnitsModel.Side.US) {
    update1.name = "US-DMCV-JPMAP"
    update2.name = "US-DMCV"
  } else {
    update1.name = "IJN-DMCV-USMAP"
    update2.name = "IJN-DMCV"
  }
  update1.initial = false
  update2.initial = false

  console.log("UPDATE1=", update1)
  console.log("UPDATE2=", update2)

  setFleetUnitUpdate(update1)
  await delay(20)
  setFleetUnitUpdate(update2)
  await delay(20)
  setFleetUnitUpdate({
    name: "",
    position: {},
  }) // reset to avoid updates causing problems for other markers
}

export async function removeCarrierFleetToOffMapBox(side, setFleetUnitUpdate) {
  let update1 = {
    position: {},
  }
  let update2 = {
    position: {},
  }

  update1.position.currentHex = HexCommand.FLEET_BOX
  update2.position.currentHex = HexCommand.FLEET_BOX

  if (side === GlobalUnitsModel.Side.US) {
    const index1 = GlobalInit.controller.getNextAvailableFleetBox(GlobalUnitsModel.Side.US)

    update1 = {
      name: "CSF-JPMAP",
      position: {
        currentHex: {
          boxName: HexCommand.FLEET_BOX,
          boxIndex: index1,
        },
      },
      initial: false,
      loading: false,
      side: GlobalUnitsModel.Side.JAPAN,
    }
    update2 = {
      name: "CSF",
      position: {
        currentHex: {
          boxName: HexCommand.FLEET_BOX,
          boxIndex: index1,
        },
      },
      initial: false,
      loading: false,
      side: GlobalUnitsModel.Side.US,
    }
  } else {
    update1 = {
      name: "1AF-USMAP",
      position: {
        currentHex: {
          boxName: HexCommand.FLEET_BOX,
          boxIndex: index1,
        },
      },
      initial: false,
      loading: false,
      side: GlobalUnitsModel.Side.US,
    }
    update2 = {
      name: "1AF",
      position: {
        currentHex: {
          boxName: HexCommand.FLEET_BOX,
          boxIndex: index1,
        },
      },
      initial: false,
      loading: false,
      side: GlobalUnitsModel.Side.JAPAN,
    }
  }
  update1.initial = false
  update2.initial = false

  setFleetUnitUpdate(update1)
  await delay(1)
  setFleetUnitUpdate(update2)
  await delay(1)
  setFleetUnitUpdate({
    name: "",
    position: {},
  }) // reset to avoid updates causing problems for other markers
}

export async function rollZeDice() {
  await delay(300)
  GlobalGameState.rollDice = false
  GlobalGameState.updateGlobalState()

  await delay(1)
  GlobalGameState.rollDice = true
  GlobalGameState.updateGlobalState()
}

export async function moveCAPUnitsFromReturnBoxToCarrier(controller, side, setAirUnitUpdate) {
  const capUnitsReturning = controller.getAllCAPDefendersInCAPReturnBoxes(side)

  console.log("DEBUG CAP UNITS RETURNING=", capUnitsReturning)
  for (const unit of capUnitsReturning) {
    const parentCarrier = controller.getCarrierForAirUnit(unit.name)

    let destinationsArray = getValidUSDestinationsCAP(controller, parentCarrier, side, unit.name)

    console.log(unit.name, "-> DESTINATIONS=", destinationsArray)
    await delay(10)
    // go to first available destination

    // if destinations array is of length 0 nowhere for this CAP Unit to go
    // ORPHAN -> eliminate

    if (destinationsArray.length === 0) {
      await moveOrphanedCAPUnitsToEliminatedBox(side)
      continue
    }

    let update = {
      name: unit.name,
      boxName: destinationsArray[0],
    }

    if (unit.parentCarrier === GlobalUnitsModel.Carrier.MIDWAY) {
      update.index = controller.getFirstAvailableZoneMidway(update.boxName)
    } else {
      update.index = controller.getFirstAvailableZone(update.boxName)
    }
    if (update.index === -1 && destinationsArray.length > 1) {
      update.boxName = destinationsArray[1]
    }
    if (unit.parentCarrier === GlobalUnitsModel.Carrier.MIDWAY) {
      update.index = controller.getFirstAvailableZoneMidway(update.boxName)
    } else {
      update.index = controller.getFirstAvailableZone(update.boxName)
    }
    if (update.index === -1 && destinationsArray.length > 2) {
      update.boxName = destinationsArray[2]
    }
    if (unit.parentCarrier === GlobalUnitsModel.Carrier.MIDWAY) {
      update.index = controller.getFirstAvailableZoneMidway(update.boxName)
    } else {
      update.index = controller.getFirstAvailableZone(update.boxName)
    }
    let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)

    if (position1 === undefined) {
      // orphaned CAP Unit, ignore
      continue
    }
    update.position = position1.offsets[update.index]

    console.log("DO CAP UNIT UPDATE:", update)
    update.handle = 8

    setAirUnitUpdate(update)
    await delay(10)
  }
}

export async function midwayPossible(controller, setMidwayWarningShow, setMidwayDialogShow) {
  // if there are no attack planes on deck cannot attack Midway
  // otherwise display the attack declaration dialog
  const attackUnitsOnDeck = controller.getAllUnitsOnJapaneseFlightDecks(false)
  console.log("QUACK GlobalInit.controller.isMidwayBaseDestroyed()=", GlobalInit.controller.isMidwayBaseDestroyed())
  if (attackUnitsOnDeck.length === 0 || GlobalInit.controller.isMidwayBaseDestroyed()) {
    GlobalGameState.midwayAttackDeclaration = false
    setMidwayWarningShow(true)
  } else {
    setMidwayDialogShow(true)
  }
}

export function japanDMCVPlanningHandler({
  setUSMapRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setJpAlertShow,
  setEnabledJapanFleetBoxes,
}) {
  goToIJNFleetMovement({
    setUSMapRegions,
    setJapanMapRegions,
    setJapanMIFMapRegions,
    setJpAlertShow,
    setEnabledJapanFleetBoxes,
  })

  // if DMCV placed but not moved stay in this state otherwise move on
  // if (GlobalGameState.jpDMCVFleetPlaced && !GlobalGameState.jpDMCVFleetMoved) {
  //   console.log("MORE IJN...")
  //   setJapanFleetRegions()
  // } else {
  // goToMidwayAttackOrUSFleetMovement({ setMidwayNoAttackAlertShow, setJapanMapRegions, setFleetUnitUpdate })
  // }
}

function locationsEqual(locationA, locationB) {
  if (
    locationA === undefined ||
    locationB === undefined ||
    locationA.currentHex === undefined ||
    locationB.currentHex === undefined
  ) {
    return false
  }
  return locationA.currentHex.q === locationB.currentHex.q && locationA.currentHex.r === locationB.currentHex.r
}

function carriersSunkForSide(side) {
  return GlobalInit.controller.allCarriersSunk(side)
}

async function removeSunkenFleet(side, setFleetUnitUpdate) {
  // 1. Create Fleet Update to remove the fleet marker for that side
  const update1 = createRemoveFleetUpdate(side)
  setFleetUnitUpdate(update1)

  await delay(10)
  // 2. Create Fleet Update to remove the fleet marker from the other side's map
  const update2 = createMapUpdateForFleet(GlobalInit.controller, update1.name, side)
  setFleetUnitUpdate(update2)
}

export async function doFleetUpdates(setFleetUnitUpdate) {
  // check if either fleet out of carriers
  GlobalGameState.allUSCarriersSunk = carriersSunkForSide(GlobalUnitsModel.Side.US)
  GlobalGameState.allJapanCarriersSunk = carriersSunkForSide(GlobalUnitsModel.Side.JAPAN)

  if (GlobalGameState.allUSCarriersSunk) {
    await removeSunkenFleet(GlobalUnitsModel.Side.US, setFleetUnitUpdate)
  }
  if (GlobalGameState.allJapanCarriersSunk) {
    await removeSunkenFleet(GlobalUnitsModel.Side.JAPAN, setFleetUnitUpdate)
  }
  const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const csfLocationJpMap = GlobalInit.controller.getFleetLocation("CSF-JPMAP", GlobalUnitsModel.Side.JAPAN)

  if (!locationsEqual(csfLocation, csfLocationJpMap)) {
    if (csfLocation.currentHex !== undefined) {
      const update1 = createFleetUpdate("CSF-JPMAP", csfLocation.currentHex.q, csfLocation.currentHex.r)
      if (update1 !== null) {
        setFleetUnitUpdate(update1)
      }
      await delay(1)
    }
  }

  // compare position of US-DMCV with US-DMCV-JPMAP
  // if different -> do update
  const dmcvLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
  const dmcvLocationJpMap = GlobalInit.controller.getFleetLocation("US-DMCV-JPMAP", GlobalUnitsModel.Side.JAPAN)

  if (
    dmcvLocation !== undefined &&
    dmcvLocation.boxName === HexCommand.FLEET_BOX &&
    dmcvLocationJpMap !== HexCommand.FLEET_BOX
  ) {
    const index1 = GlobalInit.controller.getNextAvailableFleetBox(GlobalUnitsModel.Side.US)

    let update1 = {
      name: "US-DMCV-JPMAP",
      position: {
        currentHex: {
          boxName: HexCommand.FLEET_BOX,
          boxIndex: index1,
        },
      },
      initial: false,
      loading: false,
      side: GlobalUnitsModel.Side.JAPAN,
    }
    if (update1 !== null) {
      setFleetUnitUpdate(update1)
    }
    await delay(1)
    return
  }
  if (
    dmcvLocation !== undefined &&
    dmcvLocationJpMap !== undefined &&
    dmcvLocation.currentHex !== undefined &&
    dmcvLocation !== HexCommand.OFFBOARD &&
    dmcvLocation !== HexCommand.OFFBOARD
  ) {
    if (!locationsEqual(dmcvLocation, dmcvLocationJpMap)) {
      const update1 = createFleetUpdate("US-DMCV-JPMAP", dmcvLocation.currentHex.q, dmcvLocation.currentHex.r)
      if (update1 !== null) {
        // going to 2,1
        setFleetUnitUpdate(update1)
      }
      await delay(1)
    }
  }

  if (dmcvLocation !== undefined) {
    const update1 = createFleetUpdate("US-DMCV-JPMAP", dmcvLocation.currentHex.q, dmcvLocation.currentHex.r)
    if (update1 !== null) {
      // going to 2,1
      setFleetUnitUpdate(update1)
    }
    await delay(1)
  }
}
export async function getFleetsForDMCVSeaBattle(controller, setJpFleet, setUsFleet) {
  const usDMCVLocation = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

  let fleetsInSameHexAsUSDMCV = new Array()
  if (usDMCVLocation !== undefined) {
    fleetsInSameHexAsUSDMCV = controller.getAllFleetsInLocation(usDMCVLocation, GlobalUnitsModel.Side.US, false)
    if (fleetsInSameHexAsUSDMCV.length === 2) {
      setUsFleet("US-DMCV")
      if (fleetsInSameHexAsUSDMCV[0].name === "US-DMCV") {
        setJpFleet(fleetsInSameHexAsUSDMCV[1].name)
      } else {
        setJpFleet(fleetsInSameHexAsUSDMCV[0].name)
      }
    }
  }
  return { fleetsInSameHexAsUSDMCV }
}

function setRetreatRegions(location, setUSMapRegions, fleet) {
  // For the given location, get list of all surrounding hexes
  let hexes = allHexesWithinDistance(location.currentHex, 1, true)
  // traverse the list of hexes, check if any fleets there, if so remove

  const regions = new Array()
  for (let h of hexes) {
    let hex = {
      currentHex: {
        q: h.q,
        r: h.r,
      },
    }
    const fleets = GlobalInit.controller.getAllFleetsInLocation(hex, GlobalUnitsModel.Side.US, false)
    if (fleets.length === 0) {
      regions.push(h)
    }
  }

  // TODO IF AI return regions
  if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI) {
    return regions
  }

  // there is a tiny chance of no available hexes for four of the top row hexes -> move somewhere @TODO QUACK

  // set US Regions to allow drag and drop into this hex
  setUSMapRegions(regions)

  // set gamePhaseCompleted to false until no more fleets to move
  GlobalGameState.phaseCompleted = false
  GlobalGameState.retreatFleet = fleet

  // will probably need to do the check for fleets in same hex a second time
}

async function retreatOneHexTo(hex, fleet, setFleetUnitUpdate) {
  const q = hex.q
  const r = hex.r

  const update1 = createFleetUpdate(fleet, q, r)
  if (update1 !== null) {
    setFleetUnitUpdate(update1)
  }
  await delay(1)
  const update2 = createFleetUpdate(fleet + "-JPMAP", q, r)
  if (update2 !== null) {
    setFleetUnitUpdate(update2)
  }
}

export async function checkFleetsInSameHex(
  controller,
  setFleetUnitUpdate,
  setPreviousPosition,
  previousPosition,
  setUSMapRegions
) {
  const { numFleetsInSameHexAsCSF, numFleetsInSameHexAsUSDMCV } = controller.opposingFleetsInSameHex()
  // 1. loop through US Fleets

  // 2.   get location of fleet

  // 3.   if in same hex as any Japanese fleet
  let usMapRegions

  GlobalGameState.phaseCompleted = true

  if (numFleetsInSameHexAsUSDMCV === 2) {
    // USDMCV can only move 1 hex - go to start position
    const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
    const usDMCVStartLocation = previousPosition.get("US-DMCV")
    const distanceMoved = distanceBetweenHexes(usDMCVStartLocation.currentHex, usDMCVLocation.currentHex)

    if (distanceMoved === 1) {
      if (previousPosition !== HexCommand.OFFBOARD) {
        // if start hex is not occuped go back there
        const fleets = GlobalInit.controller.getAllFleetsInLocation(
          usDMCVStartLocation,
          GlobalUnitsModel.Side.US,
          false
        )
        if (fleets.length === 0) {
          await retreatOneHexTo(usDMCVStartLocation.currentHex, "US-DMCV", setFleetUnitUpdate)
        } else {
          // setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
          if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
            setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
          } else {
            usMapRegions = setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
            const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
            await retreatOneHexTo(retreatHex, "US-DMCV", setFleetUnitUpdate)
          }
        }
      }
    } else {
      // setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
      if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
        setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
      } else {
        usMapRegions = setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
        const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
        await retreatOneHexTo(retreatHex, "US-DMCV", setFleetUnitUpdate)
      }
      return
    }
  }

  if (numFleetsInSameHexAsCSF === 2) {
    const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    const usStartLocation = previousPosition.get("CSF")
    const distanceMoved = distanceBetweenHexes(usStartLocation.currentHex, csfLocation.currentHex)

    // ----------------------------------------------------
    // TODO IF AI SELECT A RETREAT HEX AT RANDOM
    // ----------------------------------------------------
    if (distanceMoved === 2) {
      console.log("CFS MOVED 2 HEXES")
      let hexes = interveningHexes(usStartLocation.currentHex, csfLocation.currentHex)
      if (hexes.length === 1) {
        // one intervening hex
        let hex = {
          currentHex: {
            q: hexes[0].q,
            r: hexes[0].r,
          },
        }
        const fleets = controller.getAllFleetsInLocation(hex, GlobalUnitsModel.Side.US, false)
        if (fleets.length === 0) {
          await retreatOneHexTo(hex.currentHex, "CSF", setFleetUnitUpdate)
        } else {
          // go to region selection for human or random for AI
          if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
            setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
          } else {
            usMapRegions = setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
            const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
            await retreatOneHexTo(retreatHex, "CSF", setFleetUnitUpdate)
          }
        }
      } else if (hexes.length == 2) {
        // two possible intervening hexes
        let hex1 = {
          currentHex: {
            q: hexes[0].q,
            r: hexes[0].r,
          },
        }
        let hex2 = {
          currentHex: {
            q: hexes[1].q,
            r: hexes[1].r,
          },
        }
        console.log(">>>>>>>>> hex1=", hex1, "hex2=", hex2)
        const fleetsHex1 = GlobalInit.controller.getAllFleetsInLocation(hex1, GlobalUnitsModel.Side.US, false)
        const fleetsHex2 = GlobalInit.controller.getAllFleetsInLocation(hex2, GlobalUnitsModel.Side.US, false)
        // 1. hex1 occupied, hex2 unoccupied -> move to hex2

        if (
          fleetsHex1.length === 0 &&
          fleetsHex2.length === 0 &&
          GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI
        ) {
          let oneOrZero = Math.random() >= 0.5 ? 1 : 0
          if (oneOrZero === 0) {
            await retreatOneHexTo(hex1.currentHex, "CSF", setFleetUnitUpdate)
          } else {
            await retreatOneHexTo(hex2.currentHex, "CSF", setFleetUnitUpdate)
          }
        } else if (fleetsHex1.length === 1 && fleetsHex2.length === 0) {
          await retreatOneHexTo(hex2.currentHex, "CSF", setFleetUnitUpdate)
        } else if (fleetsHex1.length === 0 && fleetsHex2.length === 1) {
          // 2. hex1 unoccupied, hex2 occupied -> move to hex1
          await retreatOneHexTo(hex1.currentHex, "CSF", setFleetUnitUpdate)
        } else if (fleetsHex1.length == fleetsHex2.length) {
          // setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
          // go to region selection for human or random for AI
          if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
            setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
          } else {
            usMapRegions = setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
            const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
            await retreatOneHexTo(retreatHex, "CSF", setFleetUnitUpdate)
          }
        }

        // 3. hex2 occupied, hex1 occupied -> region selection
        // 4. hex1 unoccupied, hex2 unoccupied -> region selection
      } else {
        // rare case where there has been a sea battle at night and the CSF has moved > 3 hexes
        // setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
        // go to region selection for human or random for AI
        if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
          setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
        } else {
          usMapRegions = setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
          const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
          await retreatOneHexTo(retreatHex, "CSF", setFleetUnitUpdate)
        }
      }
    } else if (distanceMoved === 1) {
      // if start hex is not occuped go back there
      const fleets = GlobalInit.controller.getAllFleetsInLocation(usStartLocation, GlobalUnitsModel.Side.US, false)
      if (fleets.length === 0) {
        await retreatOneHexTo(usStartLocation.currentHex, "CSF", setFleetUnitUpdate)
      } else {
        // else region selection
        // go to region selection for human or random for AI
        if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
          setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
        } else {
          usMapRegions = setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
          const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
          await retreatOneHexTo(retreatHex, "CSF", setFleetUnitUpdate)
        }
        // setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
      }
    } else {
      // hasn't moved - region selection
      // go to region selection for human or random for AI
      if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
        setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
      } else {
        usMapRegions = setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
        console.log("REGIONS=", usMapRegions)
        const retreatHex = usMapRegions[Math.floor(Math.random() * usMapRegions.length)]
        console.log("\t=> retreat hex=", retreatHex)
        await retreatOneHexTo(retreatHex, "CSF", setFleetUnitUpdate)
      }
      // setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
    }
  }

  //        determine distance US Fleet has moved
  //        if 2
  //          get intervening hexes between current location and starting location (if any)
  //          if single unoccupied location move there
  //          if two unoccupied locatios move to either
  //          if no unoccupied locations set US regions to all adjacent unoccupied hexes
  //            and allow drag and drop
  //        if 1
  //          if start hex unoccupied move back

  //        if no unoccupied hexes or distance moved == 0
  //          set US Regions to all eligible adjavent hexes
  //          wait for move

  // leave game state at RETREAT and return
  setPreviousPosition(() => new Map())
  // nextAction()
}

export async function midwayTidyUp(setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate) {
  autoSave(GlobalInit.controller, GlobalUnitsModel.Side.JAPAN)

  await resetStrikeGroups(GlobalInit.controller, GlobalGameState.sideWithInitiative, setStrikeGroupUpdate)

  await GlobalInit.controller.setAllUnitsToNotMoved()

  GlobalGameState.airOperationPoints.japan = 0

  GlobalGameState.phaseCompleted = true
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
  setJapanStrikePanelEnabled(false)
  setUSMapRegions([])
  GlobalGameState.usFleetMoved = false
  GlobalGameState.dieRolls = []
  GlobalGameState.taskForceTarget = undefined
}

export function cardEventHandler(cardNumber, side) {
  const title = allCards[cardNumber - 1].title
  GlobalInit.controller.viewEventHandler({
    type: Controller.EventTypes.CARD_PLAY,
    data: {
      number: cardNumber,
      title,
      side,
    },
  })
}
