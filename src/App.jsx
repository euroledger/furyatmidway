import { React, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Board from "./components/Board";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import GameStatePanel from "./components/leftpanel/GameStatePanel";
import GlobalGameState from "./model/GlobalGameState";

import "./style.css";

function App() {
  // const [turn, setTurn] = useState(GlobalGameState.gameTurn);
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
      // <div class="container">
      //   <h1 className="display-2 text-center">Fury at Midway PC Version</h1>
      //   <div class="mt-5 mb-5 panel panel-primary text-center">
      //     <div id="button-container" class="btn-group">
      //       <button class="btn btn-primary" onClick={() => zoomIn()}>
      //         Zoom In
      //       </button>
      //       <button class="ms-2 btn btn-primary" onClick={() => zoomOut()}>
      //         Zoom Out
      //       </button>
      //       <button
      //         class="ms-2 btn btn-primary"
      //         onClick={() => resetTransform()}
      //       >
      //         Reset
      //       </button>
      //     </div>
      //   </div>
      // </div>
      <Navbar
        bg="primary"
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
  const initialJpAopPosition = { left: 2.7, top: 7 };

  function gameStateHandler() {
    setGameState(!gameState);
  }

  function handleScaleChange(event) {
    setScale(event.instance.transformState.scale);
  }

  GlobalGameState.stateHandler = gameStateHandler;

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
