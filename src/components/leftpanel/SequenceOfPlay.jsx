import React, { useState } from "react";
import GlobalGameState from "../../model/GlobalGameState";

export default class SequenceOfPlay extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   gs: props.gameState,
    // };
  }
  render() {
    return (
      <>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <p class="text-center fs-2">Sequence of Play</p>
            </button>
          </h2>
          <div
            id="collapseThree"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            // data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <p class="text-left">1. Card Draw Phase</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
