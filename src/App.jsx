import { React, useState } from "react"
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
import calcRandomTestData from "./AirUnitTestData"
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets"
import { airUnitData } from "./AirUnitTestData"
import usCSFStartHexes from "./components/MapRegions"

export default App
export function App() {
  const [splash, setSplash] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [gameState, setGameState] = useState(false)
  const [isMoveable, setIsMoveable] = useState(false)
  const [scale, setScale] = useState(1)
  const [testClicked, setTestClicked] = useState(false)
  const [csfAlertShow, setCsfAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text

  const [alertShow, setAlertShow] = useState(false) // TO DO param should be an object with boolean and alert text
  // const [alertShow, setAlertShow] = useState({
  //   display: false,
  //   alertText: ""
  // })

  const [jpHandShow, setjpHandShow] = useState(false)
  const [usHandShow, setusHandShow] = useState(false)

  const [gameStateShow, setGameStateShow] = useState(false)

  const [airUnitUpdate, setAirUnitUpdate] = useState({
    name: "",
    position: {},
    boxName: "",
    index: -1,
  })
  const [USMapRegions, setUSMapRegions] = useState([])
  const [japanMapRegions, setjapanMapRegions] = useState([])

  const onDrag = () => {
    setIsMoveable(true)
  }
  const onStop = () => {
    setIsMoveable(false)
  }

  const nextAction = () => {
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      if (GlobalGameState.currentCarrier <= 2) {
        GlobalGameState.currentCarrier++
        GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
      } else {
        GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
        GlobalInit.controller.drawJapanCards(3, true)
        GlobalGameState.jpCardsDrawn = true
      }
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_FLEET
      GlobalGameState.currentCarrier = 0
      setUSMapRegions(usCSFStartHexes)
      setCsfAlertShow(true)
    } else if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET) {
      GlobalGameState.gamePhase = GlobalGameState.PHASE.US_SETUP_AIR
      GlobalGameState.usFleetPlaced = true
      setUSMapRegions([])
    }
    GlobalGameState.phaseCompleted = false
    GlobalGameState.setupPhase++
    GlobalGameState.updateGlobalState()
  }

  function listAllPositions() {
    const units = Array.from(GlobalInit.counters.values())
    const airCounters = units.filter((unit) => unit.constructor.name === "AirUnit")
    for (let airUnit of airCounters) {
      const { boxName, boxIndex } = GlobalInit.controller.getAirUnitLocation(airUnit.name)

      console.log(`Air Unit ${airUnit.name} => location ${boxName}[${boxIndex}]`)
    }
  }

  // set up initial zustand air counter list
  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  const testUi = async (e) => {
    setTestClicked(true)

    let update
    for (const unit of airUnitData) {
      update = calcRandomTestData(unit, GlobalInit.controller)
      if (!update) {
        continue
      }
      update.index = GlobalInit.controller.getFirstAvailableZone(update.boxName)
      let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
      ;(update.position = position1.offsets[update.index]), setAirUnitUpdate(update)
      await delay(500)
      if (update.nextAction) {
        nextAction()
      }
    }
    
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
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW
    ) {
      image = "/images/japanflag.jpg"
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
                disabled={!GlobalGameState.usCardsDrawn}
                onClick={() => setusHandShow(true)}
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
                onClick={() => {
                  GlobalGameState.phaseCompleted = true
                  GlobalGameState.jpCardsDrawn = true
                  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_CARD_DRAW) {
                    nextAction()
                  }
                  setjpHandShow(true)
                }}
              >
                Japan Hand
              </Button>
              <Button className="me-1" size="sm" variant="outline-light">
                Roll Dice
              </Button>
              <Button
                className="me-1"
                size="sm"
                variant="outline-light"
                onClick={() => {
                  setShowZones(!showZones)
                }}
              >
                {showZones ? "Hide" : "Show"}
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
                onClick={() => nextAction()}
                disabled={!GlobalGameState.phaseCompleted}
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
        <SplashScreen show={splash} onSplash={onSplash}></SplashScreen>
      </div>
    )
  }
  return (
    <>
      <AlertPanel show={alertShow} onHide={() => setAlertShow(false)}>
        <h4>ALERT</h4>
        <p>This air unit is not a fighter unit so cannot be used for CAP.</p>
      </AlertPanel>
      <AlertPanel show={!testClicked && csfAlertShow} onHide={() => setCsfAlertShow(false)}>
        <h4>INFO</h4>
        <p>Drag the US CSF Fleet Unit to any hex in the shaded blue area of the map.</p>
      </AlertPanel>
      <GameStatusPanel show={gameStateShow} gameState={gameState} onHide={() => setGameStateShow(false)} />
      <CardPanel show={jpHandShow} side={GlobalUnitsModel.Side.JAPAN} onHide={() => setjpHandShow(false)}></CardPanel>
      <CardPanel
        cardArray={[13, 3, 8, 2]}
        show={usHandShow}
        side={GlobalUnitsModel.Side.US}
        onHide={() => setusHandShow(false)}
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
              <Board
                controller={GlobalInit.controller}
                gameStateHandler={gameStateHandler}
                onDrag={onDrag}
                onStop={onStop}
                scale={scale}
                airUnitUpdate={airUnitUpdate}
                setAirUnitUpdate={setAirUnitUpdate}
                setAlertShow={setAlertShow}
                showZones={showZones}
                USMapRegions={USMapRegions}
                japanMapRegions={japanMapRegions}
              />
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </>
  )
}
