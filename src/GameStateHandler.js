import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import { createMapUpdateForFleet } from "./AirUnitTestData"
import { usCSFStartHexes, japanAF1StartHexesNoMidway, japanAF1StartHexesMidway } from "./components/MapRegions"
import { calculateSearchValues, calculateSearchResults } from "./model/SearchValues"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"
import { moveCAPtoReturnBox } from "./controller/AirOperationsHandler"

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

function midwayAttackHandler() {
  // conduct attack on Midway:

  // 1. Allocate AirOps points (range 0-2 hexes -> 1 AOP, 3-5 hexess -> 2 AOP)

  // 2. change game state to AIR OPERATIONS with sidewithinitiative set to JAPAN

  // 3. Only allow a single strike group to be performed

  // 4. This strike group can only move to within 2 hexes of Midway (3-5 range) or
  // to Midway base (0-2 range)

  // for now, this needs to be done at the end of the air operation
  GlobalGameState.phaseCompleted = true
  GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
  console.log("END OF Midway Attack Phase")
}
function calcAirOpsPoints({ setSearchValues, setSearchResults, setSearchValuesAlertShow }) {
  const sv = calculateSearchValues(GlobalInit.controller)
  const sr = calculateSearchResults(GlobalInit.controller, {
    jp_af: sv.jp_af,
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

function initiativeHandler({ setInitiativePanelShow }) {
  setInitiativePanelShow(true)
  GlobalGameState.phaseCompleted = true
}

function airOperationsHandler({
  setEnabledJapanBoxes,
  setEnabledUSBoxes,
  setJapanStrikePanelEnabled,
  setUsStrikePanelEnabled,
  sideWithInitiative,
  setInitiativePanelShow,
  setSideWithInitiative,
  capAirUnits,
  setAirUnitUpdate,
}) {
  GlobalGameState.phaseCompleted = false
  if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
    const enabledBoxes = getJapanEnabledAirBoxes(sideWithInitiative)
    setEnabledJapanBoxes(() => enabledBoxes)
    setEnabledUSBoxes()
    setJapanStrikePanelEnabled(true)
    setUsStrikePanelEnabled(false)
    const units = GlobalInit.controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.JAPAN)
    if (units.length === 0) {
      GlobalGameState.phaseCompleted = true
      GlobalGameState.airOperationPoints.japan =
        GlobalGameState.airOperationPoints.japan > 0 ? GlobalGameState.airOperationPoints.japan - 1 : 0
      GlobalGameState.phaseCompleted = true

      GlobalInit.controller.setAllUnitsToNotMoved()

      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
        if (GlobalGameState.midwayAirOp === 1) {
          GlobalGameState.midwayAirOp = 2
          GlobalGameState.airOperationPoints.japan = 1
        }

        const strikeGroups = GlobalInit.controller.getAllStrikeGroups(GlobalUnitsModel.Side.JAPAN)
        for (let sg of strikeGroups) {
          sg.moved = false
        }

        GlobalGameState.phaseCompleted = false
      } else {
        setSideWithInitiative(null) // ensure roll dice button is enabled
        initiativeHandler({ setInitiativePanelShow })
      }
    } else {
      GlobalGameState.phaseCompleted = false
    }
  } else {
    const enabledUSBoxes = getUSEnabledAirBoxes(sideWithInitiative)
    setEnabledUSBoxes(() => enabledUSBoxes)
    setEnabledJapanBoxes(() => [])

    setUsStrikePanelEnabled(true)
    setJapanStrikePanelEnabled(false)
    const units = GlobalInit.controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.US)
    if (units.length === 0) {
      GlobalGameState.airOperationPoints.us =
        GlobalGameState.airOperationPoints.us > 0 ? GlobalGameState.airOperationPoints.us - 1 : 0
      GlobalGameState.phaseCompleted = true
      // GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_SEARCH

      GlobalInit.controller.setAllUnitsToNotMoved()
      setSideWithInitiative(null) // ensure roll dice button is enabled
      initiativeHandler({ setInitiativePanelShow })
    } else {
      GlobalGameState.phaseCompleted = false
    }
  }
  // If at least one strike group has been created and all strike groups have moved
  // allow next action

  GlobalGameState.updateGlobalState()
}
export default function handleAction({
  setUSMapRegions,
  setCSFAlertShow,
  setMidwayDialogShow,
  setJapanMapRegions,
  setJpAlertShow,
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
  setSideWithInitiative,
  capSteps,
  capAirUnits,
  setAirUnitUpdate,
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

  console.log("GLOBAL GAME STATE phase =", GlobalGameState.gamePhase)

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
      airOperationsHandler({
        setEnabledJapanBoxes,
        setEnabledUSBoxes,
        setJapanStrikePanelEnabled,
        setUsStrikePanelEnabled,
        sideWithInitiative,
        setInitiativePanelShow,
        setSideWithInitiative,
        capAirUnits,
        setAirUnitUpdate,
      })
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
    initiativeHandler({ setInitiativePanelShow })
    return
  } else if (
    GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
    GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
  ) {
    airOperationsHandler({
      setEnabledJapanBoxes,
      setEnabledUSBoxes,
      setJapanStrikePanelEnabled,
      setUsStrikePanelEnabled,
      sideWithInitiative,
      setInitiativePanelShow,
      setSideWithInitiative,
      capAirUnits,
      setAirUnitUpdate,
    })
    GlobalGameState.updateGlobalState()
    return
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_INTERCEPTION) {
    GlobalGameState.gamePhase =
      capSteps > 0 ? GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION : GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK) {
    if (GlobalGameState.fighterHits > 0) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    if (GlobalGameState.attackingStepsRemaining > 0) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
    } else {
      moveCAPtoReturnBox(GlobalInit.controller, capAirUnits, setAirUnitUpdate)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
    console.log(
      "IN AAA FIRE...GlobalGameState.attackingStepsRemaining=",
      GlobalInit.controller.getAttackingStepsRemaining()
    )
    if (GlobalGameState.antiaircraftHits > 0) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
    } else if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
      moveCAPtoReturnBox(GlobalInit.controller, capAirUnits, setAirUnitUpdate)
      let display = displayAttackTargetPanel(GlobalInit.controller)
      if (display) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
      } else {
        // allocate all targets to single carrier/midway
        GlobalInit.controller.autoAssignTargets()
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK
      }
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    if (GlobalInit.controller.getAttackingStepsRemaining() > 0) {
      moveCAPtoReturnBox(GlobalInit.controller, capAirUnits, setAirUnitUpdate)
      let display = displayAttackTargetPanel(GlobalInit.controller)
      if (display) {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.ATTACK_TARGET_SELECTION
      } else {
        // allocate all targets to single carrier/midway
        GlobalInit.controller.autoAssignTargets()
        GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK
      }
    } else {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_OPERATIONS
    }
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_TARGET_SELECTION) {
    console.log("GO TO AIR ATTACK BUDDY!")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.AIR_ATTACK
  }


  // @TODO if all air units in a strike are eliminated maybe display a dialog saying "Air Attack Phase over, no
  // air units left or something"

  // @TODO At end of Air Attack phase, move any defending CAP units into their respective CAP
  //  return boxes

  GlobalGameState.setupPhase++

  GlobalGameState.updateGlobalState()
  const enabledBoxes = getJapanEnabledAirBoxes()
  setEnabledJapanBoxes(() => enabledBoxes)
  const enabledUSBoxes = getUSEnabledAirBoxes()
  setEnabledUSBoxes(() => enabledUSBoxes)
}
