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
import CardPanel from "./components/dialogs/CardPanel"
import GameStatusPanel from "./components/dialogs/GameStatusPanel"
import SplashScreen from "./components/dialogs/SplashScreen"
import "./style.css"
import { createMapUpdateForFleet } from "./AirUnitTestData"
import { determineAllUnitsDeployedForCarrier } from "./controller/AirUnitSetupHandler"
import { usCSFStartHexes, japanAF1StartHexes } from "./components/MapRegions"
import YesNoDialog from "./components/dialogs/YesNoDialog"
import { loadGameState, saveGameState } from "./SaveLoadGame"
import { allHexesWithinDistance } from "./components/HexUtils"
import DicePanel from "./components/dialogs/DicePanel"
import { calculateSearchValues, calculateSearchResults } from "./model/SearchValues"
import { AirOpsHeaders, AirOpsFooters } from "./AirOpsDataPanels"
import { randomDice } from "./components/dialogs/DiceUtils"
import UITester from "./UITester"
import loadHandler from "./LoadHandler"
import { getJapanEnabledAirBoxes, getUSEnabledAirBoxes } from "./AirBoxZoneHandler"

export default App

export const BoardContext = createContext()

export function App() {
  const [splash, setSplash] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [enabledJapanBoxes, setEnabledJapanBoxes] = useState([])
  const [enabledUSBoxes, setEnabledUSBoxes] = useState([])

  useEffect(() => {
    setEnabledJapanBoxes(getJapanEnabledAirBoxes())
  }, [])
  useEffect(() => {
    setEnabledUSBoxes(getUSEnabledAirBoxes())
  }, [])
  // TODO
  // Have a list of the zones which are enabled for the current game phase
  // and pass this down to the draganddrop components

  // Maybe add a ZoneHandler to do the logic for this??

  // This will create a list of enabled boxes for whatever game phase
  // and work out which boxes are enabled during air operations
  const [enabledZones, setEnabledZones] = useState([])

  // then in the component (ie air box) we can say
  // If this air box is in the list -> enable, else disable

  const [gameState, setGameState] = useState(false)
  // TODO set an effect hook on game state to trigger a game save

  const [isMoveable, setIsMoveable] = useState(false)
  const [scale, setScale] = useState(1)
  const [testClicked, setTestClicked] = useState(false)
  const [csfAlertShow, setCSFAlertShow] = useState(false)
  const [jpAlertShow, setJpAlertShow] = useState(false)

  const [saveAlertShow, setSaveAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text

  const [midwayDialogShow, setMidwayDialogShow] = useState(false)
  const [fleetMoveAlertShow, setFleetMoveAlertShow] = useState(false)
  const [midwayNoAttackAlertShow, setMidwayNoAttackAlertShow] = useState(false)
  const [searchValuesAlertShow, setSearchValuesAlertShow] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [searchResults, setSearchResults] = useState({})

  const [alertShow, setAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text
  // const [alertShow, setAlertShow] = useState({
  //   display: false,
  //   alertText: ""
  // })

  const [jpHandShow, setjpHandShow] = useState(false)
  const [usHandShow, setusHandShow] = useState(false)

  const [gameStateShow, setGameStateShow] = useState(false)
  const [dicePanelShow, setDicePanelShow] = useState(false)

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

  const [USMapRegions, setUSMapRegions] = useState([])
  const [japanMapRegions, setJapanMapRegions] = useState([])

  const [sideWithInitiative, setSideWithInitiative] = useState(null)

  const onDrag = () => {
    setIsMoveable(true)
  }
  const onStop = () => {
    setIsMoveable(false)
  }

  const setUsFleetRegions = () => {
    GlobalGameState.phaseCompleted = true // may just want to skip any fleet movement (leave fleet where it is)
    const csfLocation = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    console.log("csf location = ", csfLocation)
    const usRegion = allHexesWithinDistance(csfLocation.currentHex, 2, true)
    setUSMapRegions(usRegion)
    setFleetMoveAlertShow(true)
  }

  const setJapanFleetRegions = () => {
    GlobalGameState.phaseCompleted = true // may just want to skip any fleet movement (leave fleet where it is)
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT && GlobalGameState.gameTurn === 1) {
      setJapanMapRegions(japanAF1StartHexes)
    } else {
      const af1Location = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const jpRegion = allHexesWithinDistance(af1Location.currentHex, 2, true)
      setJapanMapRegions(jpRegion)
    }

    setFleetMoveAlertShow(true)
  }

  const loadState = () => {
    console.log("GlobalGameState.gamePhase = ", GlobalGameState.gamePhase)
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      const carrier = GlobalGameState.getJapanCarrier()
      determineAllUnitsDeployedForCarrier(GlobalInit.controller, GlobalUnitsModel.Side.JAPAN, carrier)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
      const carrier = GlobalGameState.getUSCarrier()
      determineAllUnitsDeployedForCarrier(GlobalInit.controller, GlobalUnitsModel.Side.US, carrier)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
      setMidwayDialogShow(true)
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      if (!GlobalGameState.usFleetMoved) {
        setUSMapRegions([])
      } else {
        GlobalGameState.phaseCompleted = true
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
      setJapanFleetRegions()
      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK_PHASE) {
      setJapanMapRegions([])
      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
      setJapanMapRegions([])
      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.BOTH_SEARCH_PHASE) {
      setJapanMapRegions([])
      GlobalGameState.phaseCompleted = true
    }
    // If we don't do this, a drag and drop move fires a fleet update and the fleet does not move
    setFleetUnitUpdate(undefined)

    console.log("+++++ AIR OPS: US: ", GlobalGameState.airOperationPoints.us)
    GlobalGameState.updateGlobalState()
    const enabledJapanBoxes = getJapanEnabledAirBoxes()
    setEnabledJapanBoxes(() => enabledJapanBoxes)
    const enabledUSBoxes = getUSEnabledAirBoxes()
    setEnabledUSBoxes(() => enabledUSBoxes)
  }

  // TODO move this into separate file
  const nextAction = (e) => {
    e.preventDefault()
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      if (GlobalGameState.currentCarrier <= 2) {
        GlobalGameState.currentCarrier++
        GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
        GlobalInit.controller.drawJapanCards(3, true)
        GlobalGameState.jpCardsDrawn = true
      }
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_FLEET
      GlobalGameState.currentCarrier = 0
      setUSMapRegions(usCSFStartHexes)
      setCSFAlertShow(true)
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
      GlobalGameState.usFleetPlaced = true
      setUSMapRegions([])
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
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
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_CARD_DRAW) {
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
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_MIDWAY) {
      console.log("END OF Midway Declaration Phase")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
      setUsFleetRegions()
      GlobalGameState.usFleetMoved = false
      GlobalGameState.phaseCompleted = true
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING) {
      console.log("END OF US Fleet Movement Phase")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT
      setUSMapRegions([])
      setJapanMapRegions(japanAF1StartHexes)
      setJpAlertShow(true)
      GlobalGameState.phaseCompleted = false
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
      console.log("END OF Japan Fleet Movement Phase")
      GlobalGameState.gamePhase = GlobalGameState.PHASE.MIDWAY_ATTACK_PHASE
      setMidwayNoAttackAlertShow(true)
      setJapanMapRegions([])
      GlobalGameState.phaseCompleted = true
      GlobalGameState.jpFleetPlaced = true
      const update = createMapUpdateForFleet(GlobalInit.controller, "1AF", GlobalUnitsModel.Side.JAPAN)
      setFleetUnitUpdate(update)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK_PHASE) {
      console.log("END OF Midway Attack Phase")
      if (!GlobalGameState.midwayAttackDeclaration) {
        GlobalGameState.phaseCompleted = true
        GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT) {
      const update = createMapUpdateForFleet(GlobalInit.controller, "CSF", GlobalUnitsModel.Side.US)
      setFleetUnitUpdate(update)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.BOTH_SEARCH_PHASE
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

      // setDicePanelShow(sr.JAPAN > 0 && sr.US > 0)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.BOTH_SEARCH_PHASE) {
      setDicePanelShow(true)
    }

    GlobalGameState.setupPhase++
    GlobalGameState.updateGlobalState()
    const enabledBoxes = getJapanEnabledAirBoxes()
    setEnabledJapanBoxes(() => enabledBoxes)
    const enabledUSBoxes = getUSEnabledAirBoxes()
    setEnabledUSBoxes(() => enabledUSBoxes)
  }

  // set up initial zustand air counter list
  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  const testUi = async (e) => {
    await UITester({ e, setTestClicked, setAirUnitUpdate, setFleetUnitUpdate, nextAction })
  }

  var v = process.env.REACT_APP_MYVAR || "arse"
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
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK_PHASE
    ) {
      image = "/images/japanflag.jpg"
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.BOTH_SEARCH_PHASE) {
      image = "/images/bothflags.jpg"
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
                  saveGameState(GlobalInit.controller)
                  setSaveAlertShow(true)
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
              {GlobalGameState.gamePhase}
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
                disabled={
                  !GlobalGameState.phaseCompleted ||
                  (GlobalGameState.gamePhase === GlobalGameState.JAPAN_FLEET_MOVEMENT && !GlobalGameState.jpFleetPlaced)
                }
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
  async function loady() {
    loadHandler({ setTestClicked, setSplash, setAirUnitUpdate, setFleetUnitUpdate, loadState })
  }

  function onSplash() {
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
        <SplashScreen show={splash} onSplash={onSplash} loady={loady}></SplashScreen>
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
  function doRoll() {
    const rolls = randomDice(2)
    const sideWithInitiative = GlobalInit.controller.determineInitiative(rolls[0], rolls[1])
    setSideWithInitiative(() => sideWithInitiative)
  }
  return (
    <>
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
        <h4>INFO</h4>
        <p>Game State Successfully Saved!</p>
      </AlertPanel>
      <DicePanel
        numDice={2}
        show={dicePanelShow}
        headerText="Air Ops Initiative"
        headers={airOpsHeaders}
        footers={airOpsFooters}
        onHide={() => setDicePanelShow(false)}
        doRoll={doRoll}
        disabled={sideWithInitiative !== null}
      ></DicePanel>
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
                  setAlertShow,
                  showZones,
                  USMapRegions,
                  japanMapRegions,
                  enabledJapanBoxes,
                  enabledUSBoxes
                }}
              >
                <Board
                  scale={scale}
                  USMapRegions={USMapRegions}
                  japanMapRegions={japanMapRegions}
                />
              </BoardContext.Provider>
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </>
  )
}
