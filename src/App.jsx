import { React, useState } from "react";
import Board from "./components/Board";
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
      <div class="container">
        <h1 className="display-2 text-center">Fury at Midway PC Version</h1>
        <div class="mt-5 mb-5 panel panel-primary text-center">
          <div id="button-container" class="btn-group">
            <button class="btn btn-primary" onClick={() => zoomIn()}>
              Zoom In
            </button>
            <button class="ms-2 btn btn-primary" onClick={() => zoomOut()}>
              Zoom Out
            </button>
            <button
              class="ms-2 btn btn-primary"
              onClick={() => resetTransform()}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };
  const initialJpAopPosition = { left: 2.7, top: 7 };

  function gameStateHandler () {
    setGameState(!gameState); 
  }
  
  function handleScaleChange(event) {
    setScale(event.instance.transformState.scale)
  }

  GlobalGameState.stateHandler = gameStateHandler
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
            <Board gameStateHandler={gameStateHandler} onDrag={onDrag} onStop={onStop} scale={scale}/>
          </TransformComponent>
        </div>
      </TransformWrapper>
    </>
  );
}

export default App;
