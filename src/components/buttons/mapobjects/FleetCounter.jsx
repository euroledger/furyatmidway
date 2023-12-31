import React, { useState } from "react";
import "../../board.css";
import GlobalGameState from "../../../model/GlobalGameState";
import HexCommand from '../../../HexCommand';
import COMMAND_TYPE from '../../../COMMAND_TYPE'


function FleetCounter({ onDrag, onStop, id, currentHex, counterData }) {
  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: {}
  });

  const handleDrop = (event) => {
    let command = new HexCommand(COMMAND_TYPE.MOVE, id, {currentHex: position.currentHex}, {currentHex})
    if (position.initial) {
      command = new HexCommand(COMMAND_TYPE.PLACE, id, HexCommand.OFFBOARD, {currentHex});
    }
   
    setPosition({
      initial: false,
      left: currentHex.x + counterData.position.left + counterData.offsets.x,
      top: currentHex.y + counterData.position.top + counterData.offsets.y,
      currentHex
    });
    GlobalGameState.log(`Command: ${command.toString()}`)
    // GlobalGameState.log(`${counterData.longName} moves to ${currentHex.row}-${currentHex.col}`)
  };

  return (
    <div>
      <input
        type="image"
        src={counterData.image}
        style={{
          position: "absolute",
          width: counterData.width,
          left: position.left,
          top: position.top,
        }}
        onMouseEnter={onDrag}
        onMouseLeave={onStop}
        draggabble="true"
        onDragStart={onDrag}
        onDragEnd={handleDrop}
      />
    </div>
  );
  //   });
}

export default FleetCounter;
