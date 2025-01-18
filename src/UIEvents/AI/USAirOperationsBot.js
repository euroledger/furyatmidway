import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalInit from "../../model/GlobalInit"
import Controller from "../../controller/Controller"
import { distanceBetweenHexes } from "../../components/HexUtils"
import { setValidDestinationBoxes } from "../../controller/AirOperationsHandler"
import { usAirBoxArray } from "../../AirUnitData"
import USAirBoxOffsets from "../../components/draganddrop/USAirBoxOffsets"
import { delay } from "../../DiceHandler"
import { DELAY_MS } from "../../PlayerState/StateUtils"

export function selectUSDefendingCAPUnits(controller, stateObject) {
  const { setCapAirUnits, setFightersPresent, setCapSteps } = stateObject

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)

  const capUnits = controller.getAllAirUnitsInBox(capBox)

  // AI DECISION, which CAP Units to choose
  const attackers = controller.getAttackingStrikeUnits(false)

  // Factors to take into account:
  // 1. Is this Midway
  // 2. Damage to our carrier
  // 3. Size of incoming strike
  // 4. Any fighters in this strike (makes CAP more effective)
  // 5. Random factor
  const selectedCapUnits = capUnits

  // @TODO non Midway logic
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
    setCapAirUnits(() => capUnits)
  }

  let steps = 0
  for (let unit of selectedCapUnits) {
    steps += unit.aircraftUnit.steps
    unit.aircraftUnit.intercepting = true
  }
  setCapAirUnits(() => selectedCapUnits)
  setCapSteps(() => steps)

  const fighters = controller.anyFightersInStrike(GlobalGameState.taskForceTarget, sideBeingAttacked)

  setFightersPresent(() => fighters)

  // console.log("CAP Selection - air Units =", selectedCapUnits)
  // console.log("CAP Selection - number of Steps =", steps)
  // console.log("CAP Selection - fighters present =", fighters)
  return { steps, selectedCapUnits, fighters }
}

function getFleetDistances(controller) {
  const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const locationIJNDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.US)
  const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.US)

  let distanceBetweenCSFandIJNDMCV = 100
  let distanceBetweenCSFandMIF = 100
  let distanceBetweenMidwayandIJNDMCV = 100
  let distanceBetweenMidwayandMIF = 100

  const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
  const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)

  if (locationIJNDMCV !== undefined && locationIJNDMCV.currentHex !== undefined) {
    distanceBetweenCSFandIJNDMCV = distanceBetweenHexes(locationCSF.currentHex, locationIJNDMCV.currentHex)
    distanceBetweenMidwayandIJNDMCV = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, locationIJNDMCV.currentHex)
  }
  if (locationMIF !== undefined && locationMIF.currentHex !== undefined) {
    distanceBetweenCSFandMIF = distanceBetweenHexes(locationCSF.currentHex, locationMIF.currentHex)
    distanceBetweenMidwayandMIF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, locationMIF.currentHex)
  }
  return {
    distanceBetweenCSFand1AF,
    distanceBetweenCSFandMIF,
    distanceBetweenCSFandIJNDMCV,
    distanceBetweenMidwayandIJNDMCV,
    distanceBetweenMidwayandMIF,
    distanceBetweenMidwayand1AF,
  }
}

// @TODO MOVE TO HELPER FUNCTION SO IJN CAN USE THIS
function getNextAvailableStrikeBox(controller, side) {
  if (side === GlobalUnitsModel.Side.US) {
    for (let i = 11; i <= 17; i++) {
      let box = usAirBoxArray[i]
      const strikeGroup = controller.getStrikeGroupForBox(side, box)
      if (strikeGroup.moved === true || strikeGroup.attacked === true) {
        continue
      }
      const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
      if (unitsInGroup.length === 0) {
        return box
      }
    }
  }
}
async function moveAirUnitToHangar({ controller, unit, setTestUpdate, test, box, index }) {
  const update = {
    name: unit.name,
    boxName: box,
    index: index,
  }
  let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)
  update.position = position1.offsets[update.index]
  if (test) {
    controller.addAirUnitToBox(update.boxName, update.index, unit)
    return
  }
  console.log("SET UPDATE->", update)
  setTestUpdate(update)

  await delay(DELAY_MS)
}

async function moveAirUnitToStrikeGroup({ controller, unit, setTestUpdate, test, strikeBox }) {
  const airBox = strikeBox ?? getNextAvailableStrikeBox(controller, GlobalUnitsModel.Side.US)
  const update = {
    name: unit.name,
    boxName: airBox,
  }

  update.index = controller.getFirstAvailableZone(update.boxName)
  let position1 = USAirBoxOffsets.find((box) => box.name === update.boxName)
  update.position = position1.offsets[update.index]
  // console.log("Send Air Unit update:", update)

  if (test) {
    controller.addAirUnitToBox(update.boxName, update.index, unit)
    return
  }
  setTestUpdate(update)

  await delay(DELAY_MS)
}

async function hangarToFlightDeck({ controller, unit, setTestUpdate, test }) {
  // 7b. Get valid destinations for units in Hangar
  // 7c. Move Units from Hangar to Flight Deck
  setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.US)

  const destinations = controller.getValidAirUnitDestinations(unit.name)

  if (destinations.length === 0) {
    return
  }
  const box = destinations.find((box) => box.includes("FLIGHT"))

  if (!box) {
    return
  }
  const index = controller.getFlightDeckSlot(unit.carrier, GlobalUnitsModel.Side.US, true, box)
  console.log("UNIT", unit.name, "MOVE TO", box, "INDEX", index)
  if (index !== -1) {
    await moveAirUnitToHangar({ controller, unit, setTestUpdate, test, box, index })
  }
}

export async function generateUSAirOperationsMovesCarriers(controller, stateObject, test) {
  const { setTestUpdate } = stateObject

  // for each air unit that we wish to move generate an array of destination boxes
  // (21 element vector, one for each air unit (3 x 5 carrier air units, 6 for Midway do not include B17))

  // Need to take into account:
  // - Overall Game Strategy
  // - Turn,
  // - State of Two Fleets/Remaining Air Power
  // - Distance Between Fleets or Enemy Fleet(s) and Midway
  // - Existence of MIF/DMCV Fleets
  // - Remaining Air Ops

  const turn = GlobalGameState.gameTurn
  const remainingJapanAirOps = GlobalGameState.airOperationPoints.japan
  const remainingUSAirOps = GlobalGameState.airOperationPoints.us
  const usNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
  const japanNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
  const usAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.US)
  const japanAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.JAPAN)

  // 1. Get all air units on Flight Deck (non-fighters first then fighters as order affects SG formation)

  // 2. For each unit:
  // 2a. Get valid destinations for units on Flight Deck
  // 2b Determine if it is only unit for that carrier (may not one single unit strike)
  const {
    distanceBetweenCSFand1AF,
    distanceBetweenCSFandMIF,
    distanceBetweenCSFandIJNDMCV,
    distanceBetweenMidwayandIJNDMCV,
    distanceBetweenMidwayandMIF,
    distanceBetweenMidwayand1AF,
  } = getFleetDistances(controller)

  const minDistanceToEnemyFleet = Math.min(
    distanceBetweenCSFand1AF,
    distanceBetweenCSFandMIF,
    distanceBetweenCSFandIJNDMCV
  )
  // do not prepare any strike groups if no enemy fleets <=5 hexes away
  if (minDistanceToEnemyFleet > 5) {
    return
  }

  // get all attack aircraft
  let usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(false)

  // Set Up Strike Groups first

  for (let unit of usAirUnitsOnFlightDecks) {
    if (unit.carrier.includes("Midway")) {
      continue
    }
    setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.US)

    const destinations = controller.getValidAirUnitDestinations(unit.name)
    const unitsOnCarrierFlighftDeck = controller.getAllUnitsOnUSFlightDeckofNamedCarrier(unit.carrier)

    if (unitsOnCarrierFlighftDeck.length === 1) {
      continue // for now, later need to assess situation

      // take into account
      // 1. Remaining total strength
      // 2. Relative Fleet Strength
      // 3. Is this carrier damaged (if so can only launch one plane strike)
    }
    // if this is attacking air unit and if not last air op and distance > 2 (could move out of range)
    // => 3.
    //  if enemy fleet 5 away only Move SBD Units from Flight Deck to Strike Boxes,
    //  otherwise do not do strike move (out of range for TBDs)

    if (unit.aircraftUnit.attack && !unit.aircraftUnit.diveBomber && minDistanceToEnemyFleet > 4) {
      // TBD OUT OF RANGE
      continue
    }
    if (
      unit.aircraftUnit.diveBomber &&
      (minDistanceToEnemyFleet <= 2 || (minDistanceToEnemyFleet > 2 && remainingUSAirOps > 1))
    ) {
      const strikeBox = destinations.find((box) => box.includes("STRIKE"))
      await moveAirUnitToStrikeGroup({
        controller,
        unit,
        setTestUpdate,
        test,
        strikeBox,
      })
    }

    // 4. Repeat to get TBDs into strike box
    if (
      !unit.aircraftUnit.diveBomber &&
      unit.aircraftUnit.attack &&
      (minDistanceToEnemyFleet <= 2 ||
        (minDistanceToEnemyFleet > 2 && minDistanceToEnemyFleet <= 4 && remainingUSAirOps > 1))
    ) {
      const strikeBox = destinations.find((box) => box.includes("STRIKE"))
      await moveAirUnitToStrikeGroup({
        controller,
        unit,
        setTestUpdate,
        test,
        strikeBox,
      })
    }
  }

  // get all fighter aircraft
  usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(true)

  for (let unit of usAirUnitsOnFlightDecks) {
    if (unit.carrier.includes("Midway")) {
      return
    }
    setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.US)

    const destinations = controller.getValidAirUnitDestinations(unit.name)

    // 5. if destinations includes a strike box then we know there is an attack unit there so we can move this fighter
    const strikeBox = destinations.find((box) => box.includes("STRIKE"))
    if (strikeBox !== undefined) {
      await moveAirUnitToStrikeGroup({
        controller,
        unit,
        setTestUpdate,
        test,
        strikeBox,
      })
    }
  }

  // 6. Move Unit from Flight Deck to CAP Boxes
  // 7a. Get all air units in Hangar

  let unitsInHangar = controller.getAllUnitsInUSHangars()

  // i) fighters
  let fighters = unitsInHangar.filter((unit) => unit.aircraftUnit.attack === false)
  for (let unit of fighters) {
    if (unit.carrier.includes("Midway")) {
      return
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // ii) SBDs
  let diveBombers = unitsInHangar.filter((unit) => unit.aircraftUnit.diveBomber === true)
  for (let unit of diveBombers) {
    if (unit.carrier.includes("Midway")) {
      return
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // ii) TBDs
  let torpedoBombers = unitsInHangar.filter(
    (unit) => unit.aircraftUnit.diveBomber === false && unit.aircraftUnit.attack === true
  )
  for (let unit of torpedoBombers) {
    if (unit.carrier.includes("Midway")) {
      return
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // 8a. Get all air units in Return Boxes
  // 8b. Get valid destinations for units in Return Boxes
  // 8c. Move Units in Return Boxes to next Return Box or Hangar

  // const airUnitsOnFlightDeck =
}

export async function generateUSAirOperationsMovesMidway(controller, stateObject, test) {}
