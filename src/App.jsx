import { React, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Board from "./components/Board";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import GameStatePanel from "./components/leftpanel/GameStatePanel";
import GlobalGameState from "./model/GlobalGameState";
import GlobalInit from "./model/GlobalInit";
import ModalAlert from "./components/dialogs/modalAlert";
import { useAirUnitStore } from "./store/airUnitStore";
import JapanAirBoxOffsets from "./components/draganddrop/JapanAirBoxOffsets";
import GlobalUnitsModel from "./model/GlobalUnitsModel";
import TestComponent from "./components/TestComponent";

import "./style.css";

function App() {
  const [gameState, setGameState] = useState(false);
  const [isMoveable, setIsMoveable] = useState(false);
  const [scale, setScale] = useState(1);
  const [testClicked, setTestClicked] = useState(false);
  const [modalShow, setModalShow] = useState(true);

  const [airUnitUpdate, setAirUnitUpdate] = useState({
    name: "",
    position: {},
    boxName: "",
    index: -1,
  });

  // this class will take a set of preset commands and run them in sequence in
  // order to test the React App
  // const uiTester = new UITester()

  // const { airUnitMap, updateMap } = useAirUnitStore((state) => ({
  //   airUnitMap: state.airUnitMap,
  //   updateMap: state.updateMap,
  // }));

  // console.log("******** Got air unit map -> ", airUnitMap);
  const onDrag = () => {
    setIsMoveable(true);
  };
  const onStop = () => {
    setIsMoveable(false);
  };

  const nextAction = () => {
    if (GlobalGameState.currentCarrier <= 2) {
      console.log("QUACK BAD")
      GlobalGameState.phaseCompleted = false;
      GlobalGameState.setupPhase++;
      GlobalGameState.currentCarrier++;
      GlobalGameState.currentCarrierDivision =
        GlobalGameState.currentCarrier <= 1 ? 1 : 2;

    } else {
      // end of Japanes Setup
      // next phase is Card Draw
      GlobalGameState.phaseCompleted = false;
      GlobalGameState.setupPhase++;
      GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_CARD_DRAW
    }
    GlobalGameState.updateGlobalState();
  };

  // set up initial zustand air counter list

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const testUi = async (e) => {
    setTestClicked(true);
    // set state in order of commands for air units

    let boxName = GlobalUnitsModel.AirBox.JP_CD1_CAP;
    let position1 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Akagi-A6M-2b-1",
      position: position1.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK;
    let position2 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Akagi-A6M-2b-2",
      position: position2.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK;
    let position3 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Akagi-D3A-1",
      position: position3.offsets[1],
      boxName,
      index: 1,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_AKAGI_HANGER;
    let position4 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Akagi-B5N-2",
      position: position4.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);
    nextAction();

    // Kaga
    boxName = GlobalUnitsModel.AirBox.JP_CD1_CAP;
    let position5 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Kaga-A6M-2b-1",
      position: position5.offsets[1],
      boxName,
      index: 1,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK;
    let position6 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Kaga-A6M-2b-2",
      position: position6.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK;
    let position7 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Kaga-D3A-1",
      position: position7.offsets[1],
      boxName,
      index: 1,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_KAGA_HANGER;
    let position8 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Kaga-B5N-2",
      position: position8.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);
    nextAction();

    // Hiryu
    boxName = GlobalUnitsModel.AirBox.JP_CD2_CAP;
    let position9 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Hiryu-A6M-2b-1",
      position: position9.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_HIRYU_HANGER;
    let position10 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Hiryu-A6M-2b-2",
      position: position10.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_HIRYU_HANGER;
    let position11 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Hiryu-D3A-1",
      position: position11.offsets[2],
      boxName,
      index: 2,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_HIRYU_HANGER;
    let position12 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Hiryu-B5N-2",
      position: position12.offsets[3],
      boxName,
      index: 3,
    });

    await delay(500);
    nextAction();

    // Soryu
    boxName = GlobalUnitsModel.AirBox.JP_SORYU_HANGER;
    let position13 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Soryu-A6M-2b-1",
      position: position13.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_SORYU_HANGER;
    let position14 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Soryu-A6M-2b-2",
      position: position14.offsets[1],
      boxName,
      index: 1,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK;
    let position15 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Soryu-D3A-1",
      position: position15.offsets[0],
      boxName,
      index: 0,
    });

    await delay(500);

    boxName = GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK;
    let position16 = JapanAirBoxOffsets.find((box) => box.name === boxName);
    setAirUnitUpdate({
      name: "Soryu-B5N-2",
      position: position16.offsets[1],
      boxName,
      index: 1,
    });
  };

  var v = process.env.REACT_APP_MYVAR || "arse";
  let test = false;
  if (v === "test") {
    test = true;
  }
  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <Navbar
        bg="black"
        data-bs-theme="dark"
        sticky="top"
        className="justify-content-between"
      >
        <Container>
          <Navbar.Brand href="/">Save Game</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">US Hand</Nav.Link>
              <Nav.Link href="/">Japan Hand</Nav.Link>
              <Nav.Link href="/about">Roll Dice</Nav.Link>
            </Nav>

            <img
              src="/images/japanflag.jpg"
              alt="test"
              style={{ marginLeft: "100px" }}
              width="40px"
              height="30px"
            />
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
                  className="me-1"
                  variant="secondary"
                  onClick={(e) => testUi(e)}
                  // disabled={!GlobalGameState.phaseCompleted}
                  style={{ background: "#9e1527" }}
                >
                  TEST
                </Button>
                {testClicked && (
                  <TestComponent testClicked={testClicked}></TestComponent>
                )}
              </Nav>
            )}

            <ButtonGroup className="ms-auto" aria-label="Basic example">
              <Button
                className="me-1"
                variant="secondary"
                onClick={() => zoomIn()}
              >
                Zoom In
              </Button>
              <Button
                className="me-1"
                variant="secondary"
                onClick={() => zoomOut()}
              >
                Zoom Out
              </Button>
              <Button
                className="me-1"
                variant="secondary"
                onClick={() => resetTransform()}
              >
                Reset
              </Button>
            </ButtonGroup>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  function gameStateHandler() {
    setGameState(!gameState);
  }

  function handleScaleChange(event) {
    setScale(event.instance.transformState.scale);
  }

  GlobalGameState.stateHandler = gameStateHandler;

  // disable browser zoom (ctrl+ ctrl-)
  window.addEventListener(
    "keydown",
    function (e) {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.which === 61 ||
          e.which === 107 ||
          e.which === 173 ||
          e.which === 109 ||
          e.which === 187 ||
          e.which === 189)
      ) {
        e.preventDefault();
      }
    },
    false
  );

  // usage
  window.addEventListener("devicepixelratiochange", function (e) {
    // note: change of devicePixelRatio means change of page zoom, but devicePixelRatio itself doesn't mean page zoom
    console.log(
      "devicePixelRatio changed from " + e.oldValue + " to " + e.newValue
    );
  });

  // window height
  const height = window.innerHeight;

  // window width
  const width = window.innerWidth;

  return (
    <>
      {/* <ModalAlert
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
      <TransformWrapper
        initialScale={1}
        disabled={isMoveable}
        minScale={0.5}
        maxScale={6}
        limitToBounds={false}
        onTransformed={(e) => handleScaleChange(e)}
      >
        <Controls />

        <div class="d-flex p-2">
          <GameStatePanel gameState={gameState} />
          <div
            style={{
              minHeight: "648px",
              minWidth: "1080px",
              maxHeight: "648px",
              maxWidth: "1080px",
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
              />
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </>
  );
}

export default App;
