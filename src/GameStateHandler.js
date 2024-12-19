import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import { createFleetUpdate, createMapUpdateForFleet, createRemoveFleetUpdate } from "./AirUnitTestData"
import Controller from "./controller/Controller"
import { setUpAirAttack } from "./controller/AirAttackHandler"
import {
  usCSFStartHexes,
  japanAF1StartHexesNoMidway,
  japanAF1StartHexesMidway,
  japanMIFStartHexes,
} from "./components/MapRegions"
import { calculateSearchValues, calculateSearchResults } from "./model/SearchValues"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"
import {
  moveCAPtoReturnBox,
  setStrikeGroupAirUnitsToNotMoved,
  moveOrphanedCAPUnitsToEliminatedBox,
  moveOrphanedAirUnitsInReturn1Boxes,
  resetStrikeGroups,
} from "./controller/AirOperationsHandler"
import { delay, getNumEscortFighterSteps } from "./DiceHandler"
import {
  allHexesWithinDistance,
  distanceBetweenHexes,
  removeHexFromRegion,
  interveningHexes,
} from "./components/HexUtils"
import HexCommand from "./commands/HexCommand"
import { faSlash } from "@fortawesome/free-solid-svg-icons"

function japanSetUpHandler() {
  if (GlobalGameState.currentCarrier <= 2) {
    GlobalGameState.currentCarrier++
    GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
  } else {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
    GlobalInit.controller.drawJapanCards(3, true)
    GlobalGameState.jpCardsDrawn = true
  }
  GlobalGameState.phaseCompleted = false
}

function japanCardDrawHandler({ setUSMapRegions, setCSFAlertShow }) {
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_FLEET
  GlobalGameState.currentCarrier = 0
  setUSMapRegions(usCSFStartHexes)
  setCSFAlertShow(true)
  GlobalGameState.phaseCompleted = false
}

function usCardDrawHandler({ setMidwayDialogShow, setMidwayWarningShow, setCardNumber }) {
  if (GlobalGameState.gameTurn != 1) {
    if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
    }
  } else {
    GlobalGameState.usCardsDrawn = true
    if (GlobalInit.controller.japanHandContainsCard(6)) {
      setCardNumber(() => 6)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
      midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
    }
  }
  GlobalGameState.phaseCompleted = true
}
function setupUSFleetHandler({ setUSMapRegions }) {
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
  GlobalGameState.usFleetPlaced = true
  setUSMapRegions([])
  GlobalGameState.phaseCompleted = false
}

async function setNextStateFollowingCardPlay({
  cardNumber,
  setCardNumber,
  setMidwayDialogShow,
  setSearchValues,
  setSearchResults,
  setSearchValuesAlertShow,
  setAirUnitUpdate,
  setStrikeGroupUpdate,
  setEndOfAirOpAlertShow,
  setEndOfTurnSummaryShow,
  capAirUnits,
  setFleetUnitUpdate,
  setEliminatedUnitsPanelShow,
  midwayDeclarationHandler,
  setUsFleetRegions,
  setMidwayWarningShow,
}) {
  GlobalGameState.dieRolls = []

  console.log("PANTS!!!!!!!!!!!!!!!!!")
  switch (cardNumber) {
    case -1:
      break

    case 0:
      if (GlobalGameState.gameTurn !== 4) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
        midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
      } else {
        midwayDeclarationHandler({ setUsFleetRegions })
      }
      break

    case 1:
      if (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2)) {
        setCardNumber(() => 2)
      } else if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
      } else if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
      } else {
        if (GlobalGameState.gameTurn === 7) {
          determineMidwayInvasion(setCardNumber,setEndOfTurnSummaryShow, 1)
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
          setEndOfTurnSummaryShow(true)
        }
      }
      break

    case 2:
      console.log("PANTS 1")
      if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
      } else if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
      } else {
        if (GlobalGameState.gameTurn === 7) {
          console.log("PANTS 2")

          determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow, 2)
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
          setEndOfTurnSummaryShow(true)
        }
      }
      break

    case 3:
      if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
      } else {
        if (GlobalGameState.gameTurn === 7) {
          determineMidwayInvasion(setCardNumber,setEndOfTurnSummaryShow, 3)
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
          setEndOfTurnSummaryShow(true)
        }
      }
      break

    case 4:
      if (GlobalGameState.gameTurn === 7) {
        determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow, 4)
      } else {
        // if playing this card has resulted in a DMCV carrier being sunk, need to remove
        // the DMCV Fleet from the map
        const carrier = GlobalInit.controller.getCarrier(GlobalGameState.currentCarrierAttackTarget)
        if (carrier && carrier.dmcv && GlobalInit.controller.isSunk(carrier.name)) {
          await removeDMCVFleetForCarrier(carrier.side, setFleetUnitUpdate)
        }

        GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
        setEndOfTurnSummaryShow(true)
      }
      break
    case 5:
      // Naval Bombardment
      if (GlobalGameState.gameTurn !== 4) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
        midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
      } else {
        midwayDeclarationHandler({ setUsFleetRegions })
      }
      break

    case 6:
      // High Speed Reconnaissance
      if (GlobalGameState.gameTurn === 1) {
        GlobalGameState.usCardsDrawn = true
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
        midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
        return
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
    case 7:
      // Troubled Reconnaissance
      GlobalGameState.isFirstAirOp = true
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
      calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
      setSearchValuesAlertShow(true)
      break

    case 8:
      // Semper Fi
      GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_INVASION
      break

    case 9:
      // Escort Separated

      setCardNumber(() => -1) // reset for next card play
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION

      break
    case 10:
      // US Carrier Planes Ditch
      await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
      setEndOfAirOpAlertShow(true)
      break

    case 11:
      // US Strike Lost
      // if the card was played we go back to AIR OPERATIONS
      // otherwise either TARGET DETERMINATION or FLEET SELECTION
      setCardNumber(() => -1) // reset for next card play
      if (GlobalInit.controller.getCardPlayed(11, GlobalUnitsModel.Side.JAPAN)) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
      } else {
        console.log("SET UP AIR ATTACK! FUCKING SHIT")
        setUpAirAttack(GlobalInit.controller, location, GlobalGameState.attackingStrikeGroup, setCardNumber, true)
      }
      break

    case 12:
      // Elite Pilots
      if (GlobalInit.controller.getCardPlayed(12, GlobalUnitsModel.Side.JAPAN)) {
        if (GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.MIDWAY) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
        }
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      }
      break
    case 13:
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
function setupUSAirHandler() {
  GlobalGameState.currentCarrier++
  GlobalGameState.currentTaskForce =
    GlobalGameState.currentCarrier <= 1 ? 1 : GlobalGameState.currentCarrier === 2 ? 2 : 3 // 3 is Midway
  if (GlobalGameState.currentCarrier === 4) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_CARD_DRAW
    GlobalGameState.usSetUpComplete = true
    GlobalInit.controller.drawUSCards(2, true)
    GlobalGameState.usCardsDrawn = true
  }
  GlobalGameState.phaseCompleted = false
}

function dmcvState(side) {
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
function midwayDeclarationHandler({ setUsFleetRegions }) {
  console.log("FINISHED MIDWAY DECLARATION...")
  if (dmcvState(GlobalUnitsModel.Side.US)) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
    GlobalGameState.usDMCVFleetMoved = false
    GlobalGameState.phaseCompleted = true // placing DMCV is not mandatory
    setUsFleetRegions()
  } else {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
    GlobalGameState.usFleetMoved = false
    setUsFleetRegions()
    GlobalGameState.phaseCompleted = true
  }
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
function goToIJNFleetMovement({
  setUSMapRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setJpAlertShow,
  setEnabledJapanFleetBoxes,
}) {
  GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
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

      // If Midway attack declared, 1AF must move to within 5 hexes
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
function usDMCVPlanningHandler({ setUsFleetRegions, setFleetUnitUpdate }) {
  doFleetUpdates(setFleetUnitUpdate)
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  GlobalGameState.usFleetMoved = false
  setUsFleetRegions()
  GlobalGameState.phaseCompleted = true
}

function japanDMCVPlanningHandler({
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
function usFleetMovementPlanningHandler({
  setJapanFleetRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setUSMapRegions,
  setJpAlertShow,
  setEnabledUSFleetBoxes,
  setEnabledJapanFleetBoxes,
}) {
  console.log("END OF US Fleet Movement PLANNING Phase")
  goToJapanDMCVMovement({
    setJapanFleetRegions,
    setJapanMapRegions,
    setJapanMIFMapRegions,
    setUSMapRegions,
    setJpAlertShow,
    setEnabledUSFleetBoxes,
    setEnabledJapanFleetBoxes,
  })
}

async function goToMidwayAttackOrUSFleetMovement({
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

function goToJapanDMCVMovement({
  setJapanFleetRegions,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setUSMapRegions,
  setJpAlertShow,
  setEnabledUSFleetBoxes,
  setEnabledJapanFleetBoxes,
}) {
  console.log("END OF US Fleet Movement Phase")
  if (
    dmcvState(GlobalUnitsModel.Side.JAPAN) &&
    GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  ) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
    GlobalGameState.jpDMCVFleetMoved = false
    GlobalGameState.phaseCompleted = true // placing DMCV is not mandatory
    setUSMapRegions([])
    setJapanFleetRegions()
    setEnabledUSFleetBoxes(false)
  } else {
    goToIJNFleetMovement({
      setUSMapRegions,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setJpAlertShow,
      setEnabledJapanFleetBoxes,
    })
  }
}

function calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow }) {
  // work out distances between fleets
  const sv = calculateSearchValues(GlobalInit.controller)

  // use distances to calculate Ops Points
  const sr = calculateSearchResults(GlobalInit.controller, {
    jp_af: Math.max(0, sv.jp_af),
    us_csf: sv.us_csf,
    us_midway: sv.us_midway,
  })

  setSearchValues(sv)
  GlobalGameState.airOperationPoints.japan = sr.JAPAN
  GlobalGameState.airOperationPoints.us = sr.US
  setSearchResults(sr)
  setSearchValuesAlertShow(true)
}

export function calcAirOpsPointsMidway(distanceFromFleetToMidway) {
  if (distanceFromFleetToMidway <= 2) {
    GlobalGameState.airOperationPoints.japan = 1
  } else if (distanceFromFleetToMidway <= 5) {
    GlobalGameState.airOperationPoints.japan = 2
  } else {
    // error do nothing for now
  }
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
    if (controller.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE) || controller.isSunk(GlobalUnitsModel.Carrier.HORNET)) {
      return false
    }
  }
  return true
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
  // update1.position.currentHex.boxName = HexCommand.FLEET_BOX
  // update1.name = "MIF"
  // update1.side = GlobalUnitsModel.Side.JAPAN

  // update2.position.currentHex.boxName = HexCommand.FLEET_BOX
  // update2.name = "MIF-USMAP"
  // update2.side = GlobalUnitsModel.Side.US

  // update1.initial = false
  // update2.initial = false

  // update1.loading = false
  // update2.loading = false

  setFleetUnitUpdate(update1)
  await delay(1)
  setFleetUnitUpdate(update2)
  await delay(1)
  setFleetUnitUpdate({
    name: "",
    position: {},
  }) // reset to avoid updates causing problems for other markers
}
async function removeDMCVFleetForCarrier(side, setFleetUnitUpdate) {
  let update1 = {
    position: {},
  }
  let update2 = {
    position: {},
  }

  update1.position.currentHex = HexCommand.OFFBOARD
  update2.position.currentHex = HexCommand.OFFBOARD

  if (side === GlobalUnitsModel.Side.US) {
    update1.name = "US-DMCV-JPMAP"
    update2.name = "US-DMCV"
  } else {
    update1.name = "IJN-DMCV-USMAP"
    update2.name = "IJN-DMCV"
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

async function usFleetMovementHandler({ setFleetUnitUpdate }) {
  const update1 = createMapUpdateForFleet(GlobalInit.controller, "CSF", GlobalUnitsModel.Side.US)
  let update2 = null
  if (GlobalUnitsModel.usDMCVCarrier !== undefined) {
    update2 = createMapUpdateForFleet(GlobalInit.controller, "US-DMCV", GlobalUnitsModel.Side.US)
  }

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

async function doFleetUpdates(setFleetUnitUpdate) {
  // check if either the US CSF or DMCV fleets have moved

  // compare position of CSF with CSF-JPMAP
  // if different -> do update
  const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const csfLocationJpMap = GlobalInit.controller.getFleetLocation("CSF-JPMAP", GlobalUnitsModel.Side.JAPAN)

  if (!locationsEqual(csfLocation, csfLocationJpMap)) {
    const update1 = createFleetUpdate("CSF-JPMAP", csfLocation.currentHex.q, csfLocation.currentHex.r)
    if (update1 !== null) {
      setFleetUnitUpdate(update1)
    }
    await delay(1)
  }

  // compare position of US-DMCV with US-DMCV-JPMAP
  // if different -> do update
  const dmcvLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
  const dmcvLocationJpMap = GlobalInit.controller.getFleetLocation("US-DMCV-JPMAP", GlobalUnitsModel.Side.JAPAN)
  console.log("dmcvLocation=", dmcvLocation)
  console.log("dmcvLocationJpMap=", dmcvLocationJpMap)

  if (dmcvLocation !== undefined && dmcvLocation.boxName === HexCommand.FLEET_BOX && dmcvLocationJpMap !== HexCommand.FLEET_BOX) {
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

  // if (dmcvLocation !== undefined) {
  //   const update1 = createFleetUpdate("US-DMCV-JPMAP", dmcvLocation.currentHex.q, dmcvLocation.currentHex.r)
  //   if (update1 !== null) {
  //     // going to 2,1
  //     setFleetUnitUpdate(update1)
  //   }
  //   await delay(1)
  // }
}

function locationsEqual(locationA, locationB) {
  if (locationA === undefined || locationB === undefined) {
    return false
  }
  return locationA.currentHex.q === locationB.currentHex.q && locationA.currentHex.r === locationB.currentHex.r
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

  // there is a tiny chance of no available hexes for four of the top row hexes -> move somewhere @TODO QUACK

  // set US Regions to allow drag and drop into this hex
  setUSMapRegions(regions)

  // set gamePhaseCompleted to false until no more fleets to move
  GlobalGameState.phaseCompleted = false
  GlobalGameState.retreatFleet = fleet

  // will probably need to do the check for fleets in same hex a second time
}

export async function getFleetsForCSFSeaBattle(setJpFleet, setUsFleet) {
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

export async function getFleetsForDMCVSeaBattle(setJpFleet, setUsFleet) {
  const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

  let fleetsInSameHexAsUSDMCV = new Array()
  if (usDMCVLocation !== undefined) {
    fleetsInSameHexAsUSDMCV = GlobalInit.controller.getAllFleetsInLocation(
      usDMCVLocation,
      GlobalUnitsModel.Side.US,
      false
    )
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
export async function checkFleetsInSameHex({
  setFleetUnitUpdate,
  setPreviousPosition,
  previousPosition,
  setUSMapRegions,
}) {
  const { numFleetsInSameHexAsCSF, numFleetsInSameHexAsUSDMCV } = GlobalInit.controller.opposingFleetsInSameHex()
  // 1. loop through US Fleets

  // 2.   get location of fleet

  // 3.   if in same hex as any Japanese fleet
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
          setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
        }
      }
    } else {
      setRetreatRegions(usDMCVLocation, setUSMapRegions, "US-DMCV")
      return
    }
  }

  if (numFleetsInSameHexAsCSF === 2) {
    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

    const usStartLocation = previousPosition.get("CSF")
    const distanceMoved = distanceBetweenHexes(usStartLocation.currentHex, csfLocation.currentHex)
    if (distanceMoved === 2) {
      let hexes = interveningHexes(usStartLocation.currentHex, csfLocation.currentHex)
      if (hexes.length === 1) {
        // one intervening hex
        let hex = {
          currentHex: {
            q: hexes[0].q,
            r: hexes[0].r,
          },
        }
        const fleets = GlobalInit.controller.getAllFleetsInLocation(hex, GlobalUnitsModel.Side.US, false)
        if (fleets.length === 0) {
          await retreatOneHexTo(hex.currentHex, "CSF", setFleetUnitUpdate)
        } else {
          // go to region selection
          setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
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
        const fleetsHex1 = GlobalInit.controller.getAllFleetsInLocation(hex1, GlobalUnitsModel.Side.US, false)
        const fleetsHex2 = GlobalInit.controller.getAllFleetsInLocation(hex2, GlobalUnitsModel.Side.US, false)
        // 1. hex1 occupied, hex2 unoccupied -> move to hex2
        if (fleetsHex1.length === 1 && fleetsHex2.length === 0) {
          await retreatOneHexTo(hex2.currentHex, "CSF", setFleetUnitUpdate)
        }
        // 2. hex1 unoccupied, hex2 occupied -> move to hex1
        if (fleetsHex1.length === 0 && fleetsHex2.length === 1) {
          await retreatOneHexTo(hex1.currentHex, "CSF", setFleetUnitUpdate)
        }
        // 3. hex2 occupied, hex1 occupied -> region selection
        // 4. hex1 unoccupied, hex2 unoccupied -> region selection
        if (fleetsHex1.length == fleetsHex2.length) {
          setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
        }
      } else {
        // rare case where there has been a sea battle at night and the CSF has moved > 3 hexes
        setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
      }
    } else if (distanceMoved === 1) {
      // if start hex is not occuped go back there
      const fleets = GlobalInit.controller.getAllFleetsInLocation(usStartLocation, GlobalUnitsModel.Side.US, false)
      if (fleets.length === 0) {
        await retreatOneHexTo(usStartLocation.currentHex, "CSF", setFleetUnitUpdate)
      } else {
        // else region selection
        setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
      }
    } else {
      // hasn't moved - region selection
      setRetreatRegions(csfLocation, setUSMapRegions, "CSF")
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

function decrementAirOpsPoints() {
  if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
    GlobalGameState.airOperationPoints.japan =
      GlobalGameState.airOperationPoints.japan > 0 ? GlobalGameState.airOperationPoints.japan - 1 : 0
  } else {
    GlobalGameState.airOperationPoints.us =
      GlobalGameState.airOperationPoints.us > 0 ? GlobalGameState.airOperationPoints.us - 1 : 0
  }

  GlobalGameState.phaseCompleted = true

  GlobalGameState.updateGlobalState()
}

async function midwayTidyUp(setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate) {
  // moveCAPtoReturnBox(GlobalInit.controller, capAirUnits)
  await resetStrikeGroups(GlobalInit.controller, GlobalGameState.sideWithInitiative, setStrikeGroupUpdate)

  await GlobalInit.controller.setAllUnitsToNotMoved()

  GlobalGameState.airOperationPoints.japan = 0

  GlobalGameState.phaseCompleted = true
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
  setJapanStrikePanelEnabled(false)
  setUSMapRegions([])
  GlobalGameState.usFleetMoved = false
  GlobalGameState.dieRolls = []
}

async function tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate) {
  // if all carriers sunk remove fleet marker from map
  const otherSide =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  if (GlobalInit.controller.allCarriersSunk(otherSide)) {
    if (otherSide === GlobalUnitsModel.Side.US) {
      GlobalGameState.allUSCarriersSunk = true
    } else {
      GlobalGameState.allJapanCarriersSunk = true
    }
    // 1. Create Fleet Update to remove the fleet marker for that side
    const update1 = createRemoveFleetUpdate(otherSide)
    setFleetUnitUpdate(update1)

    await delay(1)
    // 2. Create Fleet Update to remove the fleet marker from the other side's map
    const update2 = createMapUpdateForFleet(GlobalInit.controller, update1.name, otherSide)
    setFleetUnitUpdate(update2)

    // 3. Fire state update to display Fleet Removed alert
  }
  await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative, setAirUnitUpdate)

  // reset SG attributes to allow that Strike Group and its boxes to be available
  await resetStrikeGroups(GlobalInit.controller, GlobalGameState.sideWithInitiative, setStrikeGroupUpdate)
  await GlobalInit.controller.setAllUnitsToNotMoved()
  decrementAirOpsPoints()
  GlobalGameState.sideWithInitiative = undefined
  GlobalGameState.updateGlobalState()
}

export async function endOfAirOperation(side, capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow) {
  if (
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.JAPAN_DMCV &&
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.US_DMCV
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

  if (GlobalGameState.orphanedAirUnits.length > 0) {
    setEliminatedUnitsPanelShow(true)
  }
  // 2. CHECK ALL INTERCEPTING CAP UNITS HAVE RETURNED TO CARRIERS

  const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(sideBeingAttacked)

  if (capUnitsReturning.length === 0) {
    return true
  }
  return false
}

function endOfTurn() {
  return GlobalGameState.airOperationPoints.japan === 0 && GlobalGameState.airOperationPoints.us === 0
}

function midwayOrAirOps() {
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
    GlobalGameState.midwayAirOpsCompleted = GlobalGameState.midwayAirOp
    GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_ATTACK
  } else {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
  }
}

function determineMidwayInvasion(setCardNumber,setEndOfTurnSummaryShow, currentCardNumber) {
  // before midway invasion, check cards playable at end of turn
  console.log("Current CARD =", currentCardNumber)
  if (
    currentCardNumber !== 1 && 
    (GlobalInit.controller.usHandContainsCard(1) &&
    GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0)
  ) {
    setCardNumber(() => 1)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    return
  }
  if (currentCardNumber !== 2 && (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2))) {
    setCardNumber(() => 2)
    console.log("FUCKETY")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    return
  }
  if (currentCardNumber !== 3 && (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3))) {
    setCardNumber(() => 3)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    return
  }
  if (currentCardNumber !== 4 && (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4))) {
    setCardNumber(() => 4)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    return
  }

  const jpMIFLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

  // MIF Regions set separately
  if (jpMIFLocation !== undefined && jpMIFLocation.boxName !== HexCommand.FLEET_BOX) {
    const distance = distanceBetweenHexes(jpMIFLocation.currentHex, Controller.MIDWAY_HEX.currentHex)
    console.log("MUGS distance=", distance)
    if (distance === 1) {
      if (GlobalInit.controller.usHandContainsCard(8)) {
        setCardNumber(() => 8)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_INVASION
      }
    } else {
      console.log("FUCKING END YOU CUNT 1")
      setEndOfTurnSummaryShow(true)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_GAME
    }
  } else {
    console.log("FUCKING END YOU CUNT 2")
    setEndOfTurnSummaryShow(true)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_GAME
  }
}
async function moveOnFromSeaBattles({ setUSMapRegions, setFleetUnitUpdate, setCardNumber }) {
  setUSMapRegions([])
  await doFleetUpdates(setFleetUnitUpdate)
  if (GlobalInit.controller.usHandContainsCard(7)) {
    setCardNumber(() => 7)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
  } else {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
  }
}

export function midwayPossible(setMidwayWarningShow, setMidwayDialogShow) {
  // if there are no attack planes on deck cannot attack Midway
  // otherwise display the attack declaration dialog
  const attackUnitsOnDeck = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(false)
  if (attackUnitsOnDeck.length === 0) {
    GlobalGameState.midwayAttackDeclaration = false
    setMidwayWarningShow(true)
  } else {
    setMidwayDialogShow(true)
  }
}

export default async function handleAction({
  setUSMapRegions,
  setCSFAlertShow,
  setMidwayDialogShow,
  setMidwayWarningShow,
  setJapanMapRegions,
  setJapanMIFMapRegions,
  setJpAlertShow,
  setEndOfAirOpAlertShow,
  setEnabledJapanBoxes,
  setEnabledUSBoxes,
  setUsFleetRegions,
  setJapanFleetRegions,
  setEnabledUSFleetBoxes,
  setEnabledJapanFleetBoxes,
  setJpFleet,
  setUsFleet,
  setMidwayNoAttackAlertShow,
  setFleetUnitUpdate,
  setSearchValues,
  setSearchResults,
  setSearchValuesAlertShow,
  setJapanStrikePanelEnabled,
  setUsStrikePanelEnabled,
  capSteps,
  capAirUnits,
  setAirUnitUpdate,
  setStrikeGroupUpdate,
  setEliminatedUnitsPanelShow,
  cardNumber,
  setCardNumber,
  setEndOfTurnSummaryShow,
  setPreviousPosition,
  previousPosition,
}) {
  console.log("+++++++++++++++++++ GLOBAL GAME STATE phase =", GlobalGameState.gamePhase)

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
    japanSetUpHandler()
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
    japanCardDrawHandler({ setUSMapRegions, setCSFAlertShow })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET) {
    setupUSFleetHandler({ setUSMapRegions })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
    setupUSAirHandler()
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_CARD_DRAW) {
    console.log("END OF US CARD DRAW")
    usCardDrawHandler({ setCardNumber, setMidwayDialogShow, setMidwayWarningShow, setCardNumber })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
    setNextStateFollowingCardPlay({
      cardNumber,
      setCardNumber,
      setMidwayDialogShow,
      setSearchValues,
      setSearchResults,
      setSearchValuesAlertShow,
      setAirUnitUpdate,
      setStrikeGroupUpdate,
      setEndOfAirOpAlertShow,
      setEndOfTurnSummaryShow,
      capAirUnits,
      setFleetUnitUpdate,
      setEliminatedUnitsPanelShow,
      midwayDeclarationHandler,
      setUsFleetRegions,
      setMidwayWarningShow,
    })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
    console.log("IN HERE...")
    midwayDeclarationHandler({ setUsFleetRegions })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
    usDMCVPlanningHandler({ setUsFleetRegions, setFleetUnitUpdate })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
    japanDMCVPlanningHandler({
      setUSMapRegions,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setJpAlertShow,
      setEnabledJapanFleetBoxes,
    })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
    usFleetMovementPlanningHandler({
      setJapanFleetRegions,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setUSMapRegions,
      setJpAlertShow,
      setEnabledUSFleetBoxes,
      setEnabledJapanFleetBoxes,
    })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
    goToMidwayAttackOrUSFleetMovement({
      setMidwayNoAttackAlertShow,
      setJapanMapRegions,
      setJapanMIFMapRegions,
      setFleetUnitUpdate,
    })

    if (GlobalGameState.midwayAttackDeclaration) {
      GlobalGameState.midwayAirOp = 1
      GlobalGameState.airOpJapan = 1
      setJapanStrikePanelEnabled(true)
      setUsStrikePanelEnabled(false)
      GlobalGameState.phaseCompleted = false
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
    usFleetMovementHandler({
      setFleetUnitUpdate,
      setCardNumber,
      setSearchValues,
      setSearchResults,
      setSearchValuesAlertShow,
      previousPosition,
    })

    const { numFleetsInSameHexAsCSF, numFleetsInSameHexAsUSDMCV } = GlobalInit.controller.opposingFleetsInSameHex()
    if (GlobalGameState.gameTurn === 4) {
      if (numFleetsInSameHexAsCSF === 2 || numFleetsInSameHexAsUSDMCV === 2) {
        if (numFleetsInSameHexAsCSF === 2) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_BATTLES_1
          getFleetsForCSFSeaBattle(setJpFleet, setUsFleet)
        } else if (numFleetsInSameHexAsUSDMCV === 2) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_BATTLES_2
        }
      } else {
        // no sea battle -> go straight to night air operations
        GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
      }
    } else {
      console.log("DEBUG numFleetsInSameHexAsCSF=", numFleetsInSameHexAsCSF)
      if (numFleetsInSameHexAsCSF === 2 || numFleetsInSameHexAsUSDMCV === 2) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.RETREAT_US_FLEET
      } else {
        if (GlobalInit.controller.usHandContainsCard(7)) {
          setCardNumber(() => 7)
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        } else {
          calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
          GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
        }
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_BATTLES_1) {
    // if the night battle has resulted in a DMCV carrier being sunk, need to remove
    // the DMCV Fleet from the map (could be both)
    // possible second sea battle do something like...
    const { fleetsInSameHexAsUSDMCV } = await getFleetsForDMCVSeaBattle(setJpFleet, setUsFleet)
    if (fleetsInSameHexAsUSDMCV.length === 2) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_BATTLES_2
    } else {
      const { numFleetsInSameHexAsCSF } = GlobalInit.controller.opposingFleetsInSameHex()
      if (numFleetsInSameHexAsCSF === 2) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.RETREAT_US_FLEET
      } else {
        await moveOnFromSeaBattles({
          setUSMapRegions,
          setFleetUnitUpdate,
          setCardNumber,
        })
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_BATTLES_2) {
    // then for each DMCV fleet -> test if sunk, if so remove
    if (GlobalGameState.usDMCVCarrier && GlobalInit.controller.isSunk(GlobalGameState.usDMCVCarrier)) {
      await removeDMCVFleetForCarrier(GlobalUnitsModel.Side.US, setFleetUnitUpdate)
    }
    if (GlobalGameState.jpDMCVCarrier && GlobalInit.controller.isSunk(GlobalGameState.jpDMCVCarrier)) {
      await removeDMCVFleetForCarrier(GlobalUnitsModel.Side.JAPAN, setFleetUnitUpdate)
    }
    const { numFleetsInSameHexAsCSF } = GlobalInit.controller.opposingFleetsInSameHex()
    if (numFleetsInSameHexAsCSF === 2) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.RETREAT_US_FLEET
    } else {
      await doFleetUpdates(setFleetUnitUpdate)
      await moveOnFromSeaBattles({
        setUSMapRegions,
        setFleetUnitUpdate,
        setCardNumber,
      })
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.RETREAT_US_FLEET) {
    const numFleetsOnMap = GlobalInit.controller.getNumberFleetsOnMap()

    // if (prevSize === numFleetsOnMap) {
    await checkFleetsInSameHex({
      setFleetUnitUpdate,
      setPreviousPosition,
      previousPosition,
      setUSMapRegions,
    })
    // }
    if (GlobalGameState.phaseCompleted) {
      await GlobalInit.controller.setAllUnitsToNotMoved()
      await doFleetUpdates(setFleetUnitUpdate)
      if (GlobalGameState.gameTurn === 4) {
        await moveOnFromSeaBattles({
          setUSMapRegions,
          setFleetUnitUpdate,
          setCardNumber,
        })
      } else {
        setUSMapRegions([])
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
        calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN) {
    if (GlobalGameState.orphanedAirUnits.length > 0) {
      setEliminatedUnitsPanelShow(true)
    }
    GlobalGameState.gamePhase = GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) {
    if (GlobalGameState.orphanedAirUnits.length > 0) {
      setEliminatedUnitsPanelShow(true)
    } else {
      if (
        GlobalInit.controller.usHandContainsCard(1) &&
        GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0
      ) {
        setCardNumber(() => 1)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2)) {
        setCardNumber(() => 2)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      setEndOfTurnSummaryShow(true)
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.INITIATIVE_DETERMINATION) {
    if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US) {
      setUsStrikePanelEnabled(true)
    } else {
      setJapanStrikePanelEnabled(true)
    }
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    return
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
    if (GlobalInit.controller.getDistanceBetween1AFAndMidway() <= 2) {
      await midwayTidyUp(setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate)
      return
    }
    if (GlobalGameState.midwayAirOp === 1) {
      GlobalGameState.midwayAirOp = 2
      GlobalGameState.airOpJapan = 2
      GlobalGameState.airOperationPoints.japan = 1
    } else {
      await midwayTidyUp(setJapanStrikePanelEnabled, setUSMapRegions, setStrikeGroupUpdate)
    }
    GlobalGameState.updateGlobalState()
    return
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION) {
    console.log("STATE CHANGE TARGET => CAP")
    if (
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
      GlobalInit.controller.anyFightersInStrike(GlobalGameState.taskForceTarget, GlobalGameState.sideWithInitiative)
    ) {
      if (
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
        GlobalInit.controller.japanHandContainsCard(9)
      ) {
        setCardNumber(() => 9)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else if (
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN &&
        GlobalInit.controller.japanHandContainsCard(12)
      ) {
        setCardNumber(() => 12)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      }
    } else {
      if (
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN &&
        GlobalInit.controller.japanHandContainsCard(12)
      ) {
        // May use Card #12 for elite fighter escorts
        setCardNumber(() => 12)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_INTERCEPTION) {
    console.log("STATE CHANGE CAP -> AAA FIRE OR ESCORT COUNTERATTACK OR CAP DAMAGE")
    GlobalGameState.midwayAttackResolved = true

    if (GlobalGameState.capHits > 0) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION
    } else {
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        if (GlobalGameState.attackingStepsRemaining > 0) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        } else {
          await endOfAirOperation(
            GlobalGameState.sideWithInitiative,
            capAirUnits,
            setAirUnitUpdate,
            setEliminatedUnitsPanelShow
          )
          midwayOrAirOps()
        }
      } else {
        if (capSteps > 0) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        }
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    console.log("END OF CAP_DAMAGE_ALLOCATION")
    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
      if (GlobalGameState.attackingStepsRemaining > 0) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
      } else {
        await endOfAirOperation(
          GlobalGameState.sideWithInitiative,
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        midwayOrAirOps()
      }
    } else {
      if (GlobalGameState.attackingStepsRemaining > 0 || getNumEscortFighterSteps(GlobalInit.controller) > 0) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
      } else {
        await endOfAirOperation(
          GlobalGameState.sideWithInitiative,
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        midwayOrAirOps()
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK) {
    console.log("END OF ESCORT_COUNTERATTACK")

    if (GlobalGameState.fighterHits > 0) {
      console.log("GOING TO ECORT DAMAGE ALLOCATION")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
    } else {
      if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
        if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
        } else {
          console.log("GOING TO ANTI AIRCRAFT FIRE....))))))))))))))))))))))")
          GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        }
      } else {
        await endOfAirOperation(
          GlobalGameState.sideWithInitiative,
          capAirUnits,
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        midwayOrAirOps()
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    console.log("END OF ESCORT_DAMAGE_ALLOCATION attacking steps remaining=", GlobalGameState.attackingStepsRemaining)
    if (GlobalGameState.attackingStepsRemaining > 0) {
      // if elite pilots and midway attack we did escort counterattack first
      // so transition to CAP_INTERCEPTION
      if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY && GlobalGameState.elitePilots) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
      }
    } else {
      await endOfAirOperation(
        GlobalGameState.sideWithInitiative,
        capAirUnits,
        setAirUnitUpdate,
        setEliminatedUnitsPanelShow
      )
      midwayOrAirOps()
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
    console.log("END OF ANTI_AIRCRAFT_FIRE")
    GlobalGameState.midwayAttackResolved = true

    console.log(
      "IN AAA FIRE...GlobalGameState.attackingStepsRemaining=",
      GlobalInit.controller.getAttackingStepsRemaining()
    )

    if (GlobalGameState.antiaircraftHits > 0) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
    } else if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
      let display = displayAttackTargetPanel(GlobalInit.controller)
      if (display) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
      } else {
        const anyTargets = GlobalInit.controller.autoAssignTargets()
        if (anyTargets === null) {
          // no targets (all units sunk)
          await endOfAirOperation(
            GlobalGameState.sideWithInitiative,
            capAirUnits,
            setAirUnitUpdate,
            setEliminatedUnitsPanelShow
          )
          midwayOrAirOps()
        } else {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_1
        }
      }
    } else {
      await endOfAirOperation(
        GlobalGameState.sideWithInitiative,
        capAirUnits,
        setAirUnitUpdate,
        setEliminatedUnitsPanelShow
      )
      midwayOrAirOps()
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    console.log("END OF AAA_DAMAGE_ALLOCATION")
    if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
      let display = displayAttackTargetPanel(GlobalInit.controller)
      if (display) {
        console.log("STATE = ATTACK TARGET SELECTION")
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
      } else {
        const anyTargets = GlobalInit.controller.autoAssignTargets()
        if (anyTargets === null) {
          // no targets (all units sunk)
          await endOfAirOperation(
            GlobalGameState.sideWithInitiative,
            capAirUnits,
            setAirUnitUpdate,
            setEliminatedUnitsPanelShow
          )
          midwayOrAirOps()
        } else {
          console.log("GOING TO AIR ATTACK 1")
          GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_1
        }
      }
    } else {
      await endOfAirOperation(
        GlobalGameState.sideWithInitiative,
        capAirUnits,
        setAirUnitUpdate,
        setEliminatedUnitsPanelShow
      )
      midwayOrAirOps()
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_TARGET_SELECTION) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK_1
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_ATTACK_1) {
    if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION
    } else {
      if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.TaskForce.MIF) {
        await endOfAirOperation(
          GlobalGameState.sideWithInitiative,
          undefined, // MIF has no CAP units
          setAirUnitUpdate,
          setEliminatedUnitsPanelShow
        )
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_ATTACK_2) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION) {
    // check for card 13 critical hit
    const carrierName = GlobalGameState.currentCarrierAttackTarget

    const carrier = GlobalInit.controller.getCarrier(carrierName)

    // if carrier is in DMCV fleet and sunk - remove DMCV fleets from map
    if (
      GlobalGameState.carrierAttackHitsThisAttack > 0 &&
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
      GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.JAPAN_DMCV &&
      GlobalInit.controller.getDamagedCarriersOneOrTwoHits().length > 0 &&
      GlobalInit.controller.usHandContainsCard(13)
    ) {
      setCardNumber(() => 13)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
    } else {
      const sideBeingAttacked =
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
          ? GlobalUnitsModel.Side.JAPAN
          : GlobalUnitsModel.Side.US
      if (carrier.dmcv && GlobalInit.controller.isSunk(carrierName)) {
        await removeDMCVFleetForCarrier(sideBeingAttacked, setFleetUnitUpdate)
        await delay(1)
        carrier.dmcv = false
        if (sideBeingAttacked === GlobalUnitsModel.Side.US) {
          GlobalGameState.usDMCVCarrier = undefined
        } else {
          GlobalGameState.jpDMCVCarrier = undefined
        }
        setFleetUnitUpdate({
          name: "",
          position: {},
        }) // reset to avoid updates causing problems for other markers
      }
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
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION) {
    await endOfAirOperation(
      GlobalGameState.sideWithInitiative,
      capAirUnits,
      setAirUnitUpdate,
      setEliminatedUnitsPanelShow
    )
    midwayOrAirOps()
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
    if (GlobalGameState.orphanedAirUnits.length > 0) {
      setEliminatedUnitsPanelShow(true)
    } else {
      if (
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US &&
        GlobalInit.controller.japanHandContainsCard(10)
      ) {
        setCardNumber(() => 10)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        console.log("+++++++++++++++++++++++++ DOING TIDY UP...")
        await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
        setEndOfAirOpAlertShow(true)
      }
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_AIR_OPERATION) {
    if (endOfTurn()) {
      if (GlobalGameState.gameTurn === 7) {
        determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
        if (
          GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION ||
          GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY
        ) {
          return
        }
      }
      if (
        GlobalInit.controller.usHandContainsCard(1) &&
        GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0
      ) {
        setCardNumber(() => 1)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2)) {
        setCardNumber(() => 2)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3)) {
        setCardNumber(() => 3)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      if (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4)) {
        setCardNumber(() => 4)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
        return
      }
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
      setEndOfTurnSummaryShow(true)
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_GAME
    setEndOfTurnSummaryShow(true)
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_TURN) {
    // if this is the end of turn 7 - possible Midway Invasion

    // check if MIF fleet is one hex away from Midway
    // if so -> go to MIDWAY_INVASION

    if (GlobalGameState.gameTurn === 7) {
      if (GlobalInit.controller.japanHandContainsCard(6)) {
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
      }
    } else {
      GlobalGameState.gameTurn++

      if (GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 7) {
        if (GlobalInit.controller.japanHandContainsCard(5)) {
          GlobalGameState.dieRolls = []
          setCardNumber(() => 5)
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
          return
        }
      }
      // else ... START OF NEW TURN
      await GlobalInit.controller.setAllUnitsToNotMoved()

      GlobalGameState.airOpJapan = 0
      GlobalGameState.airOpUS = 0
      if (GlobalInit.controller.japanHandContainsCard(6) && GlobalGameState.gameTurn !== 4) {
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
        }
        if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 5 || GlobalGameState.gameTurn === 7) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
        }
      }
      GlobalGameState.phaseCompleted = false
    }
  } else if (
    GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DRAWS_ONE_CARD ||
    GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
  ) {
    if (GlobalGameState.gameTurn !== 4) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
      // setMidwayDialogShow(true)
      midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
    } else {
      midwayDeclarationHandler({ setUsFleetRegions })
    }
  }

  // @TODO if all air units in a strike are eliminated maybe display a dialog saying "Air Attack Phase over, no
  // air units left or something"

  GlobalGameState.setupPhase++

  GlobalGameState.updateGlobalState()
  const enabledBoxes = getJapanEnabledAirBoxes()
  setEnabledJapanBoxes(() => enabledBoxes)
  const enabledUSBoxes = getUSEnabledAirBoxes()
  setEnabledUSBoxes(() => enabledUSBoxes)
}
