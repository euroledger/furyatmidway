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
  doFighterCounterattack,
  doAAAFireRolls,
} from "./DiceHandler"
import { determineAllUnitsDeployedForCarrier } from "./controller/AirUnitSetupHandler"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./components/draganddrop/USAirBoxOffsets"

import { usCSFStartHexes, japanAF1StartHexesNoMidway, japanAF1StartHexesMidway } from "./components/MapRegions"
import YesNoDialog from "./components/dialogs/YesNoDialog"
import { saveGameState } from "./SaveLoadGame"
import loadHandler from "./LoadHandler"
import { allHexesWithinDistance } from "./components/HexUtils"
import DicePanel from "./components/dialogs/DicePanel"
import LargeDicePanel from "./components/dialogs/LargeDicePanel"
import { AirOpsHeaders, AirOpsFooters } from "./AirOpsDataPanels"
import { TargetHeaders, TargetFooters } from "./TargetPanel"
import { CAPHeaders, CAPFooters } from "./CAPPanel"
import { DamageHeaders, DamageFooters } from "./DamageAllocationPanel"
import { EscortHeaders, EscortFooters } from "./EscortPanel"
import { AAAHeaders, AAAFooters } from "./AAAPanel"

import UITester from "./UITester"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"
import handleAction, { calcAirOpsPointsMidway } from "./GameStateHandler"

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
  const [capInterceptionPanelShow, setCapInterceptionPanelShow] = useState(false)

  const [damageAllocationPanelShow, setDamageAllocationPanelShow] = useState(false)

  const [escortPanelShow, setEscortPanelShow] = useState(false)
  const [aaaPanelShow, setAaaPanelShow] = useState(false)

  const [capAirUnits, setCapAirUnits] = useState([])
  const [capSteps, setCapSteps] = useState(0)
  const [escortSteps, setEscortSteps] = useState(0)

  const [fightersPresent, setFightersPresent] = useState(true)

  const [airUnitUpdate, setAirUnitUpdate] = useState({
    name: "",
    position: {},
    boxName: "",
    index: -1,
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

  const [sideWithInitiative, setSideWithInitiative] = useState(null)

  const [targetDetermined, setTargetDetermined] = useState(false)
  const [targetSelected, setTargetSelected] = useState(false)

  const [eliminatedSteps, setEliminatedSteps] = useState(0)

  const [stepsLeft, setStepsLeft] = useState(0)
  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.TARGET_DETERMINATION) {
      // @TODO CHECK IF JAPANESE PLAYER HOLDS CARD 11
      // ("US STRIKE LOST")
      // Will want to display an alert to ask if the player wants to play this card
      setTargetPanelShow(true)
      GlobalGameState.dieRolls = 0
      GlobalGameState.capHits = undefined
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_INTERCEPTION) {
      setFightersPresent(true)
      setCapInterceptionPanelShow(true)
      GlobalGameState.dieRolls = 0
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION
    ) {
      setEliminatedSteps(0)
      setDamageAllocationPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_COUNTERATTACK) {
      GlobalGameState.dieRolls = 0
      setEscortPanelShow(true)
    }
  }, [GlobalGameState.gamePhase])

  useEffect(() => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE) {
      GlobalGameState.dieRolls = 0
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
      setSideWithInitiative(GlobalGameState.sideWithInitiative)
      if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN) {
        setJapanStrikePanelEnabled(true)
        setUsStrikePanelEnabled(false)
        const units = GlobalInit.controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.JAPAN)
        if (units.length === 0) {
          GlobalGameState.phaseCompleted = true
        } else {
          GlobalGameState.phaseCompleted = false
        }
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
        const units = GlobalInit.controller.getStrikeGroupsNotMoved(GlobalUnitsModel.Side.US)
        if (units.length === 0) {
          GlobalGameState.phaseCompleted = true
        } else {
          GlobalGameState.phaseCompleted = false
        }
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
    e.preventDefault()

    handleAction({
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
    })
  }

  const testUi = async (e) => {
    await UITester({
      e,
      setTestClicked,
      setAirUnitUpdate,
      setFleetUnitUpdate,
      setStrikeGroupUpdate,
      nextAction,
      doRoll: doInitiativeRoll,
    })
  }

  var v = process.env.REACT_APP_MYVAR || "none"
  let test = false
  if (v === "test") {
    test = true
  }
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

    const disabled =
      !GlobalGameState.phaseCompleted ||
      (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT && !GlobalGameState.jpFleetPlaced) ||
      (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET && !GlobalGameState.usFleetPlaced)

    let midwayMsg = ""

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
          {/* <Navbar.Brand href="/">Save</Navbar.Brand>
                <Navbar.Brand href="/">Load</Navbar.Brand> */}
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
                  setShowZones(!showZones)
                }}
              >
                Undo
              </Button>
            </Nav>

            <img src={image} alt="test" style={{ marginLeft: "120px" }} width="40px" height="30px" />
            <p
              className="navbar-text"
              style={{
                marginLeft: "10px",
                marginTop: "17px",
                marginRight: "45px",
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
                disabled={disabled}
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
      setTestClicked,
      setSplash,
      setAirUnitUpdate,
      setFleetUnitUpdate,
      setStrikeGroupUpdate,
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
    jpOpsText = `Japan Air Operations Points: ${searchResults.JAPAN}`
    usOpsText = `US Air Operations Points: ${searchResults.US}`
  }
  const targetHeaders = (
    <>
      <TargetHeaders controller={GlobalInit.controller} setTargetSelected={setTargetSelected}></TargetHeaders>
    </>
  )

  const targetFooters = (
    <>
      <TargetFooters show={targetDetermined}></TargetFooters>
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

  const aaaHeaders = (
    <>
      <AAAHeaders></AAAHeaders>
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
  function doInitiativeRoll(roll0, roll1) {
    // for automated testing
    const sideWithInitiative = doIntiativeRoll(GlobalInit.controller, roll0, roll1)
    setSideWithInitiative(() => sideWithInitiative)
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
    doAAAFireRolls()

    GlobalGameState.updateGlobalState()
  }

  function sendCapEvent() {
    doCAPEvent(GlobalInit.controller, capAirUnits)
  }

  let closeDamageButtonDisabled = true
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION) {
    closeDamageButtonDisabled = eliminatedSteps !== GlobalGameState.capHits && stepsLeft !== 0
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    closeDamageButtonDisabled = eliminatedSteps !== GlobalGameState.fighterHits && stepsLeft !== 0
  } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AAA_DAMAGE_ALLOCATION) {
    closeDamageButtonDisabled = eliminatedSteps !== GlobalGameState.antiaircraftHits && stepsLeft !== 0
  }
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
        onHide={(e) => {
          setInitiativePanelShow(false)
          nextAction(e)
        }}
        doRoll={doInitiativeRoll}
        nextState={GlobalGameState.PHASE.AIR_OPERATIONS}
        diceButtonDisabled={sideWithInitiative !== null}
        closeButtonDisabled={sideWithInitiative === null}
      ></DicePanel>
      <DicePanel
        numDice={1}
        show={!testClicked && targetPanelShow}
        headerText="Target Determination"
        headers={targetHeaders}
        footers={targetFooters}
        width={30}
        showDice={targetSelected}
        margin={300}
        diceButtonDisabled={targetSelected === targetDetermined}
        closeButtonDisabled={!targetDetermined}
        // nextState={GlobalGameState.PHASE.CAP_INTERCEPTION}
        onHide={(e) => {
          setTargetPanelShow(false)
          nextAction(e)
        }}
        doRoll={doTargetSelectionRoll}
        disabled={true}
      ></DicePanel>
      <LargeDicePanel
        numDice={capSteps}
        diceButtonDisabled={capAirUnits.length === 0 || GlobalGameState.capHits !== undefined}
        show={!testClicked && capInterceptionPanelShow}
        headerText="CAP Interception"
        headers={capHeaders}
        footers={capFooters}
        // width={100}
        showDice={true}
        // nextState={
        //   capSteps > 0 ? GlobalGameState.PHASE.CAP_DAMAGE_ALLOCATION : GlobalGameState.PHASE.ANTI_AIRCRAFT_FIRE
        // }
        margin={0}
        onHide={(e) => {
          setCapInterceptionPanelShow(false)
          sendCapEvent()
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
        // width={100}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setDamageAllocationPanelShow(false)
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
        footers={escortFooters}
        // width={100}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setEscortPanelShow(false)
          nextAction(e)
        }}
        doRoll={doCounterattackRolls}
        diceButtonDisabled={GlobalGameState.dieRolls !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls === 0 && getNumEscortFighterSteps(GlobalInit.controller) !== 0}
        disabled={false}
      ></LargeDicePanel>
      <LargeDicePanel
        numDice={2}
        show={!testClicked && aaaPanelShow} // also check for any attacking steps left
        headerText="Anti-Aircraft Fire"
        headers={aaaHeaders}
        footers={aaaFooters}
        showDice={true}
        margin={0}
        onHide={(e) => {
          setAaaPanelShow(false)
          nextAction(e)
        }}
        doRoll={doAntiAircraftRolls}
        diceButtonDisabled={GlobalGameState.dieRolls !== 0}
        closeButtonDisabled={GlobalGameState.dieRolls === 0}
        disabled={false}
      ></LargeDicePanel>
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
                  fleetUnitUpdate,
                  strikeGroupUpdate,
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
