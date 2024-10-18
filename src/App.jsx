import { React, useState, useEffect, createContext } from "react"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import Board from "./components/Board"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch"
import GlobalGameState from "./model/GlobalGameState"
import GlobalInit from "./model/GlobalInit"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import AlertPanel from "./components/dialogs/AlertPanel"
import SaveGamePanel from "./components/dialogs/SaveGamePanel"
import LoadGamePanel from "./components/dialogs/LoadGamePanel"
import CardPanel from "./components/dialogs/CardPanel"
import GameStatusPanel from "./components/dialogs/GameStatusPanel"
import SplashScreen from "./components/dialogs/SplashScreen"
import "./style.css"
import {
  doIntiativeRoll,
  doSelectionRoll,
  doCAP,
  getNumEscortFighterSteps,
  doDamageAllocation,
  doCAPEvent,
  doDamageEvent,
  doEscortEvent,
  doAAAEvent,
  doAttackSelectionEvent,
  doFighterCounterattack,
  doAAAFireRolls,
  doAttackFireRolls,
  doAttackResolutionEvent,
  doCarrierDamageEvent,
  doCarrierDamageRolls,
  carrierDamageRollNeeded,
  autoAllocateDamage,
  sendDamageUpdates,
  sendMidwayDamageUpdates,
  doMidwayDamage,
  autoAllocateMidwayDamage,
} from "./DiceHandler"
import { determineAllUnitsDeployedForCarrier } from "./controller/AirUnitSetupHandler"

import { usCSFStartHexes, japanAF1StartHexesNoMidway, japanAF1StartHexesMidway } from "./components/MapRegions"
import YesNoDialog from "./components/dialogs/YesNoDialog"
import { saveGameState } from "./SaveLoadGame"
import loadHandler from "./LoadHandler"
import { allHexesWithinDistance } from "./components/HexUtils"
import DicePanel from "./components/dialogs/DicePanel"
import LargeDicePanel from "./components/dialogs/LargeDicePanel"
import AttackDicePanel from "./components/dialogs/AttackDicePanel"
import CarrierDamageDicePanel from "./components/dialogs/CarrierDamageDicePanel"
import MidwayDamageDicePanel from "./components/dialogs/MidwayDamageDicePanel"
import EliminatedReturningUnits from "./components/dialogs/EliminatedReturningUnitsPanel"
import { AirOpsHeaders, AirOpsFooters } from "./attackscreens/AirOpsDataPanels"
import { TargetHeaders, TargetFooters } from "./attackscreens/TargetPanel"
import { AttackTargetHeaders, AttackTargetFooters } from "./attackscreens/AttackTargetPanel"
import { CAPHeaders, CAPFooters } from "./attackscreens/CAPPanel"
import { DamageHeaders, DamageFooters } from "./attackscreens/DamageAllocationPanel"
import { EscortHeaders, EscortFooters } from "./attackscreens/EscortPanel"
import { AAAHeaders, AAAFooters } from "./attackscreens/AAAPanel"
import { AttackResolutionHeaders, AttackResolutionFooters } from "./attackscreens/AttackResolutionPanel"

import UITester from "./UIEvents/UITester"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"
import handleAction, { calcAirOpsPointsMidway } from "./GameStateHandler"
import { setStrikeGroupAirUnitsToNotMoved } from "./controller/AirOperationsHandler"
import styleConsole from "react-scroll-to-bottom/lib/utils/styleConsole"

export default App

export const BoardContext = createContext()

export function App() {
  const [splash, setSplash] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [enabledJapanBoxes, setEnabledJapanBoxes] = useState([])
  const [enabledUSBoxes, setEnabledUSBoxes] = useState([])
  const [japanStrikePanelEnabled, setJapanStrikePanelEnabled] = useState(false)
  const [usStrikePanelEnabled, setUsStrikePanelEnabled] = useState(false)

  useEffect(() => {
    setEnabledJapanBoxes(getJapanEnabledAirBoxes())
  }, [])
  useEffect(() => {
    setEnabledUSBoxes(getUSEnabledAirBoxes())
  }, [])

  const [enabledZones, setEnabledZones] = useState([])

  const [gameState, setGameState] = useState(false)

  const [loading, setLoading] = useState(false)

  const [isMoveable, setIsMoveable] = useState(false)
  const [scale, setScale] = useState(1)
  const [testClicked, setTestClicked] = useState(false)
  const [csfAlertShow, setCSFAlertShow] = useState(false)

  const [saveGameShow, setSaveGameShow] = useState(false)
  const [gameSaveID, setGameSaveID] = useState("")
  const [gameLoadID, setGameLoadID] = useState("")

  const [loadPanelShow, setLoadPanelShow] = useState(false)
  const [jpAlertShow, setJpAlertShow] = useState(false)

  const [endOfAirOpAlertShow, setEndOfAirOpAlertShow] = useState(false)

  const [saveAlertShow, setSaveAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text

  const [midwayDialogShow, setMidwayDialogShow] = useState(false)
  const [fleetMoveAlertShow, setFleetMoveAlertShow] = useState(false)
  const [midwayNoAttackAlertShow, setMidwayNoAttackAlertShow] = useState(false)
  const [searchValuesAlertShow, setSearchValuesAlertShow] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [searchResults, setSearchResults] = useState({})

  const [alertShow, setAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text
  const [jpHandShow, setjpHandShow] = useState(false)
  const [usHandShow, setusHandShow] = useState(false)

  const [gameStateShow, setGameStateShow] = useState(false)
  const [initiativePanelShow, setInitiativePanelShow] = useState(false)
  const [targetPanelShow, setTargetPanelShow] = useState(false)
  const [attackTargetPanelShow, setAttackTargetPanelShow] = useState(false)
  const [attackResolutionPanelShow, setAttackResolutionPanelShow] = useState(false)
  const [carrierDamagePanelShow, setCarrierDamagePanelShow] = useState(false)
  const [eliminatedUnitsPanelShow, setEliminatedUnitsPanelShow] = useState(false)

  const [midwayDamagePanelShow, setMidwayDamagePanelShow] = useState(false)

  const [capInterceptionPanelShow, setCapInterceptionPanelShow] = useState(false)

  const [damageAllocationPanelShow, setDamageAllocationPanelShow] = useState(false)

  const [escortPanelShow, setEscortPanelShow] = useState(false)
  const [aaaPanelShow, setAaaPanelShow] = useState(false)

  const [capAirUnits, setCapAirUnits] = useState([])
  const [capSteps, setCapSteps] = useState(0)
  const [escortSteps, setEscortSteps] = useState(0)

  const [fightersPresent, setFightersPresent] = useState(true)

  const [airUnitUpdate, setAirUnitUpdate] = useState({
    unit: {},
    position: {},
    boxName: "",
    index: -1,
  })

  const [testUpdate, setTestUpdate] = useState({
    unit: {},
    position: {},
    boxName: "",
    index: -1,
  })

  const [attackAirCounterUpdate, setAttackAirCounterUpdate] = useState({
    unit: {
      name: "",
    },
    carrier: "",
    idx: -1,
    side: "",
    uuid: 0,
  })

  const [damageMarkerUpdate, setDamageMarkerUpdate] = useState({
    name: "",
    box: "",
    index: -1,
    side: "",
  })

  const [fleetUnitUpdate, setFleetUnitUpdate] = useState({
    name: "",
    position: {},
  })

  const [strikeGroupUpdate, setStrikeGroupUpdate] = useState({
    name: "",
    position: {},
  })

  const [USMapRegions, setUSMapRegions] = useState([])
  const [japanMapRegions, setJapanMapRegions] = useState([])

  // const [sideWithInitiative, setSideWithInitiative] = useState(undefined)

  const [targetDetermined, setTargetDetermined] = useState(false)

  const [attackTargetsSelected, setAttackTargetsSelected] = useState(false)

  const [attackResolved, setAttackResolved] = useState(false)

  const [targetSelected, setTargetSelected] = useState(false)

  const [eliminatedSteps, setEliminatedSteps] = useState(0)

  const [stepsLeft, setStepsLeft] = useState(0)

  const [carrierHits, setCarrierHits] = useState(-1)
  const [numDiceToRoll, setNumDiceToRoll] = useState(16)

  // QUACK TESTING ONLY REMOVE THESE ***********
  // GlobalGameState.TESTING = true
  // GlobalGameState.carrierAttackHits = 3
  // *******************************************

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION) {
      // @TODO CHECK IF JAPANESE PLAYER HOLDS CARD 11
      // ("US STRIKE LOST")
      // Will want to display an alert to ask if the player wants to play this card
      setTargetDetermined(false)
      setTargetSelected(false)
      setTargetPanelShow(true)
      GlobalGameState.dieRolls = 0
      GlobalGameState.capHits = undefined
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
      GlobalGameState.phaseCompleted = false
      GlobalGameState.nextActionButtonDisabled = true
      GlobalGameState.updateGlobalState()
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.INITIATIVE_DETERMINATION) {
      GlobalGameState.sideWithInitiative = undefined
      setInitiativePanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_TARGET_SELECTION) {
      setAttackTargetsSelected(false)
      setAttackTargetPanelShow(true)
      GlobalGameState.carrierAttackHits = 0
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH && GlobalGameState.isFirstAirOp) {
      setSearchValuesAlertShow(true)
      GlobalGameState.isFirstAirOp = false
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_ATTACK_1) {
      GlobalGameState.dieRolls = []
      GlobalGameState.carrierHitsDetermined = false
      GlobalGameState.carrierAttackHitsThisAttack = 0
      GlobalGameState.currentCarrierAttackTarget = GlobalGameState.carrierTarget1
      GlobalGameState.eliminatedAirUnits = new Array()
      GlobalGameState.midwayHits = 0
      GlobalGameState.midwayHitsThisAttack = 0
      setAttackResolved(false)
      setAttackResolutionPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_ATTACK_2) {
      GlobalGameState.carrierAttackHits = 0
      GlobalGameState.carrierAttackHitsThisAttack = 0
      GlobalGameState.dieRolls = []
      GlobalGameState.carrierHitsDetermined = false
      GlobalGameState.currentCarrierAttackTarget = GlobalGameState.carrierTarget2
      GlobalGameState.carrierTarget2 = ""
      GlobalGameState.eliminatedAirUnits = new Array()
      setAttackResolutionPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_DAMAGE_RESOLUTION) {
      GlobalGameState.dieRolls = []
      setAttackResolutionPanelShow(false)
      setCarrierDamagePanelShow(true)
      setAttackResolved(false)
      GlobalGameState.carrierDamageRoll = undefined
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION) {
      GlobalGameState.dieRolls = []
      setAttackResolutionPanelShow(false)
      setMidwayDamagePanelShow(true)
      setAttackResolved(false)
    }
  }, [GlobalGameState.gamePhase])
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_INTERCEPTION) {
      setFightersPresent(true)
      setCapInterceptionPanelShow(true)
      setCapSteps(0)
      setCapAirUnits([])
      GlobalInit.controller.setAllDefendersToNotIntercepting()
      GlobalGameState.dieRolls = 0
      GlobalGameState.carrierAttackHits = 0
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
    ) {
      setEliminatedSteps(0)
      setDamageAllocationPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
      setEliminatedSteps(0)
      setDamageAllocationPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK) {
      GlobalGameState.dieRolls = 0
      GlobalGameState.dieRolls = []
      GlobalGameState.fighterHits = 0
      setEscortPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
      GlobalGameState.dieRolls = 0
      GlobalGameState.antiaircraftHits
      setAaaPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  const onDrag = () => {
    setIsMoveable(true)
  }
  const onStop = () => {
    setIsMoveable(false)
  }

  const setUsFleetRegions = () => {
    GlobalGameState.phaseCompleted = true // may just want to skip any fleet movement (leave fleet where it is)
    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    const usRegion = allHexesWithinDistance(csfLocation.currentHex, 2, true)
    setUSMapRegions(usRegion)
    setFleetMoveAlertShow(true)
  }

  const setJapanFleetRegions = () => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT && GlobalGameState.gameTurn === 1) {
      if (GlobalGameState.midwayAttackDeclaration === true) {
        setJapanMapRegions(japanAF1StartHexesMidway)
      } else {
        setJapanMapRegions(japanAF1StartHexesNoMidway)
      }
    } else {
      const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const jpRegion = allHexesWithinDistance(af1Location.currentHex, 2, true)
      setJapanMapRegions(jpRegion)
    }
    setFleetMoveAlertShow(true)
  }

  // TODO Move into load handler
  const loadState = () => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      const carrier = GlobalGameState.getJapanCarrier()
      determineAllUnitsDeployedForCarrier(GlobalInit.controller, GlobalUnitsModel.Side.JAPAN, carrier)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
      const carrier = GlobalGameState.getUSCarrier()
      determineAllUnitsDeployedForCarrier(GlobalInit.controller, GlobalUnitsModel.Side.US, carrier)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET) {
      setUSMapRegions(usCSFStartHexes)
      if (!GlobalGameState.usFleetPlaced) {
        setCSFAlertShow(true)
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
      setMidwayDialogShow(true)
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      if (!GlobalGameState.usFleetMoved) {
        setUsFleetRegions()
      } else {
        setUSMapRegions([])

        GlobalGameState.phaseCompleted = true
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
      setJapanFleetRegions()
      GlobalGameState.phaseCompleted = GlobalGameState.jpFleetMoved
      // } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      //   setJapanMapRegions([])
      //   GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
      setJapanMapRegions([])

      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
      setJapanMapRegions([])

      GlobalGameState.phaseCompleted = true
    } else if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
    ) {
      GlobalGameState.phaseCompleted = false
      if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
        setJapanStrikePanelEnabled(true)
        setUsStrikePanelEnabled(false)
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
          if (GlobalGameState.midwayAirOp === 1) {
            let distance = GlobalInit.controller.numHexesBetweenFleets(
              { name: "1AF", side: GlobalUnitsModel.Side.JAPAN },
              { name: "MIDWAY" }
            )
            calcAirOpsPointsMidway(distance)
          } else {
            GlobalGameState.airOperationPoints.japan = 1
          }
        }
      } else {
        setUsStrikePanelEnabled(true)
        setJapanStrikePanelEnabled(false)
      }
    }
    // If we don't do this, a drag and drop move fires a fleet update and the fleet does not move
    setFleetUnitUpdate(undefined)
    setStrikeGroupUpdate(undefined)
    GlobalGameState.updateGlobalState()
    const enabledJapanBoxes = getJapanEnabledAirBoxes()
    setEnabledJapanBoxes(() => enabledJapanBoxes)

    const enabledUSBoxes = getUSEnabledAirBoxes()
    setEnabledUSBoxes(() => enabledUSBoxes)
  }

  const nextAction = (e) => {
    if (e) {
      e.preventDefault()
    }

    handleAction({
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
      capSteps,
      capAirUnits,
      setAirUnitUpdate,
      setStrikeGroupUpdate,
      setEliminatedUnitsPanelShow,
    })
  }

  const testUi = async (e) => {
    await UITester({
      e,
      setTestClicked,
      setTestUpdate,
      setAttackAirCounterUpdate,
      setFleetUnitUpdate,
      setStrikeGroupUpdate,
      nextAction,
      doInitiativeRoll,
    })
  }

  var v = process.env.REACT_APP_MYVAR || "none"
  let test = false
  if (v === "test") {
    test = true
  }
  async function midwayStrikeReady() {
    const strikeGroups = GlobalInit.controller.getAllStrikeGroups(GlobalUnitsModel.Side.JAPAN)
    for (let sg of strikeGroups) {
      if (sg.moved !== true) {
        return false // if strike group has not moved we're not ready
      }
    }

    if (strikeGroups.length > 0) {
      return true
    }

    return false
  }
  async function endOfMidwayOperation() {
    if (GlobalGameState.midwayAirOpsCompleted < 2) {
      return false
    }
    const returningUnitsNotMoved = GlobalInit.controller.getReturningUnitsNotMoved(GlobalUnitsModel.Side.JAPAN)
    if (returningUnitsNotMoved) {
      return false
    } else {
      await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative)
    }

    // 2. CHECK ALL INTERCEPTING CAP UNITS HAVE RETURNED TO MIDWAY
    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.US)
    if (capUnitsReturning.length === 0) {
      return true
    }
    return false
  }
  async function endOfMyAirOperation(side) {
    if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS) {
      return false
    }
    const anyUnitsNotMoved = GlobalInit.controller.getStrikeGroupsNotMoved2(side)

    if (anyUnitsNotMoved) {
      return false
    }

    // 1. CHECK ALL STRIKE/RETURNING UNITS HAVE MOVED
    const returningUnitsNotMoved = GlobalInit.controller.getReturningUnitsNotMoved(side)
    if (returningUnitsNotMoved) {
      return false
    } else {
      await setStrikeGroupAirUnitsToNotMoved(GlobalGameState.sideWithInitiative)
    }

    const sideBeingAttacked =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
        ? GlobalUnitsModel.Side.JAPAN
        : GlobalUnitsModel.Side.US
    // 2. CHECK ALL INTERCEPTING CAP UNITS HAVE RETURNED TO CARRIERS
    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(sideBeingAttacked)
    if (capUnitsReturning.length === 0) {
      return true
    }
    return false
  }
  const getAllAirUnitsRequiringMoves = () => {
    // get list of units in stike boxes and return boxes still to move this air op
    if (GlobalGameState.sideWithInitiative === undefined) {
      return
    }

    // 1. Get Attacking Strike Units Ready to Return
    let units = GlobalInit.controller.getAirUnitsInStrikeBoxesReadyToReturn(GlobalGameState.sideWithInitiative)

    // 2. Get Units in return boxes for side with initiative
    let returningUnits = GlobalInit.controller.getAttackingReturningUnitsNotMoved(GlobalGameState.sideWithInitiative)

    // 3. Get Defending units in CAP return boxes
    const sideBeingAttacked =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
        ? GlobalUnitsModel.Side.JAPAN
        : GlobalUnitsModel.Side.US
    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(sideBeingAttacked)

    units = units.concat(returningUnits).concat(capUnitsReturning)

    for (let unit of units) {
      unit.border = true
    }
  }

  if (
    GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
    GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
  ) {
    getAllAirUnitsRequiringMoves()
  }

  const nextActionButtonDisabled = async () => {
    const prevButton = GlobalGameState.nextActionButtonDisabled
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      GlobalGameState.nextActionButtonDisabled = false
      return
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
      GlobalGameState.nextActionButtonDisabled = false
      return
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT && GlobalGameState.jpFleetPlaced) {
      GlobalGameState.nextActionButtonDisabled = false
      return
    }
    if (GlobalGameState.phaseCompleted) {
      GlobalGameState.nextActionButtonDisabled = false
      return
    } else {
    }
    let midwayStrikeGroupsReady = true
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      midwayStrikeGroupsReady = await midwayStrikeReady()
    } else {
      midwayStrikeGroupsReady = false
    }
    let endOfAirOps = false
    if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.MIDWAY_ATTACK) {
      endOfAirOps = await endOfMyAirOperation(GlobalGameState.sideWithInitiative, setAirUnitUpdate)
    } else {
      // @TODO Can have midway strike in first air op
      // need code to do this
      if (GlobalGameState.midwayAirOp === 2) {
        endOfAirOps = await endOfMidwayOperation()
      }
    }
    if (endOfAirOps) {
      GlobalGameState.nextActionButtonDisabled = false
    } else {
      GlobalGameState.nextActionButtonDisabled = true
    }
    if (midwayStrikeGroupsReady && GlobalGameState.midwayAirOp === 1) {
      GlobalGameState.nextActionButtonDisabled = false
    }
    if (prevButton !== GlobalGameState.nextActionButtonDisabled) {
      GlobalGameState.updateGlobalState()
    }
  }

  // const loc = GlobalInit.controller.getAirUnitLocation("Midway-F2A-3")
  // console.log("Midway-F2A-3 LOCATION=",loc) 
  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    let image = "/images/usaflag.jpg"
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK ||
      (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS &&
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN)
    ) {
      image = "/images/japanflag.jpg"
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
      image = "/images/bothflags.jpg"
    }
    let midwayMsg = ""
    nextActionButtonDisabled()
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_AIR_OPERATION) {
      GlobalGameState.nextActionButtonDisabled = false
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      if (GlobalGameState.midwayAirOp === 1) {
        midwayMsg = "(First Air Op)"
      } else {
        midwayMsg = "(Second Air Op)"
      }
    }

    return (
      <Navbar bg="black" data-bs-theme="dark" fixed="top" className="justify-content-between navbar-fixed-top">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Button className="me-1" size="sm" variant="outline-secondary" onClick={() => setGameStateShow(true)}>
                Game State
              </Button>
              <Button
                className="me-1"
                size="sm"
                variant="outline-primary"
                disabled={
                  !GlobalGameState.usCardsDrawn && GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_CARD_DRAW
                }
                onClick={(e) => {
                  GlobalGameState.phaseCompleted = true
                  GlobalGameState.usCardsDrawn = true
                  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_CARD_DRAW) {
                    nextAction(e)
                  }
                  setusHandShow(true)
                }}
              >
                US Hand
              </Button>
              <Button
                className="me-1"
                size="sm"
                variant="outline-danger"
                disabled={
                  !GlobalGameState.jpCardsDrawn && GlobalGameState.gamePhase !== GlobalGameState.PHASE.JAPAN_CARD_DRAW
                }
                onClick={(e) => {
                  GlobalGameState.phaseCompleted = true
                  GlobalGameState.jpCardsDrawn = true
                  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
                    nextAction(e)
                  }
                  setjpHandShow(true)
                }}
              >
                Japan Hand
              </Button>
              <Button
                className="me-1"
                size="sm"
                variant="outline-light"
                onClick={() => {
                  setSaveGameShow(true)
                }}
              >
                Save Game
              </Button>
              <Button
                className="me-1"
                size="sm"
                variant="outline-light"
                onClick={() => {
                  setJapanStrikePanelEnabled(() => !japanStrikePanelEnabled)
                }}
              >
                Hide SGs
              </Button>
            </Nav>

            <img src={image} alt="test" style={{ marginLeft: "120px" }} width="40px" height="30px" />
            <p
              className="navbar-text"
              style={{
                marginLeft: "5px",
                marginTop: "10px",
                marginRight: "35px",
              }}
            >
              {GlobalGameState.gamePhase} <br></br>
              {midwayMsg}
            </p>
            <p
              className="navbar-text"
              style={{
                marginLeft: "10px",
                marginTop: "17px",
                marginRight: "15px",
              }}
            >
              {GlobalGameState.getSetupMessage()}
            </p>

            <Nav>
              <Button
                size="sm"
                className="me-1"
                variant="secondary"
                onClick={(e) => nextAction(e)}
                disabled={GlobalGameState.nextActionButtonDisabled}
                style={{ background: "#9e1527" }}
              >
                Next Action
              </Button>
            </Nav>
            {test && (
              <Nav>
                <Button
                  size="sm"
                  className="me-1"
                  variant="secondary"
                  onClick={(e) => testUi(e)}
                  // disabled={!GlobalGameState.phaseCompleted}
                  style={{ background: "#9e1527" }}
                >
                  TEST
                </Button>
                {/* {testClicked && <TestComponent testClicked={testClicked}></TestComponent>} */}
              </Nav>
            )}

            <ButtonGroup className="ms-auto" aria-label="Basic example">
              <Button className="me-1" size="sm" variant="secondary" onClick={() => zoomIn()}>
                Zoom In
              </Button>
              <Button className="me-1" size="sm" variant="secondary" onClick={() => zoomOut()}>
                Zoom Out
              </Button>
              <Button className="me-1" size="sm" variant="secondary" onClick={() => resetTransform()}>
                Reset
              </Button>
            </ButtonGroup>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
  function gameStateHandler() {
    setGameState(!gameState)
  }

  function handleScaleChange(event) {
    setScale(event.instance.transformState.scale)
  }

  GlobalGameState.stateHandler = gameStateHandler

  // disable browser zoom (ctrl+ ctrl-)
  window.addEventListener(
    "keydown",
    function (e) {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.which === 61 || e.which === 107 || e.which === 173 || e.which === 109 || e.which === 187 || e.which === 189)
      ) {
        e.preventDefault()
      }
    },
    false
  )

  // usage
  window.addEventListener("devicepixelratiochange", function (e) {
    // note: change of devicePixelRatio means change of page zoom, but devicePixelRatio itself doesn't mean page zoom
    console.log("devicePixelRatio changed from " + e.oldValue + " to " + e.newValue)
  })

  function midwayYesHandler(e) {
    setMidwayDialogShow(false)
    GlobalGameState.midwayAttackDeclaration = true
    nextAction(e)
  }

  function midwayNoHandler(e) {
    GlobalGameState.midwayAttackDeclaration = false
    setMidwayDialogShow(false)
    nextAction(e)
  }

  function loadMyGame(id) {
    setLoading(() => true)
    loadHandler({
      controller: GlobalInit.controller,
      setTestClicked,
      setSplash,
      setAirUnitUpdate,
      setFleetUnitUpdate,
      setStrikeGroupUpdate,
      setDamageMarkerUpdate,
      loadState,
      id,
      setLoading,
    })
  }

  async function loady() {
    setSplash(false)
    setLoadPanelShow(true)
  }

  function splashy() {
    setSplash(false)
  }
  // window height
  const height = window.innerHeight

  // window width
  const width = window.innerWidth

  if (splash) {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <SplashScreen show={splash} splashy={splashy} loady={loady}></SplashScreen>
      </div>
    )
  }
  let jpAfText, usCsfText, usMidwayText, jpOpsText, usOpsText
  if (searchValues) {
    jpAfText = `1AF: Closest Fleet ${searchValues.jp_af} hexes away`
    usCsfText = `CSF: Closest Fleet ${searchValues.us_csf} hexes away`
    usMidwayText = `Midway: Closest Fleet ${searchValues.us_midway} hexes away`

    const usedPoints = GlobalGameState.midwayAirOpsCompleted
    let ptsStr = ""
    if (usedPoints > 0) {
      ptsStr = ` (${usedPoints} used in Midway Attack)`
    }
    jpOpsText = `Japan Air Operations Points${ptsStr}: ${searchResults.JAPAN}`
    usOpsText = `US Air Operations Points: ${searchResults.US}`
  }
  const targetHeaders = (
    <>
      <TargetHeaders
        controller={GlobalInit.controller}
        setTargetSelected={setTargetSelected}
        setTargetDetermined={setTargetDetermined}
      ></TargetHeaders>
    </>
  )

  const targetFooters = (
    <>
      <TargetFooters show={targetDetermined}></TargetFooters>
    </>
  )

  const attackTargetHeaders = (
    <>
      <AttackTargetHeaders
        controller={GlobalInit.controller}
        setAttackTargetsSelected={setAttackTargetsSelected}
        attackAirCounterUpdate={attackAirCounterUpdate}
      ></AttackTargetHeaders>
    </>
  )

  const attackTargetFooters = (
    <>
      <AttackTargetFooters show={targetDetermined}></AttackTargetFooters>
    </>
  )
  const capHeaders = (
    <>
      <CAPHeaders
        controller={GlobalInit.controller}
        capAirUnits={capAirUnits}
        setCapAirUnits={setCapAirUnits}
        capSteps={capSteps}
        setCapSteps={setCapSteps}
      ></CAPHeaders>
    </>
  )
  const damageHeaders = (
    <>
      <DamageHeaders
        controller={GlobalInit.controller}
        eliminatedSteps={eliminatedSteps}
        setEliminatedSteps={setEliminatedSteps}
        setStepsLeft={setStepsLeft}
        capAirUnits={
          GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION ? capAirUnits : undefined
        }
      ></DamageHeaders>
    </>
  )

  const damageFooters = (
    <>
      <DamageFooters
        eliminatedSteps={eliminatedSteps}
        capAirUnits={
          GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION ? capAirUnits : undefined
        }
      ></DamageFooters>
    </>
  )

  const escortHeaders = (
    <>
      <EscortHeaders controller={GlobalInit.controller}></EscortHeaders>
    </>
  )

  const escortFooters = (
    <>
      <EscortFooters></EscortFooters>
    </>
  )

  const numAAADice =
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.MIDWAY
      ? 2
      : Math.ceil(GlobalGameState.midwayGarrisonLevel / 2)

  const aaaHeaders = (
    <>
      <AAAHeaders numDice={numAAADice}></AAAHeaders>
    </>
  )

  const aaaFooters = (
    <>
      <AAAFooters></AAAFooters>
    </>
  )

  const capFooters = (
    <>
      <CAPFooters controller={GlobalInit.controller} setFightersPresent={setFightersPresent}></CAPFooters>
    </>
  )
  const airOpsFooters = (
    <>
      <AirOpsFooters controller={GlobalInit.controller}></AirOpsFooters>
    </>
  )
  const airOpsHeaders = (
    <>
      <AirOpsHeaders></AirOpsHeaders>
    </>
  )

  const attackResolutionHeaders = (
    <>
      <AttackResolutionHeaders controller={GlobalInit.controller}></AttackResolutionHeaders>
    </>
  )

  const attackResolutionFooters = (
    <>
      <AttackResolutionFooters totalHits={carrierHits}></AttackResolutionFooters>
    </>
  )

  // console.log("GlobalUnitsModel.usStrikeGroups=", GlobalUnitsModel.usStrikeGroups)
  function doInitiativeRoll(roll0, roll1) {
    // for testing QUACK
    doIntiativeRoll(GlobalInit.controller, 6, 1, true) // JAPAN initiative
    // doIntiativeRoll(GlobalInit.controller, 1, 6, true) // US initiative

    // doIntiativeRoll(GlobalInit.controller, roll0, roll1)
    GlobalGameState.updateGlobalState()
  }

  function doTargetSelectionRoll(roll0) {
    doSelectionRoll(GlobalInit.controller, roll0)

    setTargetDetermined(true)
    GlobalGameState.updateGlobalState()
  }

  function doCAPRolls() {
    doCAP(GlobalInit.controller, capAirUnits, fightersPresent)
    GlobalGameState.updateGlobalState()
  }

  function doCounterattackRolls() {
    doFighterCounterattack(GlobalInit.controller)
  }

  function doAntiAircraftRolls() {
    doAAAFireRolls(numAAADice)

    GlobalGameState.updateGlobalState()
  }

  function doMidwayRoll() {
    const box = doMidwayDamage(GlobalInit.controller)

    sendMidwayDamageUpdates(GlobalInit.controller, box, setDamageMarkerUpdate)
  }

  function doDamageRolls() {
    // Roll for bow or stern
    let damage
    if (carrierDamageRollNeeded(GlobalInit.controller)) {
      damage = doCarrierDamageRolls(GlobalInit.controller)
      GlobalGameState.damageThisAttack = damage
    } else {
      damage = autoAllocateDamage(GlobalInit.controller)
    }

    if (GlobalGameState.carrierAttackHits > 0) {
      sendDamageUpdates(GlobalInit.controller, damage, setDamageMarkerUpdate)
    }
    GlobalGameState.carrierAttackHits = 0
    setAttackResolved(() => true)
  }

  function doAttackResolutionRolls() {
    const hits = doAttackFireRolls(GlobalInit.controller)
    setCarrierHits(() => hits)
    GlobalGameState.dieRolls = []
    GlobalGameState.carrierHitsDetermined = true
  }

  function sendCapEvent() {
    doCAPEvent(GlobalInit.controller, capAirUnits)
  }

  function sendDamageEvent(eliminatedSteps) {
    doDamageEvent(GlobalInit.controller, eliminatedSteps)
  }

  function sendEscortEvent() {
    doEscortEvent(GlobalInit.controller)
  }

  function sendAAAEvent() {
    doAAAEvent(GlobalInit.controller)
  }

  function sendAttackSelectionEvent() {
    doAttackSelectionEvent(GlobalInit.controller)
  }

  function sendAttackResolutionEvent() {
    doAttackResolutionEvent(GlobalInit.controller, carrierHits)
  }

  function sendCarrierDamageEvent() {
    doCarrierDamageEvent(GlobalInit.controller)
  }

  if (GlobalGameState.capHits === undefined) {
    GlobalGameState.capHits = 0
  }
  if (GlobalGameState.fighterHits === undefined) {
    GlobalGameState.fighterHits = 0
  }
  if (GlobalGameState.antiaircraftHits === undefined) {
    GlobalGameState.antiaircraftHits = 0
  }
  let closeDamageButtonDisabled = false
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    closeDamageButtonDisabled = eliminatedSteps !== GlobalGameState.capHits && stepsLeft !== 0
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    closeDamageButtonDisabled = eliminatedSteps !== GlobalGameState.fighterHits && stepsLeft !== 0
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    closeDamageButtonDisabled = eliminatedSteps !== GlobalGameState.antiaircraftHits && stepsLeft != 0
  }

  const oldCarrierHits = GlobalInit.controller.getCarrierHits(GlobalGameState.currentCarrierAttackTarget)

  let carrieDamageDiceButtonDisabled =
    oldCarrierHits > 0 ||
    GlobalGameState.carrierAttackHits !== 1 ||
    (GlobalGameState.carrierAttackHits === 1 && attackResolved)

  const totalHits = GlobalGameState.midwayHits + GlobalGameState.totalMidwayHits
  let midwayDamageDiceButtonEnabled = GlobalGameState.midwayHits > 0 && totalHits < 3

  if (totalHits >= 3 && GlobalGameState.midwayHits > 0) {
    autoAllocateMidwayDamage(GlobalInit.controller)
  }

  let capInterceptionDiceButtonDisabled = capAirUnits.length === 0 || GlobalGameState.dieRolls.length > 0

  let airOpsDiceButtonDisabled =
    GlobalGameState.sideWithInitiative !== undefined && GlobalGameState.sideWithInitiative !== ""

  return (
    <>
      <LoadGamePanel
        show={loadPanelShow}
        loadIdHandler={setGameLoadID}
        loadMyGameHandler={loadMyGame}
        onHide={() => setLoadPanelShow(false)}
      ></LoadGamePanel>

      <SaveGamePanel
        saveGameState={saveGameState}
        setSaveAlertShow={setSaveAlertShow}
        show={saveGameShow}
        onHide={() => setSaveGameShow(false)}
        handler={setGameSaveID}
      ></SaveGamePanel>
      <AlertPanel show={alertShow} onHide={() => setAlertShow(false)}>
        <h4>ALERT</h4>
        <p>This air unit is not a fighter unit so cannot be used for CAP.</p>
      </AlertPanel>
      <AlertPanel show={!testClicked && csfAlertShow} onHide={() => setCSFAlertShow(false)}>
        <h4>INFO</h4>
        <p>Drag the US CSF Fleet Unit to any hex in the shaded blue area of the map.</p>
      </AlertPanel>
      <AlertPanel show={!testClicked && jpAlertShow} onHide={() => setJpAlertShow(false)}>
        <h4>INFO</h4>
        <p>Drag the Japanese 1AF Fleet Unit to any hex in the shaded red area of the map.</p>
      </AlertPanel>
      <AlertPanel show={!testClicked && fleetMoveAlertShow} onHide={() => setFleetMoveAlertShow(false)}>
        <h4>INFO</h4>
        <p>
          Drag the Fleet Unit to any hex in the shaded area of the map, or press Next Action to leave fleet in current
          location.
        </p>
      </AlertPanel>
      <AlertPanel
        show={!testClicked && endOfAirOpAlertShow}
        onHide={(e) => {
          setEndOfAirOpAlertShow(false)
          nextAction(e)
        }}
      >
        <h4
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          INFO
        </h4>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>End of Air Operation!</p>
          <br></br>
          <p>Click "Close" to continue...</p>
        </div>
      </AlertPanel>
      <AlertPanel
        show={!testClicked && searchValuesAlertShow}
        size={4}
        onHide={(e) => {
          setSearchValuesAlertShow(false)
          nextAction(e)
        }}
      >
        <h4>SEARCH PHASE: OPS POINTS</h4>
        <p>Search Values:</p>
        <ul>
          <li>{jpAfText}</li>
          <li>{usCsfText}</li>
          <li>{usMidwayText}</li>
        </ul>
        <p></p>
        <p>Search Results: </p>
        <ul>
          <li>{jpOpsText}</li>
          <li>{usOpsText}</li>
        </ul>
      </AlertPanel>
      <AlertPanel
        show={!testClicked && midwayNoAttackAlertShow}
        onHide={() => {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
          setMidwayNoAttackAlertShow(false)
          GlobalGameState.updateGlobalState()
        }}
      >
        <h4>INFO</h4>
        <p>No Midway attack declared this turn.</p>
      </AlertPanel>
      <YesNoDialog
        show={!testClicked && midwayDialogShow}
        yesHandler={(e) => midwayYesHandler(e)}
        noHandler={(e) => midwayNoHandler(e)}
      >
        <h4>MIDWAY BASE ATTACK DECLARATION</h4>
        <p>Do you want to attack Midway this turn?</p>
      </YesNoDialog>
      <AlertPanel show={saveAlertShow} onHide={() => setSaveAlertShow(false)}>
        <h4 style={{ justifyContent: "center", alignItems: "center" }}>INFO</h4>
        <p>Game State Successfully Saved!</p>
        <p>Game Id = {gameSaveID} </p>
      </AlertPanel>
      <DicePanel
        numDice={2}
        show={!testClicked && initiativePanelShow}
        headerText="Air Ops Initiative"
        headers={airOpsHeaders}
        footers={airOpsFooters}
        showDice={true}
        margin={25}
        onHide={(e) => {
          setInitiativePanelShow(false)
          nextAction(e)
        }}
        doRoll={doInitiativeRoll}
        diceButtonDisabled={airOpsDiceButtonDisabled}
        closeButtonDisabled={!airOpsDiceButtonDisabled}
      ></DicePanel>
      <DicePanel
        numDice={1}
        show={targetPanelShow}
        headerText="Target Determination"
        headers={targetHeaders}
        footers={targetFooters}
        width={30}
        showDice={targetSelected}
        margin={315}
        diceButtonDisabled={targetSelected === targetDetermined}
        closeButtonDisabled={!targetDetermined}
        onHide={(e) => {
          setTargetPanelShow(false)
          nextAction(e)
        }}
        doRoll={doTargetSelectionRoll}
        disabled={true}
      ></DicePanel>
      <DicePanel
        show={attackTargetPanelShow}
        headerText="Attack Target Selection"
        numDice={0}
        headers={attackTargetHeaders}
        footers={attackTargetFooters}
        width={30}
        showDice={true}
        margin={435}
        closeButtonDisabled={!attackTargetsSelected}
        closeButtonStr="Next..."
        onHide={(e) => {
          setAttackTargetPanelShow(false)
          sendAttackSelectionEvent()
          nextAction(e)
        }}
        disabled={true}
      ></DicePanel>
      <LargeDicePanel
        numDice={capSteps}
        diceButtonDisabled={capInterceptionDiceButtonDisabled}
        closeButtonDisabled={!capInterceptionDiceButtonDisabled}
        show={capInterceptionPanelShow}
        headerText="CAP Interception"
        headers={capHeaders}
        footers={capFooters}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setCapInterceptionPanelShow(false)
          if (capAirUnits.length > 0) {
            sendCapEvent()
          }
          nextAction(e)
        }}
        doRoll={doCAPRolls}
        disabled={true}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={0}
        show={damageAllocationPanelShow}
        headerText="Damage Allocation"
        headers={damageHeaders}
        footers={damageFooters}
        width={74}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setDamageAllocationPanelShow(false)
          sendDamageEvent(eliminatedSteps)
          nextAction(e)
        }}
        doRoll={doDamageAllocation}
        disabled={true}
        closeButtonDisabled={closeDamageButtonDisabled}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={getNumEscortFighterSteps(GlobalInit.controller)}
        show={escortPanelShow}
        headerText="Escort Counterattack"
        headers={escortHeaders}
        footers={escortFooters}
        // width={100}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setEscortPanelShow(false)
          sendEscortEvent()
          nextAction(e)
        }}
        doRoll={doCounterattackRolls}
        diceButtonDisabled={GlobalGameState.dieRolls.length !== 0}
        closeButtonDisabled={
          GlobalGameState.dieRolls.length === 0 && getNumEscortFighterSteps(GlobalInit.controller) !== 0
        }
        disabled={false}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={numAAADice}
        show={aaaPanelShow} // also check for any attacking steps left
        headerText="Anti-Aircraft Fire"
        headers={aaaHeaders}
        footers={aaaFooters}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setAaaPanelShow(false)
          sendAAAEvent()
          nextAction(e)
        }}
        doRoll={doAntiAircraftRolls}
        diceButtonDisabled={GlobalGameState.dieRolls !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls === 0}
        disabled={false}
      ></LargeDicePanel>

      <AttackDicePanel
        // numDice={GlobalInit.controller.getAttackingStepsRemainingTEST()}
        controller={GlobalInit.controller}
        numDice={numDiceToRoll}
        show={attackResolutionPanelShow}
        headerText="Attack Resolution"
        headers={attackResolutionHeaders}
        footers={attackResolutionFooters}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setAttackResolutionPanelShow(false)
          sendAttackResolutionEvent()
          nextAction(e)
        }}
        doRoll={doAttackResolutionRolls}
        width={74}
        closeButtonStr="Next..."
        closeButtonCallback={
          !attackResolved
            ? (e) => {
                if (GlobalGameState.currentCarrierAttackTarget !== GlobalUnitsModel.Carrier.MIDWAY) {
                  sendAttackResolutionEvent()
                }
                GlobalGameState.dieRolls = []
                setNumDiceToRoll(carrierHits)
                nextAction(e)
              }
            : (e) => {
                setAttackResolutionPanelShow(false)
                nextAction(e)
              }
        }
        diceButtonDisabled={GlobalGameState.dieRolls.length !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls.length === 0 && !attackResolved}
        disabled={false}
      ></AttackDicePanel>

      <CarrierDamageDicePanel
        numDice={1}
        controller={GlobalInit.controller}
        show={carrierDamagePanelShow}
        headerText="Carrier Damage"
        showDice={GlobalGameState.currentCarrierAttackTarget !== GlobalUnitsModel.Carrier.MIDWAY}
        margin={0}
        onHide={(e) => {
          setCarrierDamagePanelShow(false)
          nextAction(e)
        }}
        doRoll={doDamageRolls}
        width={30}
        closeButtonStr="Next..."
        closeButtonCallback={(e) => {
          setCarrierDamagePanelShow(false)
          sendCarrierDamageEvent()
          nextAction(e)
        }}
        diceButtonDisabled={carrieDamageDiceButtonDisabled}
        closeButtonDisabled={!carrieDamageDiceButtonDisabled}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        disabled={false}
      ></CarrierDamageDicePanel>
      <MidwayDamageDicePanel
        numDice={1}
        controller={GlobalInit.controller}
        show={midwayDamagePanelShow}
        headerText="Midway Base Damage"
        headers={attackResolutionHeaders}
        footers={attackResolutionFooters}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setMidwayDamagePanelShow(false)
          nextAction(e)
        }}
        doRoll={doMidwayRoll}
        width={30}
        closeButtonStr="Next..."
        closeButtonCallback={(e) => {
          setMidwayDamagePanelShow(false)
          nextAction(e)
        }}
        diceButtonDisabled={!midwayDamageDiceButtonEnabled}
        closeButtonDisabled={midwayDamageDiceButtonEnabled}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        disabled={false}
      ></MidwayDamageDicePanel>
      <EliminatedReturningUnits
        controller={GlobalInit.controller}
        show={!testClicked && eliminatedUnitsPanelShow}
        headerText="Eliminated Air Units"
        margin={0}
        onHide={(e) => {
          setEliminatedUnitsPanelShow(false)
          GlobalGameState.orphanedAirUnits = new Array()
        }}
        width={30}
        closeButtonStr="Next..."
        closeButtonDisabled={false}
        disabled={false}
      ></EliminatedReturningUnits>
      <GameStatusPanel show={gameStateShow} gameState={gameState} onHide={() => setGameStateShow(false)} />
      <CardPanel show={jpHandShow} side={GlobalUnitsModel.Side.JAPAN} onHide={() => setjpHandShow(false)}></CardPanel>
      <CardPanel show={usHandShow} side={GlobalUnitsModel.Side.US} onHide={() => setusHandShow(false)}></CardPanel>
      <TransformWrapper
        initialScale={1}
        disabled={isMoveable}
        minScale={0.5}
        maxScale={6}
        limitToBounds={false}
        onTransformed={(e) => handleScaleChange(e)}
      >
        <Controls />

        <div className="d-flex p-2">
          {/* <GameStatePanel show={gameStateShow} gameState={gameState} /> */}
          <div
            style={{
              // marginTop: "70px",
              minHeight: "670px",
              minWidth: "1280px",
              maxHeight: "670px",
              maxWidth: "1280px",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <TransformComponent>
              <BoardContext.Provider
                value={{
                  controller: GlobalInit.controller,
                  gameStateHandler,
                  onDrag,
                  onStop,
                  scale,
                  airUnitUpdate,
                  testUpdate,
                  fleetUnitUpdate,
                  strikeGroupUpdate,
                  damageMarkerUpdate,
                  setAlertShow,
                  showZones,
                  USMapRegions,
                  setUSMapRegions,
                  japanMapRegions,
                  setJapanMapRegions,
                  enabledJapanBoxes,
                  enabledUSBoxes,
                  setEnabledUSBoxes,
                  setEnabledJapanBoxes,
                  setIsMoveable,
                  loading,
                }}
              >
                <Board
                  scale={scale}
                  USMapRegions={USMapRegions}
                  japanMapRegions={japanMapRegions}
                  japanStrikePanelEnabled={japanStrikePanelEnabled}
                  usStrikePanelEnabled={usStrikePanelEnabled}
                />
              </BoardContext.Provider>
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </>
  )
}
