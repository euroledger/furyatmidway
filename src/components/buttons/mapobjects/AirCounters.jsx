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
}) {
  const counters = Array.from(counterData.values());
  const airCounters = counters.map((airUnit) => {
    // console.log(
    //   ">>>>>>>>>>>>>>>> airUnit.carrier= ",
    //   airUnit.carrier,
    //   "; current setup carrier = ",
    //   GlobalGameState.getCarrier()
    // );

    console.log("++++++++++++++ Index of this air unit's carrier in array is ", GlobalGameState.JAPAN_CARRIERS.indexOf(airUnit.carrier))
    console.log("++++++++++++++ Carrier index = ", GlobalGameState.currentCarrier)

    const carrierIndex = GlobalGameState.JAPAN_CARRIERS.indexOf(airUnit.carrier)
    if (
      carrierIndex > GlobalGameState.currentCarrier &&
      GlobalGameState.gamePhase === GlobalGameState.PHASE.SETUP
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
        ></AirCounter>
      );
    }
  });
  return <>{airCounters}</>;
}

export default AirCounters;
