import React, { useState } from "react";
import "../../board.css";
import MoveCommand from "../../../commands/MoveCommand";
import COMMAND_TYPE from "../../../commands/COMMAND_TYPE";
import GlobalGameState from "../../../model/GlobalGameState";
import GlobalUnitsModel from "../../../model/GlobalUnitsModel";

function AirCounter({ controller, onDrag, onStop, getAirBox, counterData }) {
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  });
  
  const handleDrop = (event) => {
    event.preventDefault();

    const { name, offsets, index } = getAirBox()

    if (!offsets) {
      return
    }

    const { boxName, boxIndex } = controller.getAirUnitLocation(counterData.name)

    const from = boxName === GlobalUnitsModel.AirBoxes.OFFBOARD ? "OFFBOARD" : boxName + " - box " + boxIndex

    const to = `${name} - box ${index}`

    setPosition({
      ...position,
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
    });

    controller.addAirUnitToBox(name, index, counterData)

    let command = new MoveCommand(COMMAND_TYPE.MOVE, counterData.longName, from, to)
    GlobalGameState.log(`Command: ${command.toString()}`)

    // set air unit location to new location (to)
    // 1. add air unit to box - this automatically updates the map of locations (and removes from old box)

    // 2. set the state of prev box index to enabled and new (to) box index to disabled
    // pass this state into here from above as it will be used to re-render the drag and drop objects
    // this prevents more than one counter being dropped into the same drop zone
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
