import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import { createMapUpdateForFleet } from "./AirUnitTestData"
import { usCSFStartHexes, japanAF1StartHexesNoMidway, japanAF1StartHexesMidway } from "./components/MapRegions"
import { calculateSearchValues, calculateSearchResults } from "./model/SearchValues"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"
import {
  moveCAPtoReturnBox,
  setStrikeGroupAirUnitsToNotMoved,
  moveOrphanedCAPUnitsToEliminatedBox,
  resetStrikeGroups,
} from "./controller/AirOperationsHandler"
import { getNumEscortFighterSteps } from "./DiceHandler"

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

function usCardDrawHandler({ setMidwayDialogShow }) {
  if (GlobalGameState.gameTurn != 1) {
    console.log("Set game state to Both Card Draw")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.BOTH_CARD_DRAW
  } else {
    console.log("Set game state to Midway")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
    // @TODO hard wire or randomly select midway attack decision here
    setMidwayDialogShow(true)
  }
  GlobalGameState.phaseCompleted = false
}
function setupUSFleetHandler({ setUSMapRegions }) {
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
  GlobalGameState.usFleetPlaced = true
  setUSMapRegions([])
  GlobalGameState.phaseCompleted = false
}

function setupUSAirHandler() {
  GlobalGameState.currentCarrier++
  GlobalGameState.currentTaskForce =
    GlobalGameState.currentCarrier <= 1 ? 1 : GlobalGameState.currentCarrier === 2 ? 2 : 3 // 3 is Midway
  if (GlobalGameState.currentCarrier === 4) {
    console.log("Set game state to US Card Draw")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_CARD_DRAW
    GlobalGameState.usSetUpComplete = true
    GlobalInit.controller.drawUSCards(2, true)
    GlobalGameState.usCardsDrawn = true
  }
  GlobalGameState.phaseCompleted = false
}

function midwayDeclarationHandler({ setUsFleetRegions }) {
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  setUsFleetRegions()
  GlobalGameState.usFleetMoved = false

  GlobalGameState.phaseCompleted = true
}

function usFleetMovementPlanningHandler({ setUSMapRegions, setJapanMapRegions, setJpAlertShow }) {
  console.log("END OF US Fleet Movement Phase")
  GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
  setUSMapRegions([])
  if (GlobalGameState.midwayAttackDeclaration === true) {
    setJapanMapRegions(japanAF1StartHexesMidway)
  } else {
    setJapanMapRegions(japanAF1StartHexesNoMidway)
  }
  setJpAlertShow(true)
  GlobalGameState.phaseCompleted = false
}

function japanFleetMovementHandler({ setMidwayNoAttackAlertShow, setJapanMapRegions, setFleetUnitUpdate }) {
  console.log("END OF Japan Fleet Movement Phase")
  if (!GlobalGameState.midwayAttackDeclaration) {
    setMidwayNoAttackAlertShow(true)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
  } else {
    console.log("BEGIN MIDWAY ATTACK...")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_ATTACK
    let distance = GlobalInit.controller.numHexesBetweenFleets(
      { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
      { name: "MIDWAY" }
    )
    calcAirOpsPointsMidway(distance)
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN
  }
  setJapanMapRegions([])

  GlobalGameState.phaseCompleted = true
  GlobalGameState.jpFleetPlaced = true
  const update = createMapUpdateForFleet(GlobalInit.controller, "1AF", GlobalUnitsModel.Side.JAPAN)
  setFleetUnitUpdate(update)
}

function calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow }) {
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
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_17 ||
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY
  ) {
    return false
  }

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
    if (controller.isSunk(GlobalUnitsModel.Carrier.AKAGI) || controller.isSunk(GlobalUnitsModel.Carrier.KAGA)) {
      return false
    }
  }

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
    if (controller.isSunk(GlobalUnitsModel.Carrier.HIRYU) || controller.isSunk(GlobalUnitsModel.Carrier.SORYU)) {
      return false
    }
  }

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
    if (controller.isSunk(GlobalUnitsModel.Carrier.ENTERPRISE) || controller.isSunk(GlobalUnitsModel.Carrier.HORNET)) {
      return false
    }
  }
  return true
}

function usFleetMovementHandler({ setFleetUnitUpdate, setSearchValues, setSearchResults, setSearchValuesAlertShow }) {
  const update = createMapUpdateForFleet(GlobalInit.controller, "CSF", GlobalUnitsModel.Side.US)
  setFleetUnitUpdate(update)
  GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH
  calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow })
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

async function tidyUp(setAirUnitUpdate, setStrikeGroupUpdate) {
  await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative, setAirUnitUpdate)

  // reset SG attributes to allow that Strike Group and its boxes to be available
  await resetStrikeGroups(GlobalInit.controller, GlobalGameState.sideWithInitiative, setStrikeGroupUpdate)
  await GlobalInit.controller.setAllUnitsToNotMoved()
  decrementAirOpsPoints()
  GlobalGameState.sideWithInitiative = undefined
  GlobalGameState.updateGlobalState()
}

export async function endOfAirOperation(side, capAirUnits, setAirUnitUpdate, setEliminatedUnitsPanelShow) {
  await moveCAPtoReturnBox(GlobalInit.controller, capAirUnits, setAirUnitUpdate)
  const anySGsNotMoved = GlobalInit.controller.getStrikeGroupsNotMoved2(GlobalGameState.sideWithInitiative)

  if (!anySGsNotMoved) {
    await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative, setAirUnitUpdate)
  } else {
    return false
  }

  // ELIMIMINATE ORPHANED UNITS IN RETURN BOXES
  // (CAP RETURN TO BEGIN WITH)
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  await moveOrphanedCAPUnitsToEliminatedBox(sideBeingAttacked)

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
export default async function handleAction({
  setUSMapRegions,
  setCSFAlertShow,
  setMidwayDialogShow,
  setJapanMapRegions,
  setJpAlertShow,
  setEndOfAirOpAlertShow,
  setEnabledJapanBoxes,
  setEnabledUSBoxes,
  setInitiativePanelShow,
  setUsFleetRegions,
  setMidwayNoAttackAlertShow,
  setFleetUnitUpdate,
  setSearchValues,
  setSearchResults,
  setSearchValuesAlertShow,
  setJapanStrikePanelEnabled,
  setUsStrikePanelEnabled,
  sideWithInitiative,
  capSteps,
  capAirUnits,
  setAirUnitUpdate,
  setStrikeGroupUpdate,
  setEliminatedUnitsPanelShow,
}) {
  //   switch (
  // GlobalGameState.gamePhase
  // case GlobalGameState.PHASE.JAPAN_SETUP:
  //     japanSetUpHandler()
  //   break

  // case GlobalGameState.PHASE.JAPAN_CARD_DRAW:
  //   break

  // case GlobalGameState.PHASE.US_SETUP_FLEET:
  //   break

  // case GlobalGameState.PHASE.US_SETUP_AIR:
  //   break
  // case GlobalGameState.PHASE.US_CARD_DRAW:
  //   break
  // case GlobalGameState.PHASE.JAPAN_MIDWAY:
  //   break
  // case GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING:
  //   break
  // case GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT:
  //   break
  // case GlobalGameState.PHASE.MIDWAY_ATTACK:
  //   break
  // case GlobalGameState.PHASE.US_FLEET_MOVEMENT:
  //   break

  // case GlobalGameState.PHASE.AIR_SEARCH:
  //   break

  // case GlobalGameState.PHASE.AIR_OPERATIONS:
  //   break

  // default:
  //   break
  //   ) {
  //   }

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
    usCardDrawHandler({ setMidwayDialogShow })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
    midwayDeclarationHandler({ setUsFleetRegions })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
    usFleetMovementPlanningHandler({ setUSMapRegions, setJapanMapRegions, setJpAlertShow })
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
    japanFleetMovementHandler({ setMidwayNoAttackAlertShow, setJapanMapRegions, setFleetUnitUpdate })
    if (GlobalGameState.midwayAttackDeclaration) {
      GlobalGameState.midwayAirOp = 1
      GlobalGameState.airOpJapan = 1
      setJapanStrikePanelEnabled(true)
      setUsStrikePanelEnabled(false)
      GlobalGameState.phaseCompleted = false
      // airOperationsHandler({
      //   setEnabledJapanBoxes,
      //   setEnabledUSBoxes,
      //   setJapanStrikePanelEnabled,
      //   setUsStrikePanelEnabled,
      //   sideWithInitiative,
      //   setInitiativePanelShow,
      //   capAirUnits,
      //   setAirUnitUpdate,
      //   setSearchValues,
      //   setSearchResults,
      //   setSearchValuesAlertShow,
      //   setEliminatedUnitsPanelShow,
      // })
    }
    // } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
    //   midwayAttackHandler()
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
    usFleetMovementHandler({
      setFleetUnitUpdate,
      setSearchValues,
      setSearchResults,
      setSearchValuesAlertShow,
    })
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
    console.log("DOING end of AIR OPERATION stuff ")
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
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_INTERCEPTION) {
    console.log("STATE CHANGE CAP -> AAA FIRE")
    GlobalGameState.gamePhase =
      capSteps > 0 ? GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION : GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    console.log("END OF CAP_DAMAGE_ALLOCATION")
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK) {
    console.log("END OF ESCORT_COUNTERATTACK")

    if (GlobalGameState.fighterHits > 0) {
      console.log("GOING TO ECORT DAMAGE ALLOCATION")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
    } else {
      if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
        console.log("GOING TO ANTI AIRCRAFT FIRE....))))))))))))))))))))))")
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
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    console.log("END OF ESCORT_DAMAGE_ALLOCATION attacking steps remaining=", GlobalGameState.attackingStepsRemaining)
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
    console.log("END OF ANTI_AIRCRAFT_FIRE")

    console.log(
      "IN AAA FIRE...GlobalGameState.attackingStepsRemaining=",
      GlobalInit.controller.getAttackingStepsRemaining()
    )
    if (GlobalGameState.antiaircraftHits > 0) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
    } else if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
      let display = displayAttackTargetPanel(GlobalInit.controller)
      if (display) {
        console.log("NEW STATE = ATTACK TARGET SELECTION WOOOOOOOOOOOOOOO")
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
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_ATTACK_2) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION) {
    if (GlobalGameState.attackingStrikeGroup) {
      console.log(
        "SPAZ 1974 GlobalGameState.attackingStrikeGroup airOpattack=",
        GlobalGameState.attackingStrikeGroup.airOpAttacked
      )
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION) {
    console.log("DO TRACE FUCKER...")
    console.trace()
    console.log("IN STATE MIDWAY DAMAGE")

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
      await tidyUp(setAirUnitUpdate, setStrikeGroupUpdate)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_AIR_OPERATION
      setEndOfAirOpAlertShow(true)
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_AIR_OPERATION) {
    console.log("GO TO INITIATIVE DETERMINATION...")

    // @TODO!!!!!!!!!!!!!
    // check for end of turn here
    if (endOfTurn()) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.END_OF_TURN
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.INITIATIVE_DETERMINATION
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
