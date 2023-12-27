import React, { useState } from "react";
import "../../board.css";

function AirCounter({ onDrag, onStop, getAirBox, counterData }) {
  const [position, setPosition] = useState({
    hexCoords: {},
    left: counterData.position.left,
    top: counterData.position.top,
  });

  const handleDrop = (event) => {
    event.preventDefault();

    // setPosition({
    //   left: event.clientX,
    //   top: event.clientY
    // });

    // @todo rows and cols are specific to the hex grid, this will need to change
    // for the various map boxes
    // maybe pass in the format as a prop
    // either
    //     row-col (for hexes)
    // or
    //     boxname (for the boxes, eg 1st Carrier Division CAP box)

    const {name, offsets}  = getAirBox()

    if (!offsets) {
        return
    }

    console.log(`DROP ON an AIR BOX name = ${name}, offsets =${offsets.left}, ${offsets.top}`)
    
    setPosition({
        ...position,
        left: offsets.left + 0.3 + "%",
        top: offsets.top + 0.3 + "%",
      });

    // GlobalGameState.log(`${counterData.longName} moves to ${currentHex.row}-${currentHex.col}`)
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
