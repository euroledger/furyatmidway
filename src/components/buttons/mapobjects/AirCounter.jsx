import React, { useState } from "react";
import "../../board.css";
import DropCommand from "../../../commands/DropCommand";
import COMMAND_TYPE from "../../../commands/COMMAND_TYPE";
import GlobalGameState from "../../../model/GlobalGameState";


function AirCounter({ onDrag, onStop, getAirBox, counterData }) {
  const [position, setPosition] = useState({
    hexCoords: {},
    left: counterData.position.left,
    top: counterData.position.top,
  });

  const handleDrop = (event) => {
    event.preventDefault();

    const {name, offsets, index}  = getAirBox()

    console.log("DROP...")
    if (!offsets) {
        return
    }

    console.log(`DROP ON an AIR BOX name = ${name}}`)
    Object.keys(counterData).forEach((prop)=> console.log(prop));
    
    setPosition({
        ...position,
        left: offsets.left + 0.1 + "%",
        top: offsets.top + "%",
      });
      let command = new DropCommand(COMMAND_TYPE.DROP, counterData.longName, "OFFBOARD", `${name} - box ${index}`)
      GlobalGameState.log(`Command: ${command.toString()}`)
  };

  return (
    <div>
      <input
        type="image"
        src={counterData.image}
        name="saveForm2"
        style={{
          position: "absolute",
          width: counterData.width,
          left: position.left,
          top: position.top,
          zIndex: 10
        }}
        id="saveForm2"
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

export default AirCounter;
