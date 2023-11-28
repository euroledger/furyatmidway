import React from "react";
import TurnMarkerButton from "./buttons/TurnMarkerButton";
import AOPMarkerButton from "./buttons/AOPMarkerButton";

function Board({ turnHandler, onDrag, onStop }) {
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };

  return (
    <>
    <div>
        <img
          src="/images/battleboard.gif"
          alt="test"
          style={{ left: "50%" }}
          width="100%"
          height="100%"
        />
        <TurnMarkerButton
          image="/images/turnmarker.png"
          turnHandler={turnHandler}
        />
        <AOPMarkerButton
          image="/images/jpaop.png"
          side="japan"
          initialPosition={initialJpAopPosition}
          onDrag={onDrag}
          onStop={onStop}
        />
        <AOPMarkerButton
          image="/images/usaop.png"
          side="us"
          initialPosition={initialUSAopPosition}
          onDrag={onDrag}
          onStop={onStop}
        />
      </div>
    </>
  );
}

export default Board;
