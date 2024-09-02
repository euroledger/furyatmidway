import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import { createMapUpdateForFleet } from "./AirUnitTestData"
import { usCSFStartHexes, japanAF1StartHexesNoMidway, japanAF1StartHexesMidway } from "./components/MapRegions"
import { calculateSearchValues, calculateSearchResults } from "./model/SearchValues"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"

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
  console.log("END OF Midway Declaration Phase")
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
  GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_ATTACK
  setMidwayNoAttackAlertShow(true)
  setJapanMapRegions([])
  GlobalGameState.phaseCompleted = true
  GlobalGameState.jpFleetPlaced = true
  const update = createMapUpdateForFleet(GlobalInit.controller, "1AF", GlobalUnitsModel.Side.JAPAN)
  setFleetUnitUpdate(update)
}

function midwayAttackHandler() {
  console.log("END OF Midway Attack Phase")
  if (!GlobalGameState.midwayAttackDeclaration) {
    GlobalGameState.phaseCompleted = true
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
  }
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
      setSideWithInitiative(null) // ensure roll dice button is enabled
      initiativeHandler({ setInitiativePanelShow })
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
  capSteps
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
    midwayAttackHandler()
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
    airOperationsHandler({
      setEnabledJapanBoxes,
      setEnabledUSBoxes,
      setJapanStrikePanelEnabled,
      setUsStrikePanelEnabled,
      sideWithInitiative,
      setInitiativePanelShow,
      setSideWithInitiative,
    })
    GlobalGameState.updateGlobalState()
    return
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION) {
    console.log("GOING TO CAP INTERCEPTION")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION 
  }
   else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_INTERCEPTION) {
    console.log("GOING TO DAMAGE ALLOCATION (1)")
    GlobalGameState.gamePhase =
      capSteps > 0 ? GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION : GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    console.log("GOING TO ESCORT COUNTERATTACK")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.ESCORT_COUNTERATTACK
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK) {
    console.log("GOING TO DAMAGE ALLOCATION (2)")
    GlobalGameState.gamePhase =  GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION
  }
  
  GlobalGameState.setupPhase++

  GlobalGameState.updateGlobalState()
  const enabledBoxes = getJapanEnabledAirBoxes()
  setEnabledJapanBoxes(() => enabledBoxes)
  const enabledUSBoxes = getUSEnabledAirBoxes()
  setEnabledUSBoxes(() => enabledUSBoxes)
}
