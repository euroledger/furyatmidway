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
import Controller from "./controller/Controller"
import "./style.css"
import StateManager from "./model/StateManager"
import { allCards } from "./CardLoader"
import { processPlayedCard } from "./PlayerState/CardUtils"
import {
  doIntiativeRoll,
  doNavalBattleRoll,
  doNavalBombardmentRoll,
  doCVDamageControl,
  doSubmarineDamageRoll,
  doTroubledReconnaissanceRoll,
  doSelectionRoll,
  doCAP,
  doNightLanding,
  getNumEscortFighterSteps,
  doDamageAllocation,
  doMidwayLandBattleRoll,
  doCAPEvent,
  doDMCVSelectionEvent,
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
  sendDMCVUpdate,
} from "./DiceHandler"
import { determineAllUnitsDeployedForCarrier } from "./controller/AirUnitSetupHandler"

import {
  usCSFStartHexes,
  japanAF1StartHexesNoMidway,
  japanAF1StartHexesMidway,
  japanMIFStartHexes,
} from "./components/MapRegions"
import YesNoDialog from "./components/dialogs/YesNoDialog"
import { saveGameState } from "./SaveLoadGame"
import loadHandler from "./LoadHandler"
import { allHexesWithinDistance, removeHexFromRegion } from "./components/HexUtils"
import DicePanel from "./components/dialogs/DicePanel"
import LargeDicePanel from "./components/dialogs/LargeDicePanel"
import AttackDicePanel from "./components/dialogs/AttackDicePanel"
import MidwayInvasionDicePanel from "./components/dialogs/MidwayInvasionDicePanel"
import CarrierDamageDicePanel from "./components/dialogs/CarrierDamageDicePanel"
import MidwayDamageDicePanel from "./components/dialogs/MidwayDamageDicePanel"
import EliminatedReturningUnits from "./components/dialogs/EliminatedReturningUnitsPanel"
import CardAlertPanel from "./components/dialogs/CardAlertPanel"
import PoopCardAlertPanel from "./components/dialogs/PoopCardAlertPanel"
import { AirOpsHeaders, AirOpsFooters } from "./attackscreens/AirOpsDataPanels"
import { TargetHeaders, TargetFooters } from "./attackscreens/TargetPanel"
import { AttackTargetHeaders, AttackTargetFooters } from "./attackscreens/AttackTargetPanel"
import { CAPHeaders, CAPFooters } from "./attackscreens/CAPPanel"
import NightLandingDicePanel from "./components/dialogs/NightLandingDicePanel"
import { NightHeaders, NightFooters } from "./attackscreens/NightLandingPanel"
import { DamageHeaders, DamageFooters } from "./attackscreens/DamageAllocationPanel"
import SubmarineAlertPanel from "./components/dialogs/SubmarineAlertPanel"
import {
  DMCVCarrierSelectionPanelHeaders,
  DMCVCarrierSelectionPanelFooters,
} from "./attackscreens/DMCVCarrierSelectionPanel"
import { TowedCVHeaders, TowedCVFooters } from "./attackscreens/TowedCVPanel"
import { StrikeLostDamageHeaders, StrikeLostDamageFooters } from "./attackscreens/StrikeLostDamagePanel"
import {
  CarrierPlanesDitchDamageHeaders,
  CarrierPlanesDitchDamageFooters,
} from "./attackscreens/CarrierPlanesDitchDamagePanel"
import { DamageControlPanelHeaders, DamageControlPanelFooters } from "./attackscreens/DamageControlPanel"
import { SubmarineDamagePanelHeaders, SubmarineDamagePanelFooters } from "./attackscreens/SubmarineDamagePanel"
import { SeaBattleDamagePanelHeaders, SeaBattleDamagePanelFooters } from "./attackscreens/SeaBattleDamagePanel"
import { EndOfTurnSummaryHeaders, EndOfTurnSummaryFooters } from "./attackscreens/EndOfTurnSummaryPanel"
import { EscortHeaders, EscortFooters } from "./attackscreens/EscortPanel"
import { AAAHeaders, AAAFooters } from "./attackscreens/AAAPanel"
import { AttackResolutionHeaders, AttackResolutionFooters } from "./attackscreens/AttackResolutionPanel"

import { CardAlertHeaders, CardAlertFooters } from "./attackscreens/PlayCardPanel"

import { NavalBombardmentHeader, NavalBombardmentFooter } from "./attackscreens/NavalBombardmentPanel"
import { TroubledReconnaissanceHeader, TroubledReconnaissanceFooter } from "./attackscreens/TroubledReconnaissancePanel"

import { AirReplacementsHeaders, AirReplacementsFooters } from "./attackscreens/AirReplacementsPanel"

import UITester from "./UIEvents/UITester"
import UITesterHeadless from "./UIEvents/UITesterHeadless"

import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"
import handleAction, { calcAirOpsPointsMidway, getFleetsForDMCVSeaBattle, midwayPossible } from "./GameStateHandler"
import { setStrikeGroupAirUnitsToNotMoved } from "./controller/AirOperationsHandler"
import { SeaBattleFooters, SeaBattleHeaders } from "./attackscreens/SeaBattlePanel"
import HexCommand from "./commands/HexCommand"
import { displayScreen } from "./PlayerState/StateUtils"

export default App

export const BoardContext = createContext()



export function App() {
  const [splash, setSplash] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [enabledJapanBoxes, setEnabledJapanBoxes] = useState([])
  const [enabledUSBoxes, setEnabledUSBoxes] = useState([])

  const [enabledJapanFleetBoxes, setEnabledJapanFleetBoxes] = useState(false)
  const [enabledUSFleetBoxes, setEnabledUSFleetBoxes] = useState(false)

  const [japanStrikePanelEnabled, setJapanStrikePanelEnabled] = useState(false)
  const [usStrikePanelEnabled, setUsStrikePanelEnabled] = useState(false)

  const [enabledJapanReorgBoxes, setEnabledJapanReorgBoxes] = useState(false)
  const [enabledUSReorgBoxes, setEnabledUSReorgBoxes] = useState(false)

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
  const [testyClicked, setTestyClicked] = useState(false)

  const [csfAlertShow, setCSFAlertShow] = useState(false)
  const [headerText, setHeaderText] = useState("")

  const [saveGameShow, setSaveGameShow] = useState(false)
  const [newGame, setNewGame] = useState(false)

  const [gameSaveID, setGameSaveID] = useState("")
  const [gameLoadID, setGameLoadID] = useState("")

  const [loadPanelShow, setLoadPanelShow] = useState(false)
  const [jpAlertShow, setJpAlertShow] = useState(false)

  const [endOfAirOpAlertShow, setEndOfAirOpAlertShow] = useState(false)

  const [saveAlertShow, setSaveAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text
  const [midwayWarningShow, setMidwayWarningShow] = useState(false)

  const [midwayAIInfoShow, setMidwayAIInfoShow] = useState(false)

  const [midwayDialogShow, setMidwayDialogShow] = useState(false)
  const [fleetMoveAlertShow, setFleetMoveAlertShow] = useState(false)
  const [midwayNoAttackAlertShow, setMidwayNoAttackAlertShow] = useState(false)
  const [searchValuesAlertShow, setSearchValuesAlertShow] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [searchResults, setSearchResults] = useState({})

  const [clickedOnSomething, setClickedOnSomething] = useState(false)
  const [alertShow, setAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text
  const [jpHandShow, setjpHandShow] = useState(false)
  const [usHandShow, setusHandShow] = useState(false)

  const [gameStateShow, setGameStateShow] = useState(false)
  const [initiativePanelShow, setInitiativePanelShow] = useState(false)

  const [cardPlayedPanelShow, setCardPlayedPanelShow]  = useState(false)

  const [seaBattlePanelShow, setSeaBattlePanelShow] = useState(false)
  const [seaBattleDamagePanelShow, setSeaBattleDamagePanelShow] = useState(false)

  const [targetPanelShow, setTargetPanelShow] = useState(false)

  const [fleetTargetSelectionPanelShow, setFleetTargetSelectionPanelShow] = useState(false)

  const [cardDicePanelShow5, setCardDicePanelShow5] = useState(false)
  const [cardDicePanelShow7, setCardDicePanelShow7] = useState(false)

  const [attackTargetPanelShow, setAttackTargetPanelShow] = useState(false)
  const [attackResolutionPanelShow, setAttackResolutionPanelShow] = useState(false)
  const [carrierDamagePanelShow, setCarrierDamagePanelShow] = useState(false)
  const [eliminatedUnitsPanelShow, setEliminatedUnitsPanelShow] = useState(false)

  const [midwayDamagePanelShow, setMidwayDamagePanelShow] = useState(false)

  const [capInterceptionPanelShow, setCapInterceptionPanelShow] = useState(false)

  const [initComplete, setInitComplete] = useState(false)
  const [nightLandingPanelShow, setNightLandingPanelShow] = useState(false)

  const [damageAllocationPanelShow, setDamageAllocationPanelShow] = useState(false)

  const [strikeLostPanelShow, setStrikeLostPanelShow] = useState(false)
  const [carrierPlanesDitchPanelShow, setCarrierPlanesDitchPanelShow] = useState(false)
  const [towedToFriendlyPortPanelShow, setTowedToFriendlyPortPanelShow] = useState(false)
  const [dmcvCarrierSelectionPanelShow, setDmcvCarrierSelectionPanelShow] = useState(false)
  const [damageControlPanelShow, setDamageControlPanelShow] = useState(false)
  const [submarineDamagePanelShow, setSubmarineDamagePanelShow] = useState(false)
  const [submarineAlertPanelShow, setSubmarineAlertPanelShow] = useState(false)

  const [midwayInvasionPanelShow, setMidwayInvasionPanelShow] = useState(false)

  const [airReplacementsPanelShow, setAirReplacementsPanelShow] = useState(false)

  const [endOfTurnSummaryShow, setEndOfTurnSummaryShow] = useState(false)

  const [cardAlertPanelShow, setCardAlertPanelShow] = useState(false)
  const [escortPanelShow, setEscortPanelShow] = useState(false)
  const [aaaPanelShow, setAaaPanelShow] = useState(false)

  const [damageDone, setDamageDone] = useState(false)
  const [seaBattleDamageDone, setSeaBattleDamageDone] = useState(false)

  const [capAirUnits, setCapAirUnits] = useState([])
  const [capSteps, setCapSteps] = useState(0)

  const [reorgAirUnits, setReorgAirUnits] = useState([])

  const [nightAirUnits, setNightAirUnits] = useState([])
  const [nightLandingDone, setNightLandingDone] = useState(false)
  const [nightSteps, setNightSteps] = useState(0)
  const [nightStepsLost, setNightStepsLost] = useState([])

  const [escortSteps, setEscortSteps] = useState(0)

  const [showCarrierDisplay, setShowCarrierDisplay] = useState(false)
  const [airReplacementsSelected, setAirReplacementsSelected] = useState(false)
  const [towedCVSelected, setTowedCVSelected] = useState("")
  const [DMCVCarrierSelected, setDMCVCarrierSelected] = useState("")

  const [damagedCV, setDamagedCV] = useState("")

  const [fightersPresent, setFightersPresent] = useState(true)

  const [selectedAirUnit, setSelectedAirUnit] = useState()

  const [previousPosition, setPreviousPosition] = useState(new Map())
  const [jpFleet, setJpFleet] = useState("")
  const [usFleet, setUsFleet] = useState("")

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

  const [dmcvShipMarkerUpdate, setDmcvShipMarkerUpdate] = useState({
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

  const [japanMIFMapRegions, setJapanMIFMapRegions] = useState([])

  // const [sideWithInitiative, setSideWithInitiative] = useState(undefined)

  const [targetDetermined, setTargetDetermined] = useState(false)

  const [attackTargetsSelected, setAttackTargetsSelected] = useState(false)

  const [attackResolved, setAttackResolved] = useState(false)

  const [targetSelected, setTargetSelected] = useState(false)

  const [eliminatedSteps, setEliminatedSteps] = useState(0)

  const [stepsLeft, setStepsLeft] = useState(0)

  const [carrierHits, setCarrierHits] = useState(-1)
  const [numDiceToRoll, setNumDiceToRoll] = useState(16)

  const [cardNumber, setCardNumber] = useState(0)

  const [showCardFooter, setShowCardFooter] = useState(false)

  const [showDice, setShowDice] = useState(false)

  // QUACK TESTING ONLY REMOVE THESE ***********
  // GlobalGameState.TESTING = true
  // GlobalGameState.carrierAttackHits = 3
  // *******************************************

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION) {
      setTargetDetermined(false)
      setTargetSelected(false)
      setTargetPanelShow(true)
      GlobalGameState.dieRolls = []
      GlobalGameState.capHits = undefined
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.FLEET_TARGET_SELECTION) {
      setTargetDetermined(false)
      setTargetSelected(false)
      GlobalGameState.taskForceTarget = ""
      setFleetTargetSelectionPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US
    ) {
      const side =
        GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
          ? GlobalUnitsModel.Side.JAPAN
          : GlobalUnitsModel.Side.US

      setNightLandingDone(false)
      GlobalGameState.sideWithInitiative = side // needed in view event handler

      if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US ||
        GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
      ) {
        let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(side)
        if (unitsReturn2.length > 0) {
          const steps = GlobalInit.controller.getTotalSteps(unitsReturn2)
          setNightSteps(steps)
          setNightAirUnits(unitsReturn2)
          setNightLandingPanelShow(true)
        }
      }
      GlobalGameState.phaseCompleted = false
      GlobalGameState.nextActionButtonDisabled = true
      GlobalGameState.updateGlobalState()
    }
  }, [GlobalGameState.gamePhase])

  // useEffect(() => {
  //   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.INITIATIVE_DETERMINATION) {
  //     GlobalGameState.dieRolls = []
  //     GlobalGameState.sideWithInitiative = undefined
  //     if (displayScreen) {
  //       setInitiativePanelShow(true)
  //     }
  //   }
  // }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN) {
      setCapAirUnits([])
      let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.JAPAN)

      let unitsAtSea = GlobalInit.controller.getAllStrikeUnits(GlobalUnitsModel.Side.JAPAN)

      if (unitsReturn2.length > 0 && unitsAtSea.length === 0 && !nightLandingDone) {
        console.log("found some units in return2")
        const steps = GlobalInit.controller.getTotalSteps(unitsReturn2)
        setNightSteps(steps)
        setNightAirUnits(unitsReturn2)
        setNightLandingPanelShow(true)
      }
    }
  }, [GlobalInit.controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.JAPAN).length])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_BATTLES_1) {
      GlobalGameState.dieRolls = []
      GlobalGameState.jpSeaBattleHits = 0
      GlobalGameState.usSeaBattleHits = 0
      setDamageDone(false)
      setDamagedCV("")
      const { numFleetsInSameHexAsCSF } = GlobalInit.controller.opposingFleetsInSameHex()
      if (numFleetsInSameHexAsCSF == 2) {
        setSeaBattlePanelShow(true)
      }
    }
  }, [GlobalGameState.gamePhase])
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_BATTLES_2) {
      GlobalGameState.dieRolls = []
      GlobalGameState.jpSeaBattleHits = 0
      GlobalGameState.usSeaBattleHits = 0
      setDamageDone(false)
      setDamagedCV("")
      const { numFleetsInSameHexAsUSDMCV } = GlobalInit.controller.opposingFleetsInSameHex()
      if (numFleetsInSameHexAsUSDMCV == 2) {
        getFleetsForDMCVSeaBattle(setJpFleet, setUsFleet)
        setSeaBattlePanelShow(true)
      }
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ATTACK_TARGET_SELECTION) {
      setAttackTargetsSelected(false)
      setAttackTargetPanelShow(true)
      GlobalGameState.carrierAttackHits = 0
    }
  }, [GlobalGameState.gamePhase])

  // useEffect(() => {
  //   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH && GlobalGameState.isFirstAirOp) {
  //     setSearchValuesAlertShow(true)
  //     GlobalGameState.isFirstAirOp = false
  //   }
  // }, [GlobalGameState.gamePhase])

  // useEffect(() => {
  //   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
  //     setEliminatedSteps(0)
  //     if (cardNumber === 2 || cardNumber === 4) {
  //       setDamagedCV("")
  //       GlobalGameState.dieRolls = []
  //     }
  //     if (cardNumber !== 0 && cardNumber !== -1) {
  //       setCardAlertPanelShow(true)
  //     } else {
  //       nextAction()
  //     }
  //   }
  // }, [GlobalGameState.gamePhase, cardNumber])

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
      setCarrierHits(-1)
      GlobalGameState.dieRolls = []
      setAttackResolutionPanelShow(false)
      setCarrierDamagePanelShow(true)
      setAttackResolved(false)
      setDamageDone(false)
      GlobalGameState.carrierDamageRoll = undefined
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      GlobalGameState.dieRolls = []
      GlobalGameState.midwayAttackGroup = undefined
      GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN
    }
  }, [GlobalGameState.gamePhase])
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_DAMAGE_RESOLUTION) {
      GlobalGameState.dieRolls = []
      setAttackResolutionPanelShow(false)
      setDamageDone(false)
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
      GlobalGameState.dieRolls = []
      GlobalGameState.capHits = 0
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
      GlobalGameState.dieRolls = []
      GlobalGameState.fighterHits = 0
      setEscortPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
      GlobalGameState.dieRolls = []
      GlobalGameState.antiaircraftHits
      setAaaPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_TURN) {
      GlobalGameState.JP_AF = 6 // in case card 6 was played
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION) {
      GlobalGameState.dieRolls = []
      if (GlobalGameState.semperFi) {
        GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
      }
      setMidwayInvasionPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  // useEffect(() => {
  //   if (
  //     GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING ||
  //     GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING ||
  //     GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT ||
  //     GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
  //   ) {
  //     GlobalGameState.updateGlobalState()
  //     setDMCVCarrierSelected(() => "")
  //   }
  // }, [GlobalGameState.gamePhase])


  // NEW AI-HUMAN SIDE EFFECTS....
  // useEffect(() => {
  //   StateManager.gameStateManager.setStateHandlers(stateObject)

  //   if (StateManager.gameStateManager.getCurrentPlayer() === GlobalUnitsModel.Side.JAPAN && StateManager.gameStateManager.actionComplete(GlobalUnitsModel.Side.JAPAN ) === false && splash===false) {
  //       StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN)
  //   }

  // }, [initComplete])

  // // NEW AI-HUMAN SIDE EFFECTS....
  useEffect(() => {

    StateManager.gameStateManager.setStateHandlers(stateObject)

    if (newGame) {
      if (StateManager.gameStateManager.getCurrentPlayer() === GlobalUnitsModel.Side.JAPAN && StateManager.gameStateManager.actionComplete(GlobalUnitsModel.Side.JAPAN ) === false && splash===false) {  
          StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN, stateObject)
      }
    }
    
  }, [initComplete])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
      StateManager.gameStateManager.setJapanState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN, stateObject)
    }
  }, [GlobalGameState.gamePhase])

  
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_CARD_DRAW) {
      StateManager.gameStateManager.setUSState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US, stateObject)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      StateManager.gameStateManager.setJapanState(stateObject)
      GlobalGameState.updateGlobalState()
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET) {
      GlobalGameState.setupPhase = 5 
      GlobalGameState.updateGlobalState()
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      StateManager.gameStateManager.setUSState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US, stateObject)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
      StateManager.gameStateManager.setUSState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US, stateObject)
      GlobalGameState.updateGlobalState()
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
      StateManager.gameStateManager.setJapanState(stateObject)

      // only show this for da human
      // midwayPossible(setMidwayWarningShow, setMidwayDialogShow)

      // call doAction  -> if human this will display the attack dialog 
      //                -> if AI make the decision and move on (alert needed to inform user of decision)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN, stateObject)

    }
  }, [GlobalGameState.gamePhase])


  useEffect(() => {
    if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT ||
        GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
        ) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
      setDMCVCarrierSelected(() => "")
      StateManager.gameStateManager.setJapanState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN,stateObject)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING ||
        GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
        ) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      setDMCVCarrierSelected(() => "")
      console.log("US FLEET MOVEMENT PLANNING set STATE")
      StateManager.gameStateManager.setUSState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US, stateObject)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT
        ) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      setDMCVCarrierSelected(() => "")
      StateManager.gameStateManager.setUSState(stateObject)
      StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US,stateObject)
    }
  }, [GlobalGameState.gamePhase])
  
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH && GlobalGameState.isFirstAirOp) {
      GlobalGameState.isFirstAirOp = false
      if (GlobalGameState.currentPlayer === GlobalUnitsModel.Side.US, stateObject) {
        StateManager.gameStateManager.setUSState(stateObject)
      } else {
        StateManager.gameStateManager.setJapanState(stateObject)
      }
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
      setEliminatedSteps(0)
      setHeaderText("Possible Card Play: Card #" + cardNumber)
      if (cardNumber === 2 || cardNumber === 4) {
        setDamagedCV("")
        GlobalGameState.dieRolls = []
      }
      if (cardNumber !== 0 && cardNumber !== -1) {
        if (GlobalGameState.currentPlayer === GlobalUnitsModel.Side.US) {
          StateManager.gameStateManager.setUSState(stateObject)
          StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US, stateObject)
        } else {
          StateManager.gameStateManager.setJapanState(stateObject)
          StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN, stateObject)
        }      
      } else {
        // nextAction()
      }
    }
  }, [GlobalGameState.gamePhase, cardNumber])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.INITIATIVE_DETERMINATION) {
      GlobalGameState.dieRolls = []
      GlobalGameState.sideWithInitiative = undefined

      // TODO AI vs AI needs adjusting
      if (displayScreen) {
        setInitiativePanelShow(true)
      } else {

        // maybe :-) ...........??
        doInitiativeRoll()
        nextAction()
      }
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
      GlobalGameState.phaseCompleted = false
      GlobalGameState.nextActionButtonDisabled = true
      setEnabledUSReorgBoxes(false)
      setEnabledJapanReorgBoxes(false)
      setEnabledJapanFleetBoxes(false)
      setEnabledUSFleetBoxes(false)
      GlobalGameState.updateGlobalState()
      if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US) {
        StateManager.gameStateManager.setUSState(stateObject)
        StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.US, stateObject)
        setUsStrikePanelEnabled(true) // for now. Move this in due course (only display for humans)
            
      } else {
        StateManager.gameStateManager.setJapanState(stateObject)
        StateManager.gameStateManager.doAction(GlobalUnitsModel.Side.JAPAN, stateObject)
        setJapanStrikePanelEnabled(true) // for now move this in due course (only display for humans)
      }
      
    }
  }, [GlobalGameState.gamePhase])

  const nextAction = () => {
    StateManager.gameStateManager.doNextState(GlobalGameState.currentPlayer)
  }
  // const nextAction = () => {
  //   handleAction({
  //     setUSMapRegions,
  //     setCSFAlertShow,
  //     setMidwayDialogShow,
  //     setMidwayWarningShow,
  //     setJapanMapRegions,
  //     setJapanMIFMapRegions,
  //     setJpAlertShow,
  //     setEndOfAirOpAlertShow,
  //     setEnabledJapanBoxes,
  //     setEnabledUSFleetBoxes,
  //     setEnabledJapanFleetBoxes,
  //     setUsFleet,
  //     setJpFleet,
  //     setEnabledUSBoxes,
  //     setInitiativePanelShow,
  //     setUsFleetRegions,
  //     setJapanFleetRegions,
  //     setMidwayNoAttackAlertShow,
  //     setFleetUnitUpdate,
  //     setSearchValues,
  //     setSearchResults,
  //     setSearchValuesAlertShow,
  //     setJapanStrikePanelEnabled,
  //     setUsStrikePanelEnabled,
  //     capSteps,
  //     capAirUnits,
  //     setAirUnitUpdate,
  //     setStrikeGroupUpdate,
  //     setEliminatedUnitsPanelShow,
  //     cardNumber,
  //     setCardNumber,
  //     setMidwayDialogShow,
  //     setEndOfTurnSummaryShow,
  //     setPreviousPosition,
  //     previousPosition,
  //   })
  // }
  const setUsFleetRegions = () => {
    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    const dmcvLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

    if (GlobalGameState.gameTurn === 4) {
      GlobalGameState.fleetSpeed = 4
      GlobalGameState.dmcvFleetSpeed = 2

      if (csfLocation !== undefined && csfLocation.currentHex !== undefined && csfLocation.currentHex.q >= 6) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
          setEnabledUSFleetBoxes(true)
        }
      }
      if (dmcvLocation !== undefined && dmcvLocation.currentHex.q >= 8) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
          setEnabledUSFleetBoxes(true)
        }
      }
    } else {
      GlobalGameState.fleetSpeed = 2
      GlobalGameState.dmcvFleetSpeed = 1
      if (csfLocation !== undefined && csfLocation.currentHex !== undefined && csfLocation.currentHex.q >= 8) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
          setEnabledUSFleetBoxes(true)
        }
      }
      if (dmcvLocation !== undefined && dmcvLocation.currentHex !== undefined && dmcvLocation.currentHex.q === 9) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
          setEnabledUSFleetBoxes(true)
        }
      }
    }
    const usDMCVLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      GlobalGameState.phaseCompleted = true // may just want to skip any fleet movement (leave fleet where it is)
      console.log("DEBUG csfLocation=", csfLocation)
      if (csfLocation.currentHex !== undefined) {
        let regionsMinusAllFleets = allHexesWithinDistance(csfLocation.currentHex, GlobalGameState.fleetSpeed, true)

        // remove hex with IJN DMCV
        // if (GlobalGameState.gameTurn !== 4) {
        if (usDMCVLocation !== undefined && usDMCVLocation.currentHex !== undefined) {
          regionsMinusAllFleets = removeHexFromRegion(regionsMinusAllFleets, usDMCVLocation.currentHex)
        }
        // }
        setUSMapRegions(regionsMinusAllFleets)

        setFleetMoveAlertShow(true)
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
      let usRegion
      const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

      if (
        csfLocation.currentHex === undefined &&
        (dmcvLocation.currentHex === undefined || dmcvLocation.boxName !== HexCommand.FLEET_BOX)
      ) {
        // both fleets have been removed from the map
        return
      }
      if (GlobalGameState.usDMCVFleetPlaced && dmcvLocation !== undefined) {
        usRegion = allHexesWithinDistance(dmcvLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      } else {
        usRegion = allHexesWithinDistance(csfLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      }
      if (csfLocation.currentHex !== undefined) {
        usRegion = removeHexFromRegion(usRegion, csfLocation.currentHex)
      }
      setUSMapRegions(usRegion)
    }
  }

  const cardEventHandler = (cardNumber) => {
    const title = allCards[cardNumber - 1].title
    let side = allCards[cardNumber - 1].side // @TODO can be BOTH

    const jpPlayedCard4 = GlobalInit.controller.getCardPlayed(4, GlobalUnitsModel.Side.JAPAN)

    // Decide on BOTH card play
    if (cardNumber === 4) {
      side = jpPlayedCard4 ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US
    }
    GlobalInit.controller.viewEventHandler({
      type: Controller.EventTypes.CARD_PLAY,
      data: {
        number: cardNumber,
        title,
        side,
      },
    })
  }

  const stateObject = {
    // FOR AI AND TESTING
    controller: GlobalInit.controller,
    cardEventHandler,
    setCardDicePanelShow7,
    setTestClicked,
    setCardPlayedPanelShow,
    setTestUpdate,
    setAttackAirCounterUpdate,
    setFleetUnitUpdate,
    setStrikeGroupUpdate,
    nextAction,
    setJapanStrikePanelEnabled,
    doInitiativeRoll,
    setCapAirUnits,
    setMidwayAIInfoShow,
    setCapSteps,
    setFightersPresent,
    getJapanEnabledAirBoxes,
    getUSEnabledAirBoxes,
    setEnabledJapanBoxes, 
    setEnabledUSBoxes,
    setUSMapRegions,
    setUsFleetRegions,
    setCSFAlertShow,
    capAirUnits,
    capSteps,
    fightersPresent,
    setCardNumber,
    cardNumber,
    setJapanMapRegions,
    setShowCardFooter,
    setJapanMIFMapRegions,
    setJpAlertShow,
    setEnabledJapanFleetBoxes,
    setMidwayNoAttackAlertShow,
    setFleetUnitUpdate, 
    setJpFleet,
    setUsFleet,
    setSearchValues,
    setSearchResults,
    setSearchValuesAlertShow,
    setUsStrikePanelEnabled,
    setJapanStrikePanelEnabled,
    setHeaderText,
    setMidwayDialogShow,
    setMidwayWarningShow,
    setCardAlertPanelShow
  }

  const onDrag = () => {
    setIsMoveable(true)
  }
  const onStop = () => {
    setIsMoveable(false)
  }

  const setJapanFleetRegions = () => {
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
      if (mifLocation !== undefined && mifLocation.currentHex.q <= 2) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
          setEnabledJapanFleetBoxes(true)
        }
      }
      if (ijnDMCVLocation !== undefined && ijnDMCVLocation.currentHex.q <= 2) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
          setEnabledJapanFleetBoxes(true)
        }
      }
    } else {
      GlobalGameState.fleetSpeed = 2
      GlobalGameState.dmcvFleetSpeed = 1
      if (af1Location !== undefined && af1Location.currentHex !== undefined && af1Location.currentHex.q <= 2) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
          setEnabledJapanFleetBoxes(true)
        }
      }
      if (mifLocation !== undefined && mifLocation.currentHex !== undefined && mifLocation.currentHex.q <= 1) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
          setEnabledJapanFleetBoxes(true)
        }
      }
      if (
        ijnDMCVLocation !== undefined &&
        ijnDMCVLocation.currentHex !== undefined &&
        ijnDMCVLocation.currentHex.q <= 1
      ) {
        // can move offboard
        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
          setEnabledJapanFleetBoxes(true)
        }
      }
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
      let jpRegion

      if (GlobalGameState.jpDMCVFleetPlaced && ijnDMCVLocation.currentHex !== undefined) {
        jpRegion = allHexesWithinDistance(ijnDMCVLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      } else {
        if (af1Location.currentHex !== undefined) {
          jpRegion = allHexesWithinDistance(af1Location.currentHex, GlobalGameState.dmcvFleetSpeed, true)
        }
      }
      // DMCV fleet cannot move to same hex as IJN 1AF or MIF Fleets
      // if both fleets have left map do not do this
      if (jpRegion !== undefined) {
        jpRegion = removeHexFromRegion(jpRegion, af1Location.currentHex)
        if (mifLocation !== undefined) {
          jpRegion = removeHexFromRegion(jpRegion, mifLocation.currentHex)
        }
        setJapanMapRegions(jpRegion)
      }

      return
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT && GlobalGameState.gameTurn === 1) {
      if (GlobalGameState.midwayAttackDeclaration === true) {
        setJapanMapRegions(japanAF1StartHexesMidway)
      } else {
        setJapanMapRegions(japanAF1StartHexesNoMidway)
      }
    } else {
      const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      if (af1Location.currentHex !== undefined) {
        let regionsMinusAllFleets = allHexesWithinDistance(af1Location.currentHex, GlobalGameState.fleetSpeed, true)

        // if (GlobalGameState.midwayAttackDeclaration === true) {
        //   let newHexArray = new Array()

        //   let hexesInRangeOfMidway = allHexesWithinDistance(Controller.MIDWAY_HEX.currentHex, 5, true)
        //   for (const hex of hexesInRangeOfMidway) {
        //     if (regionsMinusAllFleets.includes(hex)) {
        //       newHexArray.push(hex)
        //     }
        //   }
        //   regionsMinusAllFleets = newHexArray/
        // }

        setJapanMapRegions(regionsMinusAllFleets)
      }

      const mifLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
      if (mifLocation !== undefined && mifLocation.currentHex !== undefined) {
        let regionsMinusAllFleets = allHexesWithinDistance(mifLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
        if (GlobalGameState.gameTurn === 4) {
          setJapanMIFMapRegions(japanMIFStartHexes)
        } else {
          setJapanMIFMapRegions(regionsMinusAllFleets)
        }
      }
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
      midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      if (!GlobalGameState.usFleetMoved) {
        setUsFleetRegions()
      } else {
        setUSMapRegions([])

        GlobalGameState.phaseCompleted = true
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
      // For now - don't allow IJN Fleet Moves on reload

      // setJapanFleetRegions()
      // GlobalGameState.phaseCompleted = GlobalGameState.jpFleetMoved
      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
      setJapanMapRegions([])
      setJapanMIFMapRegions([])

      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
      GlobalInit.controller.setAllUnitsToNotMoved()
      setJapanMapRegions([])
      setJapanMIFMapRegions([])
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
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING) {
      let usRegion
      const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      if (GlobalGameState.usDMCVFleetPlaced) {
        const dmcvLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
        usRegion = allHexesWithinDistance(dmcvLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      } else {
        usRegion = allHexesWithinDistance(csfLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      }
      // DMCV fleet cannot move to same hex as JP 1AF Fleet NOT TRUE (it can't stay there!)
      // const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      // usRegion = removeHexFromRegion(usRegion, af1Location.currentHex)

      // DMCV fleet cannot move to same hex as US CSF Fleet
      usRegion = removeHexFromRegion(usRegion, csfLocation.currentHex)

      const dmcvLocation = GlobalInit.controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
      if (GlobalGameState.gameTurn === 4) {
        if (dmcvLocation !== undefined && dmcvLocation.currentHex.q >= 8) {
          // can move offboard
          setEnabledUSFleetBoxes(true)
        }
      } else {
        if (dmcvLocation !== undefined && dmcvLocation.currentHex.q === 9) {
          // can move offboard
          setEnabledUSFleetBoxes(true)
        }
      }
      setUSMapRegions(usRegion)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
      let jpRegion
      const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const mifLocation = GlobalInit.controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
      let dmcvLocation = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

      if (GlobalGameState.jpDMCVFleetPlaced && dmcvLocation !== undefined) {
        jpRegion = allHexesWithinDistance(dmcvLocation.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      } else {
        jpRegion = allHexesWithinDistance(af1Location.currentHex, GlobalGameState.dmcvFleetSpeed, true)
      }
      // DMCV fleet cannot move to same hex as IJN 1AF Fleet
      jpRegion = removeHexFromRegion(jpRegion, af1Location.currentHex)
      if (GlobalGameState.mifFleetPlaced) {
        jpRegion = removeHexFromRegion(jpRegion, mifLocation.currentHex)
      }
      if (GlobalGameState.gameTurn === 4) {
        if (dmcvLocation !== undefined && dmcvLocation.currentHex.q <= 2) {
          // can move offboard
          setEnabledJapanFleetBoxes(true)
        }
      } else {
        if (dmcvLocation !== undefined && dmcvLocation.currentHex.q === 1) {
          // can move offboard
          setEnabledJapanFleetBoxes(true)
        }
      }
      setJapanMapRegions(jpRegion)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.RETREAT_US_FLEET) {
      GlobalGameState.phaseCompleted = true
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



  const testUi = async (e, headless) => {
    if (headless) {
      setTestClicked(true)

      
      await UITesterHeadless(stateObject)
    } else {
      setTestyClicked(true)
      await UITester({
        e,
        setTestUpdate,
        setAttackAirCounterUpdate,
        setFleetUnitUpdate,
        setStrikeGroupUpdate,
        nextAction,
        doInitiativeRoll,
      })
    }
  }

  var v = process.env.REACT_APP_MYVAR || "none"
  let test = false
  if (v === "test") {
    test = true
  }

  async function midwayStrikeReady() {
    // TODO
    // check if 1st air op and no attack units on flight deck...allow next action

    if (GlobalGameState.midwayAttackResolved) {
      return true
    }
    const strikeGroups = GlobalInit.controller.getAllStrikeGroups(GlobalUnitsModel.Side.JAPAN)

    let midwaySGMoved = false
    for (let sg of strikeGroups) {
      if (sg.moved !== true) {
        return false // if strike group has not moved we're not ready
      }
      if (sg.name === GlobalGameState.midwayAttackGroup) {
        midwaySGMoved = true
      }
    }
    if (midwaySGMoved) {
      return true
    }
    return false
  }
  async function endOfMidwayOperation() {
    let groups = GlobalUnitsModel.jpStrikeGroups

    let index = 0
    for (let strikeGroup of groups.values()) {
      // if (strikeGroup.attacked) {
      //   index = 1
      //   break
      // }
      if (!strikeGroup.attacked) {
        index++
      }
    }
    if (index === 0) {
      return false
    }
    if (GlobalGameState.midwayAirOpsCompleted < 2 && GlobalInit.controller.getDistanceBetween1AFAndMidway() > 2) {
      return false
    }
    let unitsReturn1 = GlobalInit.controller.getAirUnitsInStrikeBoxesReadyToReturn(GlobalUnitsModel.Side.JAPAN)
    if (unitsReturn1.length > 0) {
      return false
    }

    // 2. CHECK ALL INTERCEPTING CAP UNITS HAVE RETURNED TO MIDWAY
    const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(GlobalUnitsModel.Side.US)
    if (capUnitsReturning.length > 0) {
      return false
    }
    if (GlobalGameState.midwayAttackResolved) {
      return true
    }

    return false
  }

  async function endOfMyNightAirOperations(side) {
    let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(side)
    if (unitsReturn2.length > 0) {
      return false
    }

    // 2. Units in Return 1 box must move to hangar as per normal rules
    let unitsReturn1 = GlobalInit.controller.getAttackingReturningUnitsNotMoved(side)
    if (unitsReturn1.length > 0) {
      return false
    }

    // 3. Units in CAP boxes must move to hangar
    const capUnits = GlobalInit.controller.getAllAirUnitsInCAPBoxes(side)
    if (capUnits.length > 0) {
      return false
    }
    return true
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

  const getAllAirUnitsRequiringMovesNightAirOperation = (side) => {
    // 1. Units in Return 2 box must attempt night landing
    let unitsAtSea = GlobalInit.controller.getAllStrikeUnits(side)

    let unitsReturn2 = GlobalInit.controller.getAllAirUnitsInReturn2Boxes(side)

    // 2. Units in Return 1 box must move to hangar as per normal rules
    let unitsReturn1 = GlobalInit.controller.getAttackingReturningUnitsNotMoved(side)

    // 3. Units in CAP boxes must move to hangar
    const capUnits = GlobalInit.controller.getAllAirUnitsInCAPBoxes(side)

    let units = unitsReturn2.concat(unitsReturn1).concat(capUnits).concat(unitsAtSea)

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

  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN) {
    getAllAirUnitsRequiringMovesNightAirOperation(GlobalUnitsModel.Side.JAPAN)
  }
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) {
    getAllAirUnitsRequiringMovesNightAirOperation(GlobalUnitsModel.Side.US)
  }
  const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  const nextActionButtonDisabled = async () => {
    const prevButton = GlobalGameState.nextActionButtonDisabled

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      GlobalGameState.nextActionButtonDisabled = false
      return
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
      return
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
      if (GlobalGameState.midwayAttackDeclaration) {
        // only allow end of phase if 1AF is within 5 hexes of Midway
        if (GlobalInit.controller.getDistanceBetween1AFAndMidway() <= 5) {
          GlobalGameState.nextActionButtonDisabled = false
        } else {
          GlobalGameState.nextActionButtonDisabled = true
        }
        return
      }
      if (GlobalGameState.gameTurn < 4) {
        if (GlobalGameState.jpFleetPlaced) {
          GlobalGameState.nextActionButtonDisabled = false
          return
        }
      } else {
        if (GlobalGameState.mifFleetPlaced) {
          GlobalGameState.nextActionButtonDisabled = false
          return
        } else {
          GlobalGameState.nextActionButtonDisabled = true
          return
        }
      }
    }
    if (GlobalGameState.phaseCompleted) {
      GlobalGameState.nextActionButtonDisabled = false
      return
    }

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      // 1. If strike has not moved -> Button Disabled
      const strikeReady = await midwayStrikeReady()
      if (!strikeReady) {
        GlobalGameState.nextActionButtonDisabled = true
        if (prevButton !== GlobalGameState.nextActionButtonDisabled) {
          GlobalGameState.updateGlobalState()
        }
        return
      }
      // 2. If AirOps =2 or less than 2 away -> check to see if attacked yet

      if (GlobalGameState.midwayAirOp === 2 || GlobalInit.controller.getDistanceBetween1AFAndMidway() <= 2) {
        const endOfAirOps = await endOfMidwayOperation()
        if (endOfAirOps) {
          GlobalGameState.nextActionButtonDisabled = false
        } else {
          GlobalGameState.nextActionButtonDisabled = true
        }
        if (prevButton !== GlobalGameState.nextActionButtonDisabled) {
          GlobalGameState.updateGlobalState()
        }
        return
      } else {
        // 3. If AirOps = 1 and less than 2 away -> check end of operation
        if (GlobalGameState.midwayAirOp === 1 && GlobalInit.controller.getDistanceBetween1AFAndMidway() <= 2) {
          const endOfAirOps = await endOfMidwayOperation()
          if (endOfAirOps) {
            GlobalGameState.nextActionButtonDisabled = false
          } else {
            GlobalGameState.nextActionButtonDisabled = true
          }
          if (prevButton !== GlobalGameState.nextActionButtonDisabled) {
            GlobalGameState.updateGlobalState()
          }
          return
        } else {
          GlobalGameState.nextActionButtonDisabled = false
          if (prevButton !== GlobalGameState.nextActionButtonDisabled) {
            GlobalGameState.updateGlobalState()
          }
        }
      }

      return
    }
    let endOfAirOps = false
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN) {
      endOfAirOps = await endOfMyNightAirOperations(GlobalUnitsModel.Side.JAPAN)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) {
      endOfAirOps = await endOfMyNightAirOperations(GlobalUnitsModel.Side.US)
    } else {
      endOfAirOps = await endOfMyAirOperation(GlobalGameState.sideWithInitiative)
    }
    if (endOfAirOps) {
      GlobalGameState.nextActionButtonDisabled = false
    } else {
      if (GlobalGameState.nextActionButtonDisabled === false) {
        GlobalGameState.nextActionButtonDisabled = true
        GlobalGameState.updateGlobalState()
      }
    }

    if (prevButton !== GlobalGameState.nextActionButtonDisabled) {
      GlobalGameState.updateGlobalState()
    }
  }

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    let image = "/images/usaflag.jpg"
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY ||
      GlobalGameState.gaFmePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION ||
      (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS &&
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN)
    ) {
      image = "/images/japanflag.jpg"
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_SEARCH) {
      image = "/images/bothflags.jpg"
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
      if (GlobalGameState.currentPlayer === GlobalUnitsModel.Side.JAPAN) {
        image = "/images/japanflag.jpg"
      }
    }
    let midwayMsg = ""
    nextActionButtonDisabled()
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.END_OF_AIR_OPERATION) {
      GlobalInit.controller.setAllDefendersToNotInterceptingAndNotSeparated()
      GlobalGameState.nextActionButtonDisabled = false
      GlobalGameState.elitePilots = false // reset for future air combats
    }
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
      if (GlobalGameState.midwayAirOp === 1) {
        midwayMsg = "(First Air Op)"
      } else {
        midwayMsg = "(Second Air Op)"
      }
    }
    const font="12px"
    return (
      <Navbar  style={{fontSize:font}} bg="black" data-bs-theme="dark" fixed="top" className="justify-content-between navbar-fixed-top">
        <Container  style={{fontSize:font}} >
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav   style={{fontSize:font}} className="mr-auto">
              <Button  style={{ marginLeft: "-4em", fontSize:font,}}
                className="me-1" size="sm" variant="outline-secondary" onClick={() => setGameStateShow(true)}>
                Game State
              </Button>
              <Button
              style={{fontSize:font}} 
                className="me-1"
                size="sm"
                variant="outline-primary"
                disabled={
                  !GlobalGameState.usCardsDrawn && GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_CARD_DRAW
                }
                onClick={(e) => {
                  if (
                    GlobalGameState.gamePhase === GlobalGameState.PHASE.US_CARD_DRAW ||
                    GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DRAWS_ONE_CARD
                  ) {
                    GlobalGameState.phaseCompleted = true
                  }
                  GlobalGameState.usCardsDrawn = true
                  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_DRAWS_ONE_CARD) {
                    GlobalInit.controller.drawUSCards(1, false)
                    nextAction(e)
                  }
                  setusHandShow(true)
                }}
              >
                US Hand
              </Button>
              <Button
              style={{fontSize:font}} 
                className="me-1"
                size="sm"
                variant="outline-danger"
                disabled={
                  !GlobalGameState.jpCardsDrawn && GlobalGameState.gamePhase !== GlobalGameState.PHASE.JAPAN_CARD_DRAW
                }
                onClick={(e) => {
                  if (
                    GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW ||
                    GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
                  ) {
                    GlobalGameState.phaseCompleted = true
                  }
                  GlobalGameState.jpCardsDrawn = true
                  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD) {
                    GlobalInit.controller.drawJapanCards(1, false)
                    // setMidwayDialogShow(true)
                    midwayPossible(setMidwayWarningShow, setMidwayDialogShow)

                    console.log("GOING TO JAPAN MIDWAY")
                    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_MIDWAY
                  }
                  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
                    // nextAction(e)
                  }
                  setjpHandShow(true)
                }}
              >
                Japan Hand
              </Button>
              <Button
              style={{fontSize:font}} 
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
              style={{fontSize:font}} 
                className="me-1"
                size="sm"
                variant="outline-light"
                onClick={() => {
                  setJapanStrikePanelEnabled(() => !japanStrikePanelEnabled)
                }}
              >
                Strike
              </Button>
              <Button
              style={{fontSize:font}} 
                className="me-1"
                size="sm"
                variant="outline-light"
                onClick={() => {
                  setEnabledJapanFleetBoxes(() => !enabledJapanFleetBoxes)
                  setEnabledUSFleetBoxes(() => !enabledUSFleetBoxes)
                }}
              >
                Fleet
              </Button>
              <Button
              style={{fontSize:font}} 
                className="me-1"
                size="sm"
                variant="outline-light"
                onClick={() => {
                  setEnabledJapanReorgBoxes(() => !enabledJapanReorgBoxes)
                  setEnabledUSReorgBoxes(() => !enabledUSReorgBoxes)
                }}
              >
                Reorg
              </Button>
            </Nav>

            <img
              src={image}
              alt="test"
              style={{ marginLeft: "40px", marginRight: "10px" }}
              width="40px"
              height="30px"
            />
            <p
              className="navbar-text"
              style={{
                marginLeft: "5px",
                marginTop: "15px",
                marginRight: "10px",
                // fontSize: "14px",
                color: "white"
              }}
            >
              {GlobalGameState.gamePhase} <br></br>
              {midwayMsg}
            </p>
            <p
              className="navbar-text"
              style={{
                marginLeft: "5px",
                marginTop: "17px",
                marginRight: "20px",
                // fontSize: "14px",
                color: "white"
              }}
            >
              {GlobalGameState.getSetupMessage()}
            </p>

            <Nav>
              {initComplete && (<Button
              
                size="sm"
                className="me-1"
                variant="secondary"
                onClick={(e) => nextAction(e)}
                disabled={GlobalGameState.nextActionButtonDisabled}
                style={{ marginLeft: "80px", background: "#9e1527", fontSize: font }}
              >
                Next Action
              </Button>)}
              {!initComplete && (<Button
                size="sm"
                className="me-1"
                variant="secondary"
                onClick={(e) =>{
                  GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_SETUP
                  setInitComplete(true)}}
                disabled={false}
                style={{ background: "#9e1527", fontSize: font }}
              >
                Japan AI Begin
              </Button>)}
            </Nav>
           
            <ButtonGroup style={{ marginRight: "-3.5em", fontSize:font}} className="ms-auto" aria-label="Basic example">
              <Button style={{fontSize:font}} className="me-1" size="sm" variant="secondary" onClick={() => zoomIn()}>
                Zoom In
              </Button>
              <Button style={{fontSize:font}} className="me-1" size="sm" variant="secondary" onClick={() => zoomOut()}>
                Zoom Out
              </Button>
              <Button style={{fontSize:font}} className="me-1" size="sm" variant="secondary" onClick={() => resetTransform()}>
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
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }

  function midwayNoHandler(e) {
    GlobalGameState.midwayAttackDeclaration = false
    setMidwayDialogShow(false)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
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
      setTowedCVSelected,
      setDamageMarkerUpdate,
      setDmcvShipMarkerUpdate,
      loadState,
      id,
      setLoading,
    })
    setInitComplete(true)
    StateManager.gameStateManager.setPlayerStates(GlobalGameState.jpPlayerType, GlobalGameState.usPlayerType)
  }


  async function loady() {
    setSplash(false)
    setLoadPanelShow(true)
  }

  function splashy() {
    setNewGame(true)
    StateManager.gameStateManager.setPlayerStates(GlobalGameState.jpPlayerType, GlobalGameState.usPlayerType)
    GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_SETUP
    GlobalGameState.sideWithInitiative = GlobalUnitsModel.Side.JAPAN
    setSplash(false)
    if (GlobalGameState.jpPlayerType === GlobalUnitsModel.TYPE.HUMAN) {
      setInitComplete(true)
    }
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
    if (GlobalInit.controller.allCarriersSunk(GlobalUnitsModel.Side.US)) {
      usCsfText = `CSF: Closest Fleet N/A (All US Carriers Sunk)`
    } else {
      usCsfText = `CSF: Closest Fleet ${searchValues.us_csf} hexes away`
    }
    if (GlobalInit.controller.allCarriersSunk(GlobalUnitsModel.Side.JAPAN)) {
      jpAfText = `1AF: Closest Fleet N/A (All IJN Carriers Sunk)`
    } else {
      jpAfText = `1AF: Closest Fleet ${searchValues.jp_af} hexes away`
    }
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
  const capFooters = (
    <>
      <CAPFooters controller={GlobalInit.controller} setFightersPresent={setFightersPresent}></CAPFooters>
    </>
  )

  let nSide =
    GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
  let nightSide = "Night Landing: " + nSide
  const nightHeaders = (
    <>
      <NightHeaders controller={GlobalInit.controller} side={nSide} night={setNightLandingDone}></NightHeaders>
    </>
  )
  const nightFooters = (
    <>
      <NightFooters controller={GlobalInit.controller}></NightFooters>
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
  const dmcvSide =
    GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const dmcvSelectionHeaders = (
    <>
      <DMCVCarrierSelectionPanelHeaders
        controller={GlobalInit.controller}
        setDMCVCarrierSelected={setDMCVCarrierSelected}
        DMCVCarrierSelected={DMCVCarrierSelected}
        side={dmcvSide}
      ></DMCVCarrierSelectionPanelHeaders>
    </>
  )
  const dmcvSelectionFooters = (
    <>
      <DMCVCarrierSelectionPanelFooters
        controller={GlobalInit.controller}
        DMCVCarrierSelected={DMCVCarrierSelected}
        side={dmcvSide}
        setDMCVCarrierSelected={setDMCVCarrierSelected}
        doDMCVShipMarkerUpdate={doDMCVShipMarkerUpdate}
      ></DMCVCarrierSelectionPanelFooters>
    </>
  )

  const jpPlayedCard2 = GlobalInit.controller.getCardPlayed(2, GlobalUnitsModel.Side.JAPAN)
  const damageControlSide = jpPlayedCard2 ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US

  const jpPlayedCard4 = GlobalInit.controller.getCardPlayed(4, GlobalUnitsModel.Side.JAPAN)
  const submarineControlSide = jpPlayedCard4 ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US
  const submarineHeaders = (
    <>
      <SubmarineDamagePanelHeaders
        controller={GlobalInit.controller}
        setDamagedCV={setDamagedCV}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        damagedCV={damagedCV}
        side={submarineControlSide}
        damageDone={damageDone}
        setDamageDone={setDamageDone}
      ></SubmarineDamagePanelHeaders>
    </>
  )
  const submarineFooters = (
    <>
      <SubmarineDamagePanelFooters
        controller={GlobalInit.controller}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        setDmcvShipMarkerUpdate={setDmcvShipMarkerUpdate}
        damagedCV={damagedCV}
        side={submarineControlSide}
        damageDone={damageDone}
        setDamageDone={setDamageDone}
      ></SubmarineDamagePanelFooters>
    </>
  )
  const damageControlHeaders = (
    <>
      <DamageControlPanelHeaders
        controller={GlobalInit.controller}
        setDamagedCV={setDamagedCV}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        damagedCV={damagedCV}
        side={damageControlSide}
      ></DamageControlPanelHeaders>
    </>
  )
  const damageControlFooters = (
    <>
      <DamageControlPanelFooters
        controller={GlobalInit.controller}
        DMCVCarrierSelected={DMCVCarrierSelected}
        side={damageControlSide}
        doDMCVShipMarkerUpdate={doDMCVShipMarkerUpdate}
      ></DamageControlPanelFooters>
    </>
  )

  const towedCVHeaders = (
    <>
      <TowedCVHeaders
        controller={GlobalInit.controller}
        towedCVSelected={towedCVSelected}
        setTowedCVSelected={setTowedCVSelected}
      ></TowedCVHeaders>
    </>
  )
  const towedCVFooters = (
    <>
      <TowedCVFooters controller={GlobalInit.controller} towedCVSelected={towedCVSelected}></TowedCVFooters>
    </>
  )
  const strikeLostDamageHeaders = (
    <>
      <StrikeLostDamageHeaders
        controller={GlobalInit.controller}
        eliminatedSteps={eliminatedSteps}
        setEliminatedSteps={setEliminatedSteps}
        setStepsLeft={setStepsLeft}
        cardNumber={cardNumber}
      ></StrikeLostDamageHeaders>
    </>
  )

  const strikeLostDamageFooters = (
    <>
      <StrikeLostDamageFooters eliminatedSteps={eliminatedSteps}></StrikeLostDamageFooters>
    </>
  )
  const carrierPlanesDitchDamageHeaders = (
    <>
      <CarrierPlanesDitchDamageHeaders
        controller={GlobalInit.controller}
        eliminatedSteps={eliminatedSteps}
        setEliminatedSteps={setEliminatedSteps}
        setStepsLeft={setStepsLeft}
        cardNumber={cardNumber}
      ></CarrierPlanesDitchDamageHeaders>
    </>
  )
  const carrierPlanesDitchDamageFooters = (
    <>
      <CarrierPlanesDitchDamageFooters eliminatedSteps={eliminatedSteps}></CarrierPlanesDitchDamageFooters>
    </>
  )
  const endOfTurnHeader =
    GlobalGameState.gameTurn !== 7 ? `End of Turn ${GlobalGameState.gameTurn} - Summary` : "End of Game Summary"
  const endOfTurnSummaryHeaders = (
    <>
      <EndOfTurnSummaryHeaders
        controller={GlobalInit.controller}
        eliminatedSteps={eliminatedSteps}
        setEliminatedSteps={setEliminatedSteps}
        setStepsLeft={setStepsLeft}
        cardNumber={cardNumber}
      ></EndOfTurnSummaryHeaders>
    </>
  )
  const endOfTurnSummaryFooters = (
    <>
      <EndOfTurnSummaryFooters eliminatedSteps={eliminatedSteps}></EndOfTurnSummaryFooters>
    </>
  )

  const escortHeaders = (
    <>
      <EscortHeaders controller={GlobalInit.controller} setCapAirUnits={setCapAirUnits}></EscortHeaders>
    </>
  )

  const escortFooters = (
    <>
      <EscortFooters></EscortFooters>
    </>
  )

  const airReplacementsHeaders = (
    <>
      <AirReplacementsHeaders
        controller={GlobalInit.controller}
        setShowCarrierDisplay={setShowCarrierDisplay}
        airReplacementsSelected={airReplacementsSelected}
        setAirReplacementsSelected={setAirReplacementsSelected}
        setClickedOnSomething={setClickedOnSomething}
        setSelectedAirUnit={setSelectedAirUnit}
      ></AirReplacementsHeaders>
    </>
  )

  const airReplacementsFooters = (
    <>
      <AirReplacementsFooters
        controller={GlobalInit.controller}
        clickedOnSomething={clickedOnSomething}
        setAirReplacementsSelected={setAirReplacementsSelected}
        showCarrierDisplay={showCarrierDisplay}
        selectedAirUnit={selectedAirUnit}
        airReplacementsSelected={airReplacementsSelected}
        setAirUnitUpdate={setAirUnitUpdate}
      ></AirReplacementsFooters>
    </>
  )
  
  const numAAADice =
    GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY
      ? Math.ceil(GlobalGameState.midwayGarrisonLevel / 2)
      : GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIF
      ? Math.ceil(GlobalGameState.midwayInvasionLevel / 2)
      : 2

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
  const showSeaBattleDice = !(jpFleet.includes("DMCV") || usFleet.includes("DMCV"))

  const seaBattleDiceButtonDisabled = !showSeaBattleDice || damageDone

  const seaBattleHeaders = (
    <>
      <SeaBattleHeaders showSeaBattleDice={showSeaBattleDice} jpFleet={jpFleet} usFleet={usFleet}></SeaBattleHeaders>
    </>
  )
  const seaBattleFooters = (
    <>
      <SeaBattleFooters
        controller={GlobalInit.controller}
        jpFleet={jpFleet}
        usFleet={usFleet}
        sendDamageUpdates={sendDamageUpdates}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        sendDMCVUpdate={sendDMCVUpdate}
        setDmcvShipMarkerUpdate={setDmcvShipMarkerUpdate}
        setDamageDone={setDamageDone}
        damageDone={damageDone}
      ></SeaBattleFooters>
    </>
  )
  const seaBattleDamageHeaders = (
    <>
      <SeaBattleDamagePanelHeaders
        controller={GlobalInit.controller}
        setDamagedCV={setDamagedCV}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        damagedCV={damagedCV}
        setSeaBattleDamageDone={setSeaBattleDamageDone}
        seaBattleDamageDone={seaBattleDamageDone}
        jpFleet={jpFleet}
      ></SeaBattleDamagePanelHeaders>
    </>
  )
  const seaBattleDamageCloseButtonDisabled = !seaBattleDamageDone

  const seaBattleDamageFooters = (
    <>
      <SeaBattleDamagePanelFooters
        controller={GlobalInit.controller}
        setDamageMarkerUpdate={setDamageMarkerUpdate}
        setDmcvShipMarkerUpdate={setDmcvShipMarkerUpdate}
        damagedCV={damagedCV}
        side={submarineControlSide}
        seaBattleDamageDone={seaBattleDamageDone}
        setSeaBattleDamageDone={setSeaBattleDamageDone}
      ></SeaBattleDamagePanelFooters>
    </>
  )

  const attackResolutionHeaders = (
    <>
      <AttackResolutionHeaders></AttackResolutionHeaders>
    </>
  )

  const attackResolutionFooters = (
    <>
      <AttackResolutionFooters
        totalHits={carrierHits}
        attackResolved={attackResolved}
        setAttackResolved={setAttackResolved}
        setFleetUnitUpdate={setFleetUnitUpdate}
      ></AttackResolutionFooters>
    </>
  )

  const cardAlertHeaders = (
    <>
      <CardAlertHeaders cardNumber={cardNumber} showCardFooter={showCardFooter}></CardAlertHeaders>
    </>
  )

  let cardDicePanelHeaders, cardDicePanelFooters

  if (cardNumber === 5) {
    cardDicePanelHeaders = (
      <>
        <NavalBombardmentHeader></NavalBombardmentHeader>
      </>
    )
    cardDicePanelFooters = (
      <>
        <NavalBombardmentFooter></NavalBombardmentFooter>
      </>
    )
  } else if (cardNumber === 7) {
    cardDicePanelHeaders = (
      <>
        <TroubledReconnaissanceHeader></TroubledReconnaissanceHeader>
      </>
    )
    cardDicePanelFooters = (
      <>
        <TroubledReconnaissanceFooter></TroubledReconnaissanceFooter>
      </>
    )
  }
  const cardAlertFooters = (
    <>
      <CardAlertFooters
        controller={GlobalInit.controller}
        showCardFooter={showCardFooter}
        cardNumber={cardNumber}
        setShowDice={setShowDice}
        doCriticalHit={doCriticalHit}
        attackResolved={attackResolved}
      ></CardAlertFooters>
    </>
  )



  function doSubmarine(roll) {
    doSubmarineDamageRoll(roll)
  }

  function doDamageControl(roll) {
    doCVDamageControl(roll)
  }


  function doCardRoll(roll) {
    if (cardNumber === 5) {
      doNavalBombardmentRoll(GlobalInit.controller, roll)

      if (GlobalGameState.midwayGarrisonLevel <= 3) {
        // Midway Base Destroyed
        allMidwayBoxesDamaged(GlobalInit.controller, setDamageMarkerUpdate)
      }
    } else if (cardNumber === 7) {
      doTroubledReconnaissanceRoll(GlobalInit.controller, roll)
    }
  }

  function doSeaBattleRoll(roll0, roll1) {
    doNavalBattleRoll(GlobalInit.controller, roll0, roll1)
  }
  // console.log("GlobalUnitsModel.usStrikeGroups=", GlobalUnitsModel.usStrikeGroups)
  function doInitiativeRoll(roll0, roll1) {
    // for testing QUACK
    // doIntiativeRoll(GlobalInit.controller, 6, 1, true) // JAPAN initiative
    doIntiativeRoll(GlobalInit.controller, 1, 6, true) // US initiative

    // doIntiativeRoll(GlobalInit.controller, 3, 3, true) // tie

    // doIntiativeRoll(GlobalInit.controller, roll0, roll1)
    GlobalGameState.updateGlobalState()
  }

  function doTargetSelectionRoll(roll0) {
    doSelectionRoll(GlobalInit.controller, roll0)

    setTargetDetermined(true)
    GlobalGameState.updateGlobalState()
  }
  function doMidwayInvasionRoll() {
    // Alternate Rolls in the ground combat
    doMidwayLandBattleRoll()
    if (GlobalGameState.nextMidwayInvasionRoll === GlobalUnitsModel.Side.JAPAN) {
      GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.US
    } else {
      GlobalGameState.nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
    }
  }

  function doNightRollsDamage() {
    for (let i = 0; i < nightAirUnits.length; i++) {
      for (let j = 0; j < nightStepsLost[i]; j++) {
        doDamageAllocation(GlobalInit.controller, nightAirUnits[i])
      }
    }
  }
  function doNightLandingRolls() {
    doNightLanding(GlobalInit.controller, nightAirUnits, nightSteps, setNightStepsLost)
    setNightLandingDone(true)
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
    GlobalGameState.midwayAttackResolved = true
    GlobalGameState.updateGlobalState()
  }

  function doMidwayRoll() {
    const box = doMidwayDamage(GlobalInit.controller)

    sendMidwayDamageUpdates(GlobalInit.controller, box, setDamageMarkerUpdate)
  }

  function doDMCVShipMarkerUpdate() {
    sendDMCVUpdate(GlobalInit.controller, DMCVCarrierSelected, setDmcvShipMarkerUpdate, dmcvSide)
  }

  function doDamageMarkerUpdate() {
    sendDMCVUpdate(GlobalInit.controller, DMCVCarrierSelected, setDmcvShipMarkerUpdate, dmcvSide)
  }

  function doCriticalHit() {
    let damage = autoAllocateDamage(GlobalInit.controller, 1)
    sendDamageUpdates(GlobalInit.controller, damage, setDamageMarkerUpdate)

    GlobalGameState.carrierAttackHits = 0
    setAttackResolved(() => true)

    // send damage event here
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
    GlobalGameState.midwayAttackResolved = true
    GlobalGameState.carrierHitsDetermined = true
  }

  function sendDMCVSelectionEvent() {
    doDMCVSelectionEvent(GlobalInit.controller, DMCVCarrierSelected, dmcvSide)
  }

  function sendNightLandingEvent() {
    // QUACK @TODO
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
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY) {
    if (cardNumber === 1) {
      closeDamageButtonDisabled = !towedCVSelected
    }
    if (cardNumber === 11) {
      closeDamageButtonDisabled = eliminatedSteps !== 2 && stepsLeft != 0
    } else if (cardNumber === 10) {
      closeDamageButtonDisabled = eliminatedSteps !== 1 && stepsLeft != 0
    }
  }
  let carrieDamageDiceButtonDisabled

  if (
    GlobalGameState.currentCarrierAttackTarget !== GlobalUnitsModel.TaskForce.MIF &&
    GlobalGameState.currentCarrierAttackTarget !== GlobalUnitsModel.TaskForce.JAPAN_DMCV &&
    GlobalGameState.currentCarrierAttackTarget !== GlobalUnitsModel.TaskForce.US_DMCV &&
    GlobalGameState.currentCarrierAttackTarget !== undefined
  ) {
    const oldCarrierHits = GlobalInit.controller.getCarrierHits(GlobalGameState.currentCarrierAttackTarget)
    carrieDamageDiceButtonDisabled =
      oldCarrierHits > 0 ||
      GlobalGameState.carrierAttackHits !== 1 ||
      (GlobalGameState.carrierAttackHits === 0 && damageDone)
  }
  let damagedCarriers = GlobalInit.controller.getDamagedCarriersOneOrTwoHits(GlobalUnitsModel.Side.US)
  let damageControlButtonDisabled =
  (damagedCV=== "x") || (damagedCV === "" && GlobalGameState.dieRolls.length === 0) || GlobalGameState.dieRolls.length > 0

  if (damageControlSide === GlobalUnitsModel.Side.US) {
    damageControlButtonDisabled = damagedCV !== "" || damagedCarriers.length === 0
  }

  const totalHits = GlobalGameState.midwayHits + GlobalGameState.totalMidwayHits
  let midwayDamageDiceButtonEnabled = GlobalGameState.midwayHits > 0 && totalHits < 3

  if (totalHits >= 3 && GlobalGameState.midwayHits > 0) {
    autoAllocateMidwayDamage(GlobalInit.controller)
  }

  let capInterceptionDiceButtonDisabled = capAirUnits.length === 0 || GlobalGameState.dieRolls.length > 0

  let nightLandingDiceButtonDisabled = nightLandingDone

  let midwayInvasionDiceButtonDisabled =
    GlobalGameState.midwayInvasionLevel === 0 || GlobalGameState.midwayGarrisonLevel === 0

  let mstr = GlobalGameState.midwayAttackDeclaration ? "will" : "will not"
  let ijnMidwayStr = `IJN ${mstr} attack Midway this turn`  
  let airOpsDiceButtonDisabled =
    GlobalGameState.sideWithInitiative !== undefined &&
    GlobalGameState.sideWithInitiative !== null &&
    GlobalGameState.sideWithInitiative !== ""

  // console.log("airOpsDiceButtonDisabled=", airOpsDiceButtonDisabled)
  const escortCloseCallback = () => {
    let capUnits
    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
      const sideBeingAttacked =
        GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
          ? GlobalUnitsModel.Side.JAPAN
          : GlobalUnitsModel.Side.US

      if (GlobalGameState.elitePilots) {
        const capBox = GlobalInit.controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)
        capUnits = GlobalInit.controller.getAllAirUnitsInBox(capBox)
        if (capUnits.length === 0) {
          NoFightersMsg = "No CAP At Midway. Click Close to move on to next phase."
        } else {
          setCapAirUnits(() => capUnits)
        }
      }
    }
    setEscortPanelShow(false)
    sendEscortEvent()
    nextAction()
  }
  let jpMsg = "Drag the Japanese 1AF Fleet Unit to any hex in the shaded red area of the map"

  if (GlobalGameState.gameTurn >= 4) {
    jpMsg =
      "Drag the Japanese 1AF Fleet Unit to any hex in the shaded red area of the map, and Japanese MIF Fleet Unit to any white shaded hex"
  }

  const submarineDiceButtonDisabled =
    (damagedCV === "" && GlobalGameState.dieRolls.length === 0) ||
    GlobalGameState.dieRolls.length > 0 ||
    damagedCV === "NO TARGETS"


  const summaryButtonDisabled = GlobalGameState.winner !== ""
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
      <AlertPanel show={!testClicked && !testyClicked && csfAlertShow} onHide={() => setCSFAlertShow(false)}>
        <h4>INFO</h4>
        <p>Drag the US CSF Fleet Unit to any hex in the shaded blue area of the map.</p>
      </AlertPanel>
      <AlertPanel show={!testClicked && !testyClicked && jpAlertShow} onHide={() => setJpAlertShow(false)}>
        <h4>INFO</h4>
        <p>{jpMsg}</p>
      </AlertPanel>
      <AlertPanel
        show={!testClicked && !testyClicked && fleetMoveAlertShow}
        onHide={() => setFleetMoveAlertShow(false)}
      >
        <h4>INFO</h4>
        <p>
          Drag the Fleet Unit to any hex in the shaded area of the map, or press Next Action to leave fleet in current
          location.
        </p>
      </AlertPanel>
      <AlertPanel
        show={!testClicked && !testyClicked && endOfAirOpAlertShow}
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
        show={!testClicked && !testyClicked && searchValuesAlertShow}
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
        show={!testClicked && !testyClicked && midwayNoAttackAlertShow}
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
        show={!testClicked && !testyClicked && midwayDialogShow}
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

      <AlertPanel
        show={midwayAIInfoShow}
        onHide={(e) => {
          nextAction(e)
          setMidwayAIInfoShow(false)
        }}
      >
        <h4 style={{ justifyContent: "center", alignItems: "center" }}>MIDWAY ATTACK DECISION</h4>
        <p>{ijnMidwayStr}</p>
        <p>Press Close to Continue</p>
      </AlertPanel>
      <AlertPanel
        show={midwayWarningShow}
        onHide={(e) => {
          nextAction(e)
          setMidwayWarningShow(false)
        }}
      >
        <h4 style={{ justifyContent: "center", alignItems: "center" }}>INFO</h4>
        <p>No Midway attack possible</p>
        <p>(No attack aircraft on deck)</p>
      </AlertPanel>
      <DicePanel
        numDice={2}
        show={!testClicked && !testyClicked && initiativePanelShow}
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
        numDice={2}
        show={!testClicked && !testyClicked && seaBattlePanelShow}
        headerText="Surface Battle"
        headers={seaBattleHeaders}
        footers={seaBattleFooters}
        showDice={showSeaBattleDice}
        margin={25}
        onHide={(e) => {
          setSeaBattlePanelShow(false)
          if (GlobalGameState.jpSeaBattleHits > 0 || GlobalGameState.usSeaBattleHits > 0) {
            setSeaBattleDamageDone(false)
            setSeaBattleDamagePanelShow(true)
          } else {
            nextAction(e)
          }
        }}
        doRoll={doSeaBattleRoll}
        diceButtonDisabled={seaBattleDiceButtonDisabled}
        closeButtonDisabled={!seaBattleDiceButtonDisabled}
      ></DicePanel>
      <DicePanel
        numDice={0}
        show={!testClicked && !testyClicked && seaBattleDamagePanelShow}
        headerText="Surface Battle Damage Allocation"
        headers={seaBattleDamageHeaders}
        footers={seaBattleDamageFooters}
        showDice={false}
        margin={25}
        onHide={(e) => {
          setSeaBattleDamagePanelShow(false)
          nextAction(e)
        }}
        closeButtonDisabled={seaBattleDamageCloseButtonDisabled}
      ></DicePanel>
      <DicePanel
        numDice={1}
        show={!testClicked && targetPanelShow}
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
        show={!testClicked && attackTargetPanelShow}
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
        show={!testClicked && capInterceptionPanelShow}
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
        show={!testClicked && damageAllocationPanelShow}
        headerText="Damage Allocation"
        headers={damageHeaders}
        footers={damageFooters}
        width={74}
        showDice={false}
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
        show={!testClicked && escortPanelShow}
        headerText="Escort Counterattack"
        headers={escortHeaders}
        closeButtonCallback={escortCloseCallback}
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
          GlobalGameState.dieRolls.length === 0 && getNumEscortFighterSteps(GlobalInit.controller) > 0
        }
        disabled={false}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={numAAADice}
        show={!testClicked && aaaPanelShow} // also check for any attacking steps left
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
        diceButtonDisabled={GlobalGameState.dieRolls.length !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls.length === 0}
        disabled={false}
      ></LargeDicePanel>

      <AttackDicePanel
        controller={GlobalInit.controller}
        numDice={numDiceToRoll}
        show={!testClicked && attackResolutionPanelShow}
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
        closeButtonStr={GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.MIF ? "Next..." : "Close"}
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
      <NightLandingDicePanel
        controller={GlobalInit.controller}
        numDice={nightSteps}
        diceButtonDisabled={nightLandingDiceButtonDisabled}
        closeButtonDisabled={!nightLandingDiceButtonDisabled}
        show={!testClicked && nightLandingPanelShow}
        headerText={nightSide}
        headers={nightHeaders}
        setNightLandingDone={setNightLandingDone}
        footers={nightFooters}
        showDice={true}
        side={nSide}
        nightStepsLost={nightStepsLost}
        width={74}
        onHide={(e) => {
          setNightLandingPanelShow(false)
          if (nightAirUnits.length > 0) {
            sendNightLandingEvent()
          }
          doNightRollsDamage()
        }}
        doRoll={doNightLandingRolls}
        disabled={true}
      ></NightLandingDicePanel>

      <MidwayInvasionDicePanel
        controller={GlobalInit.controller}
        numDice={2}
        diceButtonDisabled={midwayInvasionDiceButtonDisabled}
        closeButtonDisabled={!midwayInvasionDiceButtonDisabled}
        show={!testClicked && midwayInvasionPanelShow}
        headerText="Midway Invasion"
        // headers={nightHeaders}
        setNightLandingDone={setNightLandingDone}
        // footers={nightFooters}
        showDice={true}
        side={nSide}
        width={74}
        onHide={(e) => {
          setMidwayInvasionPanelShow(false)
        }}
        doRoll={doMidwayInvasionRoll}
        disabled={true}
      ></MidwayInvasionDicePanel>

      <CarrierDamageDicePanel
        numDice={1}
        controller={GlobalInit.controller}
        show={!testClicked && carrierDamagePanelShow}
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
        setDmcvShipMarkerUpdate={setDmcvShipMarkerUpdate}
        disabled={false}
        setDamageDone={setDamageDone}
        damageDone={damageDone}
      ></CarrierDamageDicePanel>
      <MidwayDamageDicePanel
        numDice={1}
        controller={GlobalInit.controller}
        show={!testClicked && midwayDamagePanelShow}
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
        setDamageDone={setDamageDone}
        damageDone={damageDone}
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
        width={74}
        closeButtonStr="Next..."
        closeButtonDisabled={false}
        disabled={false}
      ></EliminatedReturningUnits>
      <SubmarineAlertPanel
        show={!testClicked && submarineAlertPanelShow}
        controller={GlobalInit.controller}
        headerText={"Submarine"}
        setShowCardFooter={setShowCardFooter}
        cardNumber={cardNumber}
        setTowedCVSelected={setTowedCVSelected}
        towedCV={towedCVSelected}
        margin={0}
        setSubmarineDamagePanelShow={setSubmarineDamagePanelShow}
        setSubmarineAlertPanelShow={setSubmarineAlertPanelShow}
        onHide={(e) => {
          setSubmarineAlertPanelShow(false)
          nextAction(e)
        }}
        nextAction={nextAction}
        width={30}
      ></SubmarineAlertPanel>
      
      <CardAlertPanel
        show={!testClicked && cardAlertPanelShow}
        controller={GlobalInit.controller}
        headers={cardAlertHeaders}
        headerText={headerText}
        setHeaderText={setHeaderText}
        setShowCardFooter={setShowCardFooter}
        footers={cardAlertFooters}
        cardNumber={cardNumber}
        eventHandler={cardEventHandler}
        margin={0}
        setDamagedCV={setDamagedCV}
        setCardDicePanelShow5={setCardDicePanelShow5}
        setCardDicePanelShow7={setCardDicePanelShow7}
        setStrikeLostPanelShow={setStrikeLostPanelShow}
        setCarrierPlanesDitchPanelShow={setCarrierPlanesDitchPanelShow}
        setTowedToFriendlyPortPanelShow={setTowedToFriendlyPortPanelShow}
        setAirReplacementsPanelShow={setAirReplacementsPanelShow}
        setDamageControlPanelShow={setDamageControlPanelShow}
        setAttackResolved={setAttackResolved}
        setSubmarineAlertPanelShow={setSubmarineAlertPanelShow}
        setSubmarineDamagePanelShow={setSubmarineDamagePanelShow}
        onHide={(e) => {
          setCardAlertPanelShow(false)
        }}
        nextAction={nextAction}
        width={30}
      ></CardAlertPanel>

      <PoopCardAlertPanel
        show={cardPlayedPanelShow}
        controller={GlobalInit.controller}
        headers={cardAlertHeaders}
        headerText={headerText}
        setHeaderText={setHeaderText}
        setShowCardFooter={setShowCardFooter}
        footers={cardAlertFooters}
        cardNumber={cardNumber}
        eventHandler={cardEventHandler}
        margin={0}
        setDamagedCV={setDamagedCV}
        setCardDicePanelShow5={setCardDicePanelShow5}
        setCardDicePanelShow7={setCardDicePanelShow7}
        setStrikeLostPanelShow={setStrikeLostPanelShow}
        setCarrierPlanesDitchPanelShow={setCarrierPlanesDitchPanelShow}
        setTowedToFriendlyPortPanelShow={setTowedToFriendlyPortPanelShow}
        setAirReplacementsPanelShow={setAirReplacementsPanelShow}
        setDamageControlPanelShow={setDamageControlPanelShow}
        setAttackResolved={setAttackResolved}
        setSubmarineAlertPanelShow={setSubmarineAlertPanelShow}
        setSubmarineDamagePanelShow={setSubmarineDamagePanelShow}
        onHide={(e) => {
          setCardPlayedPanelShow(false)
          processPlayedCard(stateObject) 
        }}
        width={30}
      ></PoopCardAlertPanel>
    
      {/* <CardPlayedByAIPanel
        show={cardPlayedPanelShow}
        controller={GlobalInit.controller}
        headers={cardAlertHeaders}
        headerText={headerText}
        setHeaderText={setHeaderText}
        setShowCardFooter={setShowCardFooter}
        footers={cardAlertFooters}
        cardNumber={cardNumber}
        eventHandler={cardEventHandler}
        margin={0}
        setDamagedCV={setDamagedCV}
        setCardDicePanelShow5={setCardDicePanelShow5}
        setCardDicePanelShow7={setCardDicePanelShow7}
        setStrikeLostPanelShow={setStrikeLostPanelShow}
        setCarrierPlanesDitchPanelShow={setCarrierPlanesDitchPanelShow}
        setTowedToFriendlyPortPanelShow={setTowedToFriendlyPortPanelShow}
        setAirReplacementsPanelShow={setAirReplacementsPanelShow}
        setDamageControlPanelShow={setDamageControlPanelShow}
        setAttackResolved={setAttackResolved}
        setSubmarineAlertPanelShow={setSubmarineAlertPanelShow}
        setSubmarineDamagePanelShow={setSubmarineDamagePanelShow}
        onHide={(e) => {
          setCardPlayedPanelShow(false)
          nextAction(e)
        }}
        width={30}
      ></CardPlayedByAIPanel> */}
      <DicePanel
        numDice={1}
        show={!testClicked && cardDicePanelShow5}
        headerText="Naval Bombardment"
        headers={cardDicePanelHeaders}
        footers={cardDicePanelFooters}
        width={30}
        showDice={true}
        margin={315}
        diceButtonDisabled={GlobalGameState.dieRolls.length !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls.length === 0}
        onHide={(e) => {
          setCardDicePanelShow5(false)
          nextAction(e)
        }}
        doRoll={doCardRoll}
        disabled={true}
      ></DicePanel>
      <DicePanel
        numDice={1}
        show={!testClicked && cardDicePanelShow7}
        headerText="Troubled Reconnaissance"
        headers={cardDicePanelHeaders}
        footers={cardDicePanelFooters}
        width={30}
        showDice={true}
        margin={315}
        diceButtonDisabled={GlobalGameState.dieRolls.length !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls.length === 0}
        onHide={(e) => {
          setCardDicePanelShow7(false)
          GlobalGameState.isFirstAirOp = true
          nextAction(e)
        }}
        doRoll={doCardRoll}
        disabled={true}
      ></DicePanel>
      <DicePanel
        numDice={damageControlSide === GlobalUnitsModel.Side.JAPAN ? 1 : 0}
        show={!testClicked && damageControlPanelShow}
        headerText="Damage Control"
        headers={damageControlHeaders}
        footers={damageControlFooters}
        width={30}
        showDice={damagedCV !== "x" && damageControlSide === GlobalUnitsModel.Side.JAPAN}
        margin={350}
        diceButtonDisabled={damageControlButtonDisabled}
        closeButtonDisabled={!damageControlButtonDisabled}
        onHide={(e) => {
          setDamageControlPanelShow(false)
          nextAction(e)
        }}
        doRoll={doDamageControl}
        disabled={true}
      ></DicePanel>
      <DicePanel
        numDice={1}
        show={!testClicked && submarineDamagePanelShow}
        headerText="Submarine"
        headers={submarineHeaders}
        footers={submarineFooters}
        width={30}
        showDice={true}
        margin={350}
        diceButtonDisabled={submarineDiceButtonDisabled}
        closeButtonDisabled={!submarineDiceButtonDisabled}
        onHide={(e) => {
          setSubmarineDamagePanelShow(false)
          nextAction(e)
        }}
        doRoll={doSubmarine}
        disabled={true}
      ></DicePanel>
      <LargeDicePanel
        numDice={0}
        show={!testClicked && strikeLostPanelShow}
        headerText="US Strike Lost"
        headers={strikeLostDamageHeaders}
        footers={strikeLostDamageFooters}
        width={74}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setStrikeLostPanelShow(false)
          sendDamageEvent(eliminatedSteps)
          nextAction(e)
        }}
        doRoll={doDamageAllocation}
        disabled={true}
        closeButtonDisabled={closeDamageButtonDisabled}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={0}
        show={!testClicked && carrierPlanesDitchPanelShow}
        headerText="US Carrier Planes Ditch"
        headers={carrierPlanesDitchDamageHeaders}
        footers={carrierPlanesDitchDamageFooters}
        width={74}
        showDice={false}
        margin={0}
        onHide={(e) => {
          setCarrierPlanesDitchPanelShow(false)
          sendDamageEvent(eliminatedSteps)
          nextAction(e)
        }}
        disabled={true}
        closeButtonDisabled={closeDamageButtonDisabled}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={0}
        show={!testClicked && towedToFriendlyPortPanelShow}
        headerText="Towed To A Friendly Port"
        headers={towedCVHeaders}
        footers={towedCVFooters}
        width={74}
        showDice={false}
        margin={0}
        onHide={(e) => {
          setTowedToFriendlyPortPanelShow(false)
          // sendDamageEvent(eliminatedSteps)
          // @TODO send CV towed event (card play)
          nextAction(e)
        }}
        disabled={true}
        closeButtonDisabled={closeDamageButtonDisabled}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={0}
        show={!testClicked && dmcvCarrierSelectionPanelShow}
        headerText="DMCV Carrier Selection"
        headers={dmcvSelectionHeaders}
        footers={dmcvSelectionFooters}
        width={74}
        showDice={false}
        margin={0}
        onHide={(e) => {
          setDmcvCarrierSelectionPanelShow(false)
          // sendDamageEvent(eliminatedSteps)
          // @TODO send DMCV Carrier Selection Event
          sendDMCVSelectionEvent()
          nextAction(e)
        }}
        disabled={true}
        closeButtonDisabled={!DMCVCarrierSelected}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={0}
        show={!testClicked && airReplacementsPanelShow}
        headerText="Air Replacements"
        headers={airReplacementsHeaders}
        footers={airReplacementsFooters}
        width={74}
        showDice={false}
        margin={0}
        onHide={(e) => {
          setAirReplacementsPanelShow(false)
          // sendDamageEvent(eliminatedSteps)
          // @TODO send Air Replacements event (card play)
          nextAction(e)
        }}
        disabled={true}
        closeButtonDisabled={!airReplacementsSelected}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={0}
        show={!testClicked && !testyClicked && endOfTurnSummaryShow}
        headerText={endOfTurnHeader}
        headers={endOfTurnSummaryHeaders}
        footers={endOfTurnSummaryFooters}
        width={4}
        showDice={false}
        margin={0}
        onHide={(e) => {
          setEndOfTurnSummaryShow(false)
          nextAction(e)
        }}
        closeButtonDisabled={summaryButtonDisabled}
      ></LargeDicePanel>
      <GameStatusPanel show={gameStateShow} gameState={gameState} onHide={() => setGameStateShow(false)} />
      <CardPanel show={jpHandShow} side={GlobalUnitsModel.Side.JAPAN} onHide={() => setjpHandShow(false)}></CardPanel>
      <CardPanel
        show={usHandShow}
        side={GlobalUnitsModel.Side.US}
        onHide={(e) => {
          setusHandShow(false)
          nextAction(e)
        }}
      ></CardPanel>
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
                  setReorgAirUnits,
                  reorgAirUnits,
                  airUnitUpdate,
                  setCardNumber,
                  setEnabledJapanFleetBoxes,
                  setEnabledUSFleetBoxes,
                  testUpdate,
                  fleetUnitUpdate,
                  strikeGroupUpdate,
                  damageMarkerUpdate,
                  dmcvShipMarkerUpdate,
                  setAlertShow,
                  showZones,
                  setDmcvCarrierSelectionPanelShow,
                  USMapRegions,
                  setUSMapRegions,
                  japanMapRegions,
                  setJapanMapRegions,
                  japanMIFMapRegions,
                  setJapanMIFMapRegions,
                  enabledJapanBoxes,
                  enabledUSBoxes,
                  enabledUSFleetBoxes,
                  enabledJapanFleetBoxes,
                  setEnabledUSBoxes,
                  setEnabledJapanBoxes,
                  enabledUSReorgBoxes,
                  enabledJapanReorgBoxes,
                  setEnabledJapanReorgBoxes,
                  setEnabledUSReorgBoxes,
                  setIsMoveable,
                  towedCVSelected,
                  loading,
                }}
              >
                <Board
                  scale={scale}
                  USMapRegions={USMapRegions}
                  japanMapRegions={japanMapRegions}
                  japanMIFMapRegions={japanMIFMapRegions}
                  japanStrikePanelEnabled={japanStrikePanelEnabled}
                  usStrikePanelEnabled={usStrikePanelEnabled}
                  enabledJapanFleetBoxes={enabledJapanFleetBoxes}
                  enabledUSFleetBoxes={enabledUSFleetBoxes}
                  enabledJapanReorgBoxes={enabledJapanReorgBoxes}
                  enabledUSReorgBoxes={enabledUSReorgBoxes}
                  setPreviousPosition={setPreviousPosition}
                  previousPosition={previousPosition}
                />
              </BoardContext.Provider>
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </>
  )
}
