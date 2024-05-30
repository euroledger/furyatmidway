import "../../board.css";
import AirCounter from "./AirCounter";
import GlobalGameState from "../../../model/GlobalGameState";

function AirCounters({
  controller,
  onDrag,
  onStop,
  getAirBox,
  setAirBox,
  counterData,
  airUnitUpdate,
  setAlertShow
}) {
  const counters = Array.from(counterData.values());
  const airCounters = counters.map((airUnit) => {
    const carrierIndex = GlobalGameState.JAPAN_CARRIERS.indexOf(
      airUnit.carrier
    );
    if (
      carrierIndex > GlobalGameState.currentCarrier &&
      GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP
    ) {
      return;
    }
    if (airUnit.constructor.name === "AirUnit") {
      return (
        <AirCounter
          controller={controller}
          key={airUnit.name}
          onDrag={onDrag}
          onStop={onStop}
          counterData={airUnit}
          getAirBox={getAirBox}
          setAirBox={setAirBox}
          airUnitUpdate={airUnitUpdate}
          setAlertShow={setAlertShow}
        ></AirCounter>
      );
    }
  });

  return <>{airCounters}</>;
}

export default AirCounters;
