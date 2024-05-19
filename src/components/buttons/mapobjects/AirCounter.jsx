import React, { useState } from "react";
import "../../board.css";
import DropCommand from "../../../commands/DropCommand";
import COMMAND_TYPE from "../../../commands/COMMAND_TYPE";
import GlobalGameState from "../../../model/GlobalGameState";


function AirCounter({ controller, onDrag, onStop, getAirBox, counterData }) {
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  });

  const handleDrop = (event) => {
    event.preventDefault();

    const { name, offsets, index } = getAirBox()

    console.log("DROP...")
    if (!offsets) {
      return
    }

    const { boxName, boxIndex } = controller.getAirUnitLocation(counterData.name)

    console.log("**************>>>>>>>>>>>>>>>> boxName= ", boxName, ", boxIndex = ", boxIndex)
    setPosition({
      ...position,
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
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
