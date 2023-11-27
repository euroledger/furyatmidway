import React, { useEffect, useRef, useState } from "react";
import PopupMenu from "./PopupMenu";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";


function TurnMarkerButton({ image, turnHandler }) {
  const turnMarker = {
    initialPosition: { left: 2.6, top: 55.6 },
    items: [
      {
        label: "Advance 1 Turn",
        userData: {
          delta: [-6, -6, -9, -8.5, -6, -6, -6],
          isDisabled: false,
        },
      },
      {
        label: "Back 1 Turn",
        userData: {
          delta: [6, 6, 6, 9, 8.5, 6, 6],
          isDisabled: true,
        },
      },
    ],
  };
  const [position, setPosition] = useState(turnMarker.initialPosition);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [turnMarkerItems, setTurnMarkerDisabledState] = useState(
    turnMarker.items
  );

  const handleButtonChange = (event, userData) => {
    setDropdownVisible(false);

    const yoffset = userData.delta[GlobalGameState.gameTurn - 1];

    if (yoffset < 0) {
      GlobalGameState.gameTurn += 1;
    } else {
      GlobalGameState.gameTurn -= 1;
    }
    turnHandler()


    turnMarker.items[0].userData.isDisabled = GlobalGameState.gameTurn == 7;
    turnMarker.items[1].userData.isDisabled = GlobalGameState.gameTurn == 1;

    const newPos = position.top + yoffset;
    setPosition({ ...position, top: newPos });
    setTurnMarkerDisabledState(turnMarker.items);
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

  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          class={"button-pos dropdown-toggle"}
          style={{ position: 'absolute', width: '40px', left: `${position.left}%`, top: `${position.top}%` }}
          id="saveForm"
          onClick={handleChange}
        />
        {isDropdownVisible && (
          <PopupMenu
            position={position}
            menuItems={turnMarkerItems}
            handleButtonChange={handleButtonChange}
            myRef={myRef}
          />
        )}
      </div>
    </>
  );
}

export default TurnMarkerButton;
