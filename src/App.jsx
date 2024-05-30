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
import AlertPanel from "./components/dialogs/AlertPanel"
import CardPanel from "./components/dialogs/CardPanel"
import GameStatusPanel from "./components/dialogs/GameStatusPanel"
import SplashScreen from "./components/dialogs/SplashScreen"
import "./style.css"
import calcTestData from "./AirUnitTestData"

export default App
export function App() {
  const [splash, setSplash] = useState(true)
  const [gameState, setGameState] = useState(false)
  const [isMoveable, setIsMoveable] = useState(false)
  const [scale, setScale] = useState(1)
  const [testClicked, setTestClicked] = useState(false)
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

  // this class will take a set of preset commands and run them in sequence in
  // order to test the React App
  // const uiTester = new UITester()
  // const { airUnitMap, updateMap } = useAirUnitStore((state) => ({
  //   airUnitMap: state.airUnitMap,
  //   updateMap: state.updateMap,
  // }));
  // console.log("******** Got air unit map -> ", airUnitMap);
  const onDrag = () => {
    setIsMoveable(true)
  }
  const onStop = () => {
    setIsMoveable(false)
  }

  const nextAction = () => {
    if (GlobalGameState.currentCarrier <= 2) {
      GlobalGameState.phaseCompleted = false
      GlobalGameState.setupPhase++
      GlobalGameState.currentCarrier++
      GlobalGameState.currentCarrierDivision = GlobalGameState.currentCarrier <= 1 ? 1 : 2
    } else {
      // end of Japanes Setup
      // next phase is Card Draw
      GlobalGameState.phaseCompleted = false
      GlobalGameState.setupPhase++
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
    }
    GlobalGameState.updateGlobalState()
  }

  // set up initial zustand air counter list
  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  const testUi = async (e) => {
    setTestClicked(true)
    const data = calcTestData()

    for (const update of data) {
      setAirUnitUpdate(update)
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
    return (
      <Navbar bg="black" data-bs-theme="dark" sticky="top" className="justify-content-between">
        <Container>
          {/* <Navbar.Brand href="/">Save</Navbar.Brand>
                <Navbar.Brand href="/">Load</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Button className="me-1" size="sm" variant="outline-secondary" onClick={() => setGameStateShow(true)}>
                Game State
              </Button>
              <Button className="me-1" size="sm" variant="outline-primary" onClick={() => setusHandShow(true)}>
                US Hand
              </Button>
              <Button className="me-1" size="sm" variant="outline-danger" onClick={() => setjpHandShow(true)}>
                Japan Hand
              </Button>
              <Button className="me-1" size="sm" variant="outline-light">
                Roll Dice
              </Button>
            </Nav>

            <img src="/images/japanflag.jpg" alt="test" style={{ marginLeft: "200px" }} width="40px" height="30px" />
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
        {/* <ModalSplash show={splash} onHide={() => setSplash(false)}></ModalSplash> */}
        <SplashScreen show={splash} onSplash={onSplash}></SplashScreen>
      </div>
    )
  }
  return (
    <>
      <AlertPanel show={alertShow} onHide={() => setAlertShow(false)} />
      <GameStatusPanel show={gameStateShow} gameState={gameState} onHide={() => setGameStateShow(false)} />
      <CardPanel
        cardArray={[5, 6, 12, 13, 1, 2]}
        show={jpHandShow}
        side={"Japan"}
        onHide={() => setjpHandShow(false)}
      ></CardPanel>
      <CardPanel
        cardArray={[13, 3, 8, 2]}
        show={usHandShow}
        side={"US"}
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
              />
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </>
  )
}
