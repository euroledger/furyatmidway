import React, { useRef, useEffect } from "react";
import GlobalGameState from "../../model/GlobalGameState";

function GameLog() {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [GlobalGameState.logItems.length]);

  const logRows = GlobalGameState.logItems.map((logItem, index) => {
    return <div key={index}>{logItem}</div>;
  });
  return (
    <>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <p class="text-center fs-2">Game Log</p>
          </button>
        </h2>
        <div
          id="collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="headingTwo"
        >
          <div
            class="accordion-body"
            style={{ height: "400px", overflowY: "scroll" }}
          >
            <div class="text-left">
              {logRows}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameLog;
