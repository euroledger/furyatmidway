import React, { useEffect, useRef, useState } from "react";
import PopupMenu from "./PopupMenu";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import AOPOffsets from "../AopBoxOffsets";

export const AOP_MARKER_SIDE = {
  JAPAN: "japan",
  US: "us",
};

function AOPMarkerButton({
  image,
  side,
  initialPosition,
  onDrag,
  onStop,
  getZone,
  zIndex,
  incrementZIndex
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
  const [position, setPosition] = useState(initialPosition);
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

    const newPos = position.left + xoffset;
    setPosition({ ...position, left: newPos });
    setAOPMarkerDisabledState(aopMarker.items);
  };

  const myRef = useRef();

  // ensure that if the buttons are not in the same space
  // they revert to their default (centred) position
  if (
    GlobalGameState.airOperationPoints["japan"] !=
    GlobalGameState.airOperationPoints["us"] && position.top != AOPOffsets[0].top + 0.4
    && position.left != AOPOffsets[0].left + 0.3

  ) {
    setPosition({
      ...position,
      left: AOPOffsets[GlobalGameState.airOperationPoints[side]].left + 0.3,
      top: AOPOffsets[0].top + 0.4,
    });
  }

  const handleDrop = (event) => {
    event.preventDefault();

    GlobalGameState.airOperationPoints[side] = getZone();

    let leftOffset = 0;
    let topOffset = 0;
    if (
      GlobalGameState.airOperationPoints["japan"] ===
      GlobalGameState.airOperationPoints["us"]
    ) {
      leftOffset = 0.5;
      topOffset = 0.5;
      incrementZIndex(side, 10);
      zIndex += 5;
    } else {
      incrementZIndex("japan", 0);
    }

    setPosition({
      ...position,
      left: AOPOffsets[getZone()].left + 0.3 + leftOffset,
      top: AOPOffsets[getZone()].top + 0.4 - topOffset,
    });
  };

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

  const z = zIndex[side] + 5;
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
            zIndex: z,
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
