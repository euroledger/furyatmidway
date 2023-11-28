import React, { useEffect, useRef, useState } from "react";
import PopupMenu from "./PopupMenu";
import GlobalGameState from "../../model/GlobalGameState";
import Draggable from "react-draggable";
import "./button.css";

export const AOP_MARKER_SIDE = {
  JAPAN: "japan",
  US: "us",
};

function AOPMarkerButton({
  image,
  side,
  positionChangeHandler,
  onDrag,
  onStop,
}) {
  const aopMarker = {
    items: [
      {
        label: "Advance 1",
        userData: {
          delta: [3.6, 3.6, 3.6, 3.6, 3.6],
          isDisabled: false,
        },
      },
      {
        label: "Back 1",
        userData: {
          delta: [-3.6, -3.6, -3.6, -3.6, -3.6],
          isDisabled: true,
        },
      },
    ],
  };
  // const [position, setPosition] = useState(initialPosition);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [aopMarkerItems, setAOPMarkerDisabledState] = useState(aopMarker.items);

  const handleButtonChange = (event, userData) => {
    setDropdownVisible(false);

    const airOps = GlobalGameState.airOperationPoints[side];
    const xoffset = userData.delta[airOps];

    if (xoffset > 0) {
      GlobalGameState.airOperationPoints[side] += 1;
    } else {
      GlobalGameState.airOperationPoints[side] -= 1;
    }

    aopMarker.items[0].userData.isDisabled =
      GlobalGameState.airOperationPoints[side] == 4;
    aopMarker.items[1].userData.isDisabled =
      GlobalGameState.airOperationPoints[side] == 0;

    positionChangeHandler(newPos, xoffset);
    setAOPMarkerDisabledState(aopMarker.items);
  };

  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (!myRef.current) {
      return;
    }
    if (!myRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleChange = (event) => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleDrop = (event) => {
    // var x = event.clientX;
    // var y = event.clientY;
    console.log("DROPPED THE BALL!!! event = ", event);
  };

  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          class={"button-pos dropdown-toggle"}
          style={{
            position: "absolute",
            width: "40px",
            left: `${position.left}%`,
            top: `${position.top}%`,
            zIndex: "100",
          }}
          id="saveForm"
          onClick={handleChange}
          onMouseEnter={onDrag}
          onMouseLeave={onStop}
          draggabble="true"
          onDragStart={onDrag}
          onDragEnd={handleDrop}
        />
        {isDropdownVisible && (
          <PopupMenu
            position={position}
            menuItems={aopMarkerItems}
            handleButtonChange={handleButtonChange}
            myRef={myRef}
          />
        )}
      </div>
    </>
  );
}

export default AOPMarkerButton;
