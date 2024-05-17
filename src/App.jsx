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

import "./style.css";

function App() {
  const [gameState, setGameState] = useState(false);
  const [isMoveable, setIsMoveable] = useState(false);
  const [scale, setScale] = useState(1);

  const onDrag = () => {
    setIsMoveable(true);
  };
  const onStop = () => {
    setIsMoveable(false);
  };

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
            <p
              className="navbar-text"
              style={{
                marginLeft: "200px",
                marginTop: "17px",
                marginRight: "5px",
              }}
            >
              {GlobalGameState.getSetupMessage()}
            </p>

            <Nav>
              {/* <p class="navbar-text">Some text</p> */}

              <Button
                className="me-1"
                variant="secondary"
                onClick={() => zoomIn()}
                disabled={true}
                style={{ background: "#9e1527" }}
              >
                Next Action
              </Button>
            </Nav>
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
  window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.which === 61 || e.which === 107 || e.which === 173 || e.which === 109 || e.which === 187 || e.which === 189)) {
      e.preventDefault();
    }
  }, false);

  // usage
  window.addEventListener('devicepixelratiochange', function (e) {
    // note: change of devicePixelRatio means change of page zoom, but devicePixelRatio itself doesn't mean page zoom
    console.log('devicePixelRatio changed from ' + e.oldValue + ' to ' + e.newValue);
  });
  return (
    <>
      <TransformWrapper
        initialScale={1}
        disabled={isMoveable}
        minScale={0.5}
        maxScale={6}
        limitToBounds={false}
        onTransformed={(e) => handleScaleChange(e)}
      // pinch={{ step: 5 }}
      >
        <Controls />

        <div class="d-flex p-2">
          <GameStatePanel gameState={gameState} />
          <TransformComponent>
            <Board
              gameStateHandler={gameStateHandler}
              onDrag={onDrag}
              onStop={onStop}
              scale={scale}
            />
          </TransformComponent>
        </div>
      </TransformWrapper>
    </>
  );
}

export default App;
