import React, { useEffect, useRef, useState } from "react";

import "./popupmenu.css";

function PopupMenu({ position, menuItems, handleButtonChange, myRef }) {
  const buttonDisabledList = menuItems.map((p) => p.userData.isDisabled);

  const [disabled, setDisabled] = useState(buttonDisabledList);

  const t = position.top + 2;

  const myButtons = menuItems.map((p, index) => {
    p.userData.index = index;
    return (
      <button
        type="button"

        class="list-group-item list-group-item-action"
        key={p.label}
        disabled={disabled[index]}
        onClick={(event) => handleButtonChange(event, p.userData)}
      >
        {p.label}
      </button>
    );
  });
  return (
    <div
      ref={myRef}
      class={`dropdown-pos`}
      style={{ zIndex: "100", left: `${position.left+1}%`, top: `${t}%` }}
    >
      <div class="list-group">{myButtons}</div>
    </div>
  );
}

export default PopupMenu;
