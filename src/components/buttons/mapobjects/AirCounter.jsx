import React, { useState } from "react";
import "../../board.css";
import Controller from "../../../controller/Controller";
import GlobalUnitsModel from "../../../model/GlobalUnitsModel";

function AirCounter({
  controller,
  onDrag,
  onStop,
  getAirBox,
  setAirBox,
  counterData,
}) {
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  });

  const handleDrop = (event) => {
    event.preventDefault();

    const { name, offsets, index } = getAirBox();
    if (!offsets) {
      return;
    }

    //  TODO if this is a cap box and the air unit is not a fighter unit => disallow drop
    // (and display error message)
    // attack is true if the air unit is torpedo or dive bomber, i.e., not a fighter
    const airUnit = controller.getAirUnit(counterData.name)
    if (!airUnit) {
      // error
      return
    }
    console.log("data = ", airUnit);
    if (airUnit.attack && name === GlobalUnitsModel.AirBox.JP_CD_CAP1) {
      console.log(
        "*** Air Unit is not a figher unit -> Cannot be used for CAP!"
      );

      // TODO display error popup
      return;
    }
    setPosition({
      ...position,
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
    });

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name,
        counterData,
        index,
      },
    });

    // reset air box for next counter
    setAirBox({});
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
          zIndex: 10,
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
