import React, { useState } from "react";
import GlobalGameState from "../../model/GlobalGameState";
import SequenceOfPlay from "./SequenceOfPlay";
import GameLog from "./GameLog";

export default class GameStatePanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gs: props.gameState,
    };
  }
  render() {
    const initialLogItems = ["Logging Here buggy"]

    const mg =
      GlobalGameState.midwayGarrisonLevel > 0
        ? GlobalGameState.midwayGarrisonLevel
        : "X";
    const mif =
      GlobalGameState.midwayInvasionLevel > 0
        ? GlobalGameState.midwayInvasionLevel
        : "X";

    return (
      <>
        <div
          class="accordion border border-success"
          id="accordionExample"
          style={{ width: "500px" }}
        >
          <div class="accordion-item">
            <h4 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <p class="text-center fs-2" >Game State</p>
              </button>
            </h4>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
            >
              <div class="accordion-body">
                <p class="text-left">
                  Turn: {GlobalGameState.gameTurn} -{" "}
                  {GlobalGameState.turnText[GlobalGameState.gameTurn - 1]}
                </p>
                <p class="text-left">
                  Japan Air Ops: {GlobalGameState.airOperationPoints["japan"]}
                </p>
                <p class="text-left">
                  US Air Ops: {GlobalGameState.airOperationPoints["us"]}
                </p>
                <p class="text-left">Midway Invasion Force: {mif}</p>
                <p class="text-left">Midway Garrison: {mg}</p>
              </div>
            </div>
          </div>
          <GameLog initialLogItems={initialLogItems}></GameLog>
          <SequenceOfPlay></SequenceOfPlay>
        </div>
      </>
    );
  }
}
