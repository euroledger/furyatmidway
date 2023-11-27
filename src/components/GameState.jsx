import React, { useState } from "react";
import GlobalGameState from "../model/GlobalGameState";

function GameState({ turn }) {

  return (
    <>
      <div
        class="border border-success p-2 mb-2  me-2"
        style={{ width: "500px" }}
      >
        <p class="text-center fs-2">Game State</p>
        <p class="text-left">
          Turn: {turn} - {GlobalGameState.turnText[turn - 1]}
        </p>
      </div>
    </>
  );
}

export default GameState;
