import { React, useState } from "react";
import Board from "./components/Board";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import GameState from "./components/GameState";
import GlobalGameState from "./model/GlobalGameState";
import "./style.css";

function App() {
  const [turn, setTurn] = useState(GlobalGameState.gameTurn);

  function turnHandler() {
    setTurn(GlobalGameState.gameTurn)
  }

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

  return (
    <>
      <TransformWrapper>
        <Controls />
        <div class="d-flex p-2">
          <GameState turn = {turn}/>
          <TransformComponent>
            <Board turnHandler={turnHandler}/>
          </TransformComponent>
        </div>
      </TransformWrapper>
    </>
  );
}

export default App;
