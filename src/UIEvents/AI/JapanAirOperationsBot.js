import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import Controller from "../../controller/Controller"
import { distanceBetweenHexes, hexesEqual } from "../../components/HexUtils"
import HexCommand from "../../commands/HexCommand"
import { createStrikeGroupUpdate } from "../../AirUnitData"
import { mergeUnique } from "../../controller/AirOperationsHandler"
import {
  setValidDestinationBoxes,
  isFirstAirOpForStrike,
  firstAirOpUSStrikeRegion,
  secondAirOpUSStrikeRegion,
  firstAirOpJapanStrikeRegion,
  secondAirOpJapanStrikeRegion,
  setValidDestinationBoxesNightOperations,
  getCarrierForLocation,
  checkForReorganization,
  reorganizeUnits,
} from "../../controller/AirOperationsHandler"
import { usAirBoxArray } from "../../AirUnitData"
import JapanAirBoxOffsets from "../../components/draganddrop/JapanAirBoxOffsets"
import { delay } from "../../DiceHandler"
import { DELAY_MS } from "../../PlayerState/StateUtils"
import Command from "../../commands/Command"
import { faL } from "@fortawesome/free-solid-svg-icons"
import GlobalInit from "../../model/GlobalInit"

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

function getAirDistancesIJN(controller, currentHex) {
  const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

  let distanceBetweenCurrentHexandCSF = 100
  let distanceBetweenCurrentHexandUSDMCV = 100

  if (locationCSF !== undefined && locationCSF.currentHex !== undefined) {
    distanceBetweenCurrentHexandCSF = distanceBetweenHexes(currentHex, locationCSF.currentHex)
  }
  if (locationUSDMCV !== undefined && locationUSDMCV.currentHex !== undefined) {
    distanceBetweenCurrentHexandUSDMCV = distanceBetweenHexes(currentHex, locationUSDMCV.currentHex)
  }

  return {
    distanceBetweenCurrentHexandCSF,
    distanceBetweenCurrentHexandUSDMCV,
  }
}

function getFleetDistances(controller) {
  const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

  let distanceBetween1AFandUSDMCV = 100
  let distanceBetween1AFandCSF = 100

  if (
    !controller.allCarriersSunkorDMCV(GlobalUnitsModel.Side.JAPAN) &&
    !controller.allCarriersSunkorDMCV(GlobalUnitsModel.Side.US, true) &&
    locationCSF.currentHex !== undefined &&
    location1AF.currentHex !== undefined
  ) {
    distanceBetween1AFandCSF = distanceBetweenHexes(location1AF.currentHex, locationCSF.currentHex)
  }
  if (
    locationUSDMCV !== undefined &&
    locationUSDMCV.currentHex !== undefined &&
    location1AF.boxName !== HexCommand.FLEET_BOX
  ) {
    distanceBetween1AFandUSDMCV = distanceBetweenHexes(location1AF.currentHex, locationUSDMCV.currentHex)
  }

  return {
    distanceBetween1AFandCSF,
    distanceBetween1AFandUSDMCV,
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
async function moveAttackingStrikeUnitsToReturnBoxes(strikeGroup, setAirUnitUpdate) {
  const strikeUnitsReturning = GlobalInit.controller.getAirUnitsInStrikeGroups(strikeGroup.box)

  for (const unit of strikeUnitsReturning) {
    await delay(40)
    setValidDestinationBoxes(GlobalInit.controller, unit.name, unit.side)
    await moveAirUnit(GlobalInit.controller, unit, setAirUnitUpdate)
  }
}

async function moveAirUnitToFlightDeck({ controller, unit, setAirUnitUpdate, test, box, index }) {
  await delay(40)

  const update = {
    name: unit.name,
    boxName: box,
    index: index,
  }
  let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
  update.position = position1.offsets[update.index]
  if (test) {
    controller.addAirUnitToBox(update.boxName, update.index, unit)
    return
  }
  update.handle = 1
  setAirUnitUpdate(update)

  await delay(40)
}

async function moveAirUnitToCAP({ controller, unit, setAirUnitUpdate, test, box, index }) {
  const update = {
    name: unit.name,
    boxName: box,
    index: index,
  }
  let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
  update.position = position1.offsets[update.index]
  if (test) {
    controller.addAirUnitToBox(update.boxName, update.index, unit)
    return
  }
  update.handle = 2

  setAirUnitUpdate(update)

  await delay(DELAY_MS)
}

async function moveAirUnitToStrikeGroup({ controller, unit, setAirUnitUpdate, test, strikeBox }) {
  await delay(40)
  const airBox = strikeBox ?? getNextAvailableStrikeBox(controller, GlobalUnitsModel.Side.US)
  const update = {
    name: unit.name,
    boxName: airBox,
  }
  update.index = controller.getFirstAvailableZone(update.boxName)
  let position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)

  if (position1 === undefined) {
    return // this can happen in rare situation where all strike boxes are used up
  }
  update.position = position1.offsets[update.index]
  // console.log("Send Air Unit update:", update)

  if (test) {
    controller.addAirUnitToBox(update.boxName, update.index, unit)
    return
  }
  update.handle = 3

  setAirUnitUpdate(update)

  await delay(40)
}

async function moveStrikeGroup(controller, unit, fromHex, toHex, setStrikeGroupUpdate, test) {
  await delay(DELAY_MS)

  if (test) {
    // move the unit to the new location (test only)
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: true,
        counterData: unit,
        from: fromHex,
        to: toHex,
        side: GlobalUnitsModel.Side.US,
        loading: false,
      },
    })
  } else {
    // edge case if from hex and to hex are the same, teleport to Midway and back
    if (fromHex.currentHex !== undefined && hexesEqual(fromHex, toHex)) {
      const usStrikeGroupMove1 = createStrikeGroupUpdate(unit.name, Controller.MIDWAY_HEX)
      setStrikeGroupUpdate(usStrikeGroupMove1)

      await delay(10)
    }
    const usStrikeGroupMove2 = createStrikeGroupUpdate(unit.name, toHex.currentHex.q, toHex.currentHex.r)
    setStrikeGroupUpdate(usStrikeGroupMove2)
    await delay(DELAY_MS)
  }
}
async function hangarToFlightDeck({ controller, unit, setAirUnitUpdate, test }) {
  await delay(40)
  // 7b. Get valid destinations for units in Hangar
  // 7c. Move Units from Hangar to Flight Deck
  setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.JAPAN)

  const destinations = controller.getValidAirUnitDestinations(unit.name)

  if (destinations.length === 0) {
    return
  }
  const box = destinations.find((box) => box.includes("FLIGHT"))

  if (!box) {
    return
  }
  const index = controller.getFlightDeckSlot(unit.carrier, GlobalUnitsModel.Side.JAPAN, true, box)
  if (index !== -1) {
    await delay(40)
    await moveAirUnitToFlightDeck({ controller, unit, setAirUnitUpdate, test, box, index })
  }
  await delay(40)
}

async function flightDecktoCAP(controller, unit, setAirUnitUpdate, test, midway) {
  await delay(40)
  // 7b. Get valid destinations for units in Hangar
  // 7c. Move Units from Hangar to Flight Deck
  setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.JAPAN)

  const destinations = controller.getValidAirUnitDestinations(unit.name)

  if (destinations.length === 0) {
    return
  }
  let box = destinations.find((box) => box === "CD1 CAP")

  if (!box) {
    box = destinations.find((box) => box === "CD2 CAP")
  }

  if (!box) {
    return
  }
  const index = controller.getFirstAvailableZone(box)
  if (index !== -1) {
    await moveAirUnitToCAP({ controller, unit, setAirUnitUpdate, test, box, index })
  }
  await delay(40)
}

export async function moveAirUnitsFromHangarEndOfNightOperation(controller, side, setAirUnitUpdate) {
  // Move Fighters First -> All go to CAP
  // Move Attack aircraft to Flight Deck
  const units = controller.getAllUnitsInUSHangars()

  // get the fighters
  const fighters = units.filter((unit) => !unit.aircraftUnit.attack)
  const attackAircraft = units.filter((unit) => unit.aircraftUnit.attack)

  // TODO If there are 2 free flight deck slots and only one attack unit (same parent carrier)
  // move one fighter unit to flight deck

  for (const unit of fighters) {
    const numFreeFlightDeckSlots = setValidDestinationBoxesNightOperations(controller, unit.name, side, true)
    const destBoxes = controller.getValidAirUnitDestinations(unit.name)
    await delay(10)
    await moveAirUnitNight(controller, unit, setAirUnitUpdate, destBoxes)
  }

  for (const unit of attackAircraft) {
    setValidDestinationBoxesNightOperations(controller, unit.name, side, true)
    const destBoxes = controller.getValidAirUnitDestinations(unit.name)
    await moveAirUnitNight(controller, unit, setAirUnitUpdate, destBoxes)
  }
}
// TODO JAPAN
export async function moveAirUnitNight(controller, unit, setAirUnitUpdate, destBoxes) {
  if (destBoxes.length === 0) {
    return
  }
  // go to first available destination
  let update = {
    name: unit.name,
    boxName: destBoxes[0],
  }

  const position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
  update.index = controller.getFirstAvailableZone(update.boxName)
  if (position1 === undefined) {
    return
  }
  update.position = position1.offsets[update.index]
  update.log = true
  await delay(50)

  update.handle = 4

  setAirUnitUpdate(update)
  await delay(50)
}
export async function moveAirUnit(controller, unit, setAirUnitUpdate, night) {
  if (night) {
    setValidDestinationBoxesNightOperations(controller, unit.name, GlobalUnitsModel.Side.JAPAN)
  } else {
    setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.JAPAN)
  }

  const destBoxes = controller.getValidAirUnitDestinations(unit.name)

  if (destBoxes.length === 0) {
    // this can only happen if all carriers sunk, leave for now

    // Or if carrier(s) at capacity

    // TODO MOVE TO ELIMINATED UNITS (ORPHAN!)

    return
  }
  // TODO Decide on best destination!! not just first one

  // go to first available destination
  let update = {
    name: unit.name,
    boxName: destBoxes[0],
  }

  const position1 = JapanAirBoxOffsets.find((box) => box.name === update.boxName)
  update.index = controller.getFirstAvailableZone(update.boxName)
  if (position1 === undefined) {
    console.log("ERROR: position1 undefined in return strike units")
    return
  }
  update.position = position1.offsets[update.index]

  await delay(50)
  update.handle = 5

  setAirUnitUpdate(update)
  await delay(50)
}

export function checkAllBoxesForReorganization(controller, unit, fromBox, side, auto) {
  let carrierForUnit = getCarrierForLocation(controller, unit.name, side)

  if (carrierForUnit === undefined) {
    carrierForUnit = controller.getCarrierForAirUnit(unit.name)

    if (carrierForUnit === undefined) {
      return []
    }
    // all carriers in this TF sunk or DMCV
  }

  let carrierName = carrierForUnit
  // if (carrierName === undefined) {
  //   carrierName = carrierForUnit
  // }
  let toBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")

  // check reorg within box
  let reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits && reorgUnits.length > 0) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return reorgUnits
  }
  let flightBox = controller.getAirBoxForNamedShip(side, carrierName, "FLIGHT")
  let fromFlightBox = controller.getAirBoxForNamedShip(side, carrierName, "FLIGHT")

  // check reorg within box
  // console.log("FLIGHT BOLLOCKS 1 fromBox=", fromBox, "toBox=", toBox)
  reorgUnits = checkForReorganization(controller, fromFlightBox, flightBox, auto)

  // console.log("+++++++++++++ REORG FLIGHT 1 DECK UNITS=", reorgUnits)
  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return reorgUnits
  } else {
    let carrier = controller.getOtherCarrierInTF(carrierName, side)
    if (carrier) {
      flightBox = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT")
      fromFlightBox = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT")

      // check reorg within box
      // console.log("FLIGHT BOLLOCKS 2 fromBox=", fromBox, "toBox=", toBox)
      reorgUnits = checkForReorganization(controller, fromFlightBox, flightBox, auto)
      // console.log("+++++++++++++ REORG FLIGHT 2 DECK UNITS=", reorgUnits)
      if (reorgUnits) {
        controller.setReorganizationUnits(unit.name, reorgUnits)
        return reorgUnits
      }
    }
  }
  // check reorg across boxes
  // 1. Same Carrier
  reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return reorgUnits // Japan air unit must use its own carrier if possible
    }
  }
  // 2. Other Carrier in Same Task Force
  let carrier = controller.getOtherCarrierInTF(carrierName, side)
  if (!carrier) {
    if (reorgUnits === null) {
      return []
    }
    return reorgUnits
  }
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

  let reorgUnits2 = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits2) {
    if (reorgUnits2) {
      reorgUnits2 = mergeUnique(reorgUnits, reorgUnits2)
    }
    controller.setReorganizationUnits(unit.name, reorgUnits2)
    return reorgUnits2
  }

  // 3. Other Task Force Carrier(s)
  const taskForce = controller.getTaskForceForCarrier(carrier.name, side)
  const carriersInOtherTaskForce = controller.getCarriersInOtherTF(taskForce, side)

  let reorgUnits1 = new Array()
  for (const carrier of carriersInOtherTaskForce) {
    toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
    let reorgUnits2 = checkForReorganization(controller, fromBox, toBox, auto)
    if (reorgUnits2) {
      reorgUnits1 = mergeUnique(reorgUnits1, reorgUnits2)
    }
  }
  if (reorgUnits1) {
    controller.setReorganizationUnits(unit.name, reorgUnits1)
  }
  return reorgUnits1
}
export async function generateJapanAirOperationsMovesCarriers(controller, stateObject, test) {
  // return // QUACK TESTING US DOES NOTHING...

  const { setAirUnitUpdate } = stateObject

  // Get all air units in Return Boxes - do this first to free up strike boxes
  let units = controller.getAirUnitsInStrikeBoxesReadyToReturn(GlobalGameState.sideWithInitiative)

  if (units.length > 0) {
    for (let unit of units) {
      if (unit.aircraftUnit.moved) {
        continue
      }
      await delay(50)
      await moveAirUnit(controller, unit, setAirUnitUpdate)
    }
  }

  // i) MOVE UNITS FROM RETURN BOX 2 -> RETURN BOX 1
  // ii) MOVE UNITS FROM RETURN BOX 1 -> CARRIER HANGAR

  units = controller.getAttackingReturningUnitsNotMoved(GlobalGameState.sideWithInitiative)
  if (units.length > 0) {
    for (let unit of units) {
      if (unit.aircraftUnit.moved) {
        continue
      }
      await delay(50)
      await moveAirUnit(controller, unit, setAirUnitUpdate)
    }
  }

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
  const { distanceBetween1AFandCSF, distanceBetweenCSFandUSDMCV } = getFleetDistances(controller)

  const minDistanceToEnemyFleet = Math.min(distanceBetween1AFandCSF, distanceBetweenCSFandUSDMCV)

  // do not prepare any strike groups if no enemy fleets <=5 hexes away
  if ((minDistanceToEnemyFleet > 5 && minDistanceToEnemyFleet !== 100) || minDistanceToEnemyFleet === -100) {
    return
  }

  // get all attack aircraft
  let japanAirUnitsOnFlightDecks = controller.getAllUnitsOnJapanFlightDecks(false)
  let japanFighterAirUnitsOnFlightDecks = controller.getAllUnitsOnJapanFlightDecks(true)

  const splitStrike = japanAirUnitsOnFlightDecks.length + japanFighterAirUnitsOnFlightDecks.length > 4

  console.log("GOOCH!!!!!!!!!!!!!!! splitStrike=", splitStrike)
  // Set Up Strike Groups first

  // if last air op of turn 3 and fleet out of range do not launch strikes
  if (GlobalGameState.gameTurn === 3 && GlobalGameState.airOperationPoints["japan"] === 1) {
    if (minDistanceToEnemyFleet > 2) {
      return
    }
  }
  let strikeBox
  let strike1 = true // alternate between two boxes in turn1
  for (let unit of japanAirUnitsOnFlightDecks) {
    setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.JAPAN)
    const destinations = controller.getValidAirUnitDestinations(unit.name)

    const unitsOnCarrierFlighftDeck = controller.getAllUnitsOnJapanFlightDeckofNamedCarrier(unit.carrier)

    const hits = controller.getCarrierHits(unit.carrier)

    if (unitsOnCarrierFlighftDeck.length === 1 && hits > 0) {
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

    if (unit.aircraftUnit.attack && minDistanceToEnemyFleet > 5) {
      //  OUT OF RANGE
      // console.log("TOUT OF RANGE")
      continue
    }

    console.log(">>>>>>>>>>>>>>>>>>>>>> MAGIC------ BOX=", strikeBox)
    // If two step attack and last air op

    if (unit.aircraftUnit.attack) {
      let strikeBox1 = destinations.find((box) => box.includes("STRIKE"))
      if (splitStrike) {
        let strikeBox2 = destinations.find((box) => box.includes("STRIKE") && box !== strikeBox1)

        if (!strike1) {
          strikeBox = strikeBox2
        } else {
          strikeBox = strikeBox1
        }
        strike1 = !strike1
      } else {
        strikeBox = strikeBox1
      }

      // console.log("\t=> ADD TO STRIKE")

      await moveAirUnitToStrikeGroup({
        controller,
        unit,
        setAirUnitUpdate,
        test,
        strikeBox,
      })
    }
  }

  // get all fighter aircraft
  japanAirUnitsOnFlightDecks = controller.getAllUnitsOnJapanFlightDecks(true)

  strike1 = false
  for (let unit of japanAirUnitsOnFlightDecks) {
    const location = controller.getAirUnitLocation(unit.name)

    // check for rare edge case of two 1-step units on flight deck of same type
    const reorgUnits = checkAllBoxesForReorganization(
      controller,
      unit,
      location.boxName,
      GlobalUnitsModel.Side.JAPAN,
      false,
    )

    // auto reorganize units if AI
    if (reorgUnits && reorgUnits.length === 2) {
      reorganizeUnits(controller, reorgUnits, unit)
    }

    setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.JAPAN)

    const destinations = controller.getValidAirUnitDestinations(unit.name)

    let strikeBox1 = destinations.find((box) => box.includes("STRIKE"))
    if (splitStrike) {
      let strikeBox2 = destinations.find((box) => box.includes("STRIKE") && box !== strikeBox1)

      if (!strike1) {
        strikeBox = strikeBox2
      } else {
        strikeBox = strikeBox1
      }
      strike1 = !strike1
    } else {
      strikeBox = strikeBox1
    }

    // 5. if destinations includes a strike box then we know there is an attack unit there so we can move this fighter
    if (strikeBox !== undefined) {
      await moveAirUnitToStrikeGroup({
        controller,
        unit,
        setAirUnitUpdate,
        test,
        strikeBox,
      })
    } else {
      // If CAP is valid destination -> move to CAP
      const capBox = destinations.find((box) => box.includes("CD1 CAP") || box.includes("CD2 CAP"))
      if (capBox !== undefined) {
        flightDecktoCAP(controller, unit, setAirUnitUpdate, test, false)
      }
    }
  }

  // 6. Move Unit from Flight Deck to CAP Boxes
  // 7a. Get all air units in Hangar

  let unitsInHangar = controller.getAllUnitsInJapanHangars()

  // i) fighters
  let fighters = unitsInHangar.filter((unit) => unit.aircraftUnit.attack === false)
  for (let unit of fighters) {
    if (unit.aircraftUnit.moved === true) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setAirUnitUpdate, test })
    await delay(10)
  }

  // ii) SBDs
  let diveBombers = unitsInHangar.filter((unit) => unit.aircraftUnit.diveBomber === true)
  for (let unit of diveBombers) {
    if (unit.aircraftUnit.moved === true) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setAirUnitUpdate, test })
    await delay(10)
  }

  // ii) TBDs
  let torpedoBombers = unitsInHangar.filter(
    (unit) => unit.aircraftUnit.diveBomber === false && unit.aircraftUnit.attack === true,
  )
  for (let unit of torpedoBombers) {
    if (unit.aircraftUnit.moved === true) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setAirUnitUpdate, test })
    await delay(10)
  }

  // 8b. Get valid destinations for units in Return Boxes
  // 8c. Move Units in Return Boxes to next Return Box or Hangar
}

// TODO Move this somewhere so the Japanese can use it, controller???
export function sortStrikeGroups(controller, strikeUnits) {
  // order of strike group moves
  // 1. Midway SGs first
  // 2. SGs with Fighter escort
  // 3. SGs with 2 units
  // 4. Others

  let strikeUnitSortedProperties = new Array()
  let myStrikeGroup
  for (const strikeGroup of strikeUnits) {
    if (strikeGroup.attacked) {
      continue
    }
    myStrikeGroup = strikeGroup

    // units property needed for sort
    myStrikeGroup.units = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    if (myStrikeGroup.units.length === 0) {
      continue
    }
    strikeUnitSortedProperties.push(myStrikeGroup)
  }

  const sortedUnits = strikeUnitSortedProperties.sort(function (a, b) {
    if (a.name.includes("Midway") && !b.name.includes("Midway")) {
      return 1
    } else if (!a.name.includes("Midway") && b.name.includes("Midway")) {
      return -1
    } else if (controller.anyFightersInStrikeGroup(a.box) && !controller.anyFightersInStrikeGroup(b.box)) {
      return -1
    } else if (!controller.anyFightersInStrikeGroup(a.box) && controller.anyFightersInStrikeGroup(b.box)) {
      return -1
    } else if (a.units.length === 2 && b.units.length !== 2) {
      return -1
    } else if (a.units.length !== 2 && b.units.length === 2) {
      return 1
    }
    return -1
  })
  return sortedUnits
}

export function getFirstAirOpTargetsInRange(controller, strikeGroup, speed, airOp) {
  const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
  if (unitsInGroup.length === 0) {
    return []
  }
  let strikeGroupLocation

  if (airOp === 1) {
    // strike units on carrier -> use location of 1AF
    strikeGroupLocation = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  } else {
    // second air op, strike group is at sea
    strikeGroupLocation = controller.getStrikeGroupLocation(strikeGroup.name, GlobalUnitsModel.Side.JAPAN)
  }
  const { distanceBetweenCurrentHexandCSF, distanceBetweenCurrentHexandUSDMCV } = getAirDistancesIJN(
    controller,
    strikeGroupLocation.currentHex,
  )

  let targets = new Array()

  if (distanceBetweenCurrentHexandCSF <= speed) {
    targets.push("CSF")
  }

  if (distanceBetweenCurrentHexandUSDMCV <= speed) {
    targets.push("US-DMCV")
  }
  return targets
}

export function getSecondAirOpTargetsInRange(controller, strikeGroup) {
  // get list of target that are between 3 and 5 hex range
  // these can be attacked in the second air op

  const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
  if (unitsInGroup.length === 0) {
    return []
  }
  let strikeGroupLocation

  strikeGroupLocation = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

  const { distanceBetweenCurrentHexandCSF, distanceBetweenCurrentHexandUSDMCV } = getAirDistancesIJN(
    controller,
    strikeGroupLocation.currentHex,
  )

  let targets = new Array()

  if (distanceBetweenCurrentHexandCSF <= 3 && distanceBetweenCurrentHexandCSF > 2) {
    targets.push("CSF")
  }

  if (distanceBetweenCurrentHexandUSDMCV <= 3 && distanceBetweenCurrentHexandUSDMCV > 2) {
    targets.push("US-DMCV")
  }
  return targets
}

export function getClosestHexToTarget(target, ijnRegion) {
  // Find hex in ijnRegion that is closest to target
  let distance = 100
  let toHex
  for (const hex of ijnRegion) {
    const distanceBH = distanceBetweenHexes(hex, target.currentHex)
    if (distanceBH < distance) {
      distance = distanceBH
      toHex = hex
    }
  }

  return {
    currentHex: {
      q: toHex.q,
      r: toHex.r,
    },
  }
}

export function numTargetsInRange(strikeUnits) {
  const targets = new Set()
  for (const strikeGroup of strikeUnits) {
    for (const target of strikeGroup.targetsFirstAirOp) {
      targets.add(target)
    }
    for (const target of strikeGroup.targetsSecondAirOp) {
      targets.add(target)
    }
  }
  return targets.size
}

export function getAllTargetsInRange(controller, strikeUnits) {
  for (const strikeGroup of strikeUnits) {
    if (isFirstAirOpForStrike(controller, strikeGroup, GlobalUnitsModel.Side.JAPAN)) {
      const targetsFirstAirOp = getFirstAirOpTargetsInRange(controller, strikeGroup, 2, 1)
      strikeGroup.targetsFirstAirOp = targetsFirstAirOp

      const targetsSecondAirOp = getSecondAirOpTargetsInRange(controller, strikeGroup)
      strikeGroup.targetsSecondAirOp = targetsSecondAirOp
      strikeGroup.airOp = 1
    } else {
      const targetsSecondAirOp = getFirstAirOpTargetsInRange(controller, strikeGroup, 3, 2)
      strikeGroup.targetsFirstAirOp = []
      strikeGroup.targetsSecondAirOp = targetsSecondAirOp
      strikeGroup.airOp = 2
    }
    console.log(">>>>>>>>>>>>>>>>> SG", strikeGroup.name, "TARGETS FIRST AIR OP=", strikeGroup.targetsFirstAirOp)
  }
}

export async function moveStrikeGroups(controller, stateObject, test) {
  const { setStrikeGroupUpdate, setAirUnitUpdate } = stateObject

  // move any strike groups across the map

  // loop through each strike group

  // there may be some targets that are with 2 hexes and others that
  // are further away.
  // Need to allocate targets on this bases
  let strikeUnits = controller.getStrikeUnits(GlobalUnitsModel.Side.JAPAN)
  getAllTargetsInRange(controller, strikeUnits)

  // filter and sort (into strike order) strike groups with 1 or more targets

  // TODO Set priority targets

  let strikeGroupsWithTarget = strikeUnits.filter(
    (sg) => (sg.airOp === 1 && sg.targetsFirstAirOp.length > 0) || (sg.airOp === 2 && sg.targetsSecondAirOp.length > 0),
  )
  let strikeGroupsWithOutTarget = strikeUnits.filter((sg) => sg.targetsFirstAirOp.length === 0)

  strikeGroupsWithTarget = sortStrikeGroups(controller, strikeGroupsWithTarget)

  strikeUnits = strikeGroupsWithTarget.concat(strikeGroupsWithOutTarget)

  let usdmcvTargeted = false // only 1 SG should move to attack this fleet if more than 1 target
  const numberTargetsInRange = numTargetsInRange(strikeUnits)

  for (const strikeGroup of strikeUnits) {
    if (strikeGroup.attacked) {
      continue // done for this SG
    }
    const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)

    // if ((strikeGroup.units === undefined || strikeGroup.units.length === 0) && !strikeGroup.attacked) {

    if (unitsInGroup.length === 0 && !strikeGroup.attacked) {
      continue
    }

    if (isFirstAirOpForStrike(controller, strikeGroup, GlobalUnitsModel.Side.JAPAN)) {
      console.log("+++++++++++++++++++ FIRST AIR OP")
      const ijnRegion = firstAirOpJapanStrikeRegion(controller, strikeGroup)
      console.log("DEBUG SG", strikeGroup.name, strikeGroup.targetsFirstAirOp, "ijnRegion=", ijnRegion)
      if (ijnRegion.length === 0) {
        // turn 3 last air op, no strike possible
        continue
      }

      console.log("DEBUG SG", strikeGroup.name, "strikeGroup.targetsFirstAirOp=", strikeGroup.targetsFirstAirOp)
      console.log("DEBUG SG", strikeGroup.name, "strikeGroup.targetsSecondAirOp=", strikeGroup.targetsSecondAirOp)

      if (strikeGroup.targetsFirstAirOp.length === 0 && strikeGroup.targetsSecondAirOp.length === 0) {
        // no target left in range (something must have been sunk or left the board)
        strikeGroup.attacked = true
        strikeGroup.airOpMoved = 1
        strikeGroup.airOpAttacked = 1
        moveAttackingStrikeUnitsToReturnBoxes(strikeGroup, setAirUnitUpdate)
        continue
      }
      if (strikeGroup.targetsFirstAirOp.length >= 1) {
        console.log("FIRST AIR OP")
        if (GlobalGameState.gameTurn === 6 || GlobalGameState.gameTurn === 7) {
          // check DMCV
          if (strikeGroup.targetsFirstAirOp.includes("US-DMCV")) {
            const locationDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
            await moveStrikeGroup(
              controller,
              strikeGroup,
              HexCommand.OFFBOARD,
              locationDMCV,
              setStrikeGroupUpdate,
              test,
            )
            return true
          }
        }

        // For SGs with multiple possible targets, prioritise target
        // 1. IJNDMCV is priority
        // 2. CSF
        //
        // after SG moved to target exit the loop -> this function will need to be called again if there are any other SGs

        // We may have situation where one fleet is within 2 hexes and another is 5 hexes away
        // Or two fleets, both 4 or 5 hexes away but in opposite directions

        // Need to set priorities in advance of moving

        // Only send one SG to attack US DMCV -
        // Need to check if CSF is also in range

        console.log("usdmcvTargeted=", usdmcvTargeted)
        console.log("numberTargetsInRange=", numberTargetsInRange)
        console.log("strikeGroup.targetsFirstAirOp=", strikeGroup.targetsFirstAirOp)

        if (!usdmcvTargeted && numberTargetsInRange > 1 && strikeGroup.targetsFirstAirOp.includes("US-DMCV")) {
          const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
          console.log("ATTACK US DMCV!!!!!!!!!!!!!")
          await moveStrikeGroup(
            controller,
            strikeGroup,
            HexCommand.OFFBOARD,
            locationUSDMCV,
            setStrikeGroupUpdate,
            test,
          )
          usdmcvTargeted = true
          return true
        }
        if (strikeGroup.targetsFirstAirOp.includes("CSF")) {
          const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, locationCSF, setStrikeGroupUpdate, test)
          return true
        }
      } else if (strikeGroup.targetsFirstAirOp.length === 0) {
        // console.log("NO TARGETS MOVE AS CLOSE AS POSSIBLE")
        // else move as close as possible to target
        //  => loop through all hexes and pick the one which has lowest range to target
        if (!usdmcvTargeted && numberTargetsInRange > 1 && strikeGroup.targetsSecondAirOp.includes("US-DMCV")) {
          const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
          const toHex = getClosestHexToTarget(locationUSDMCV, ijnRegion)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, toHex, setStrikeGroupUpdate, test)
          usdmcvTargeted = true
          // return false MO NEED TO RETURN IF THE SG IS NOT ATTACKING
        }
        if (strikeGroup.targetsSecondAirOp.includes("CSF")) {
          const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
          const toHex = getClosestHexToTarget(locationCSF, ijnRegion)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, toHex, setStrikeGroupUpdate, test)
          // return false
        }

        if (strikeGroup.targetsSecondAirOp.length === 0) {
          // must be out of range
          // move to return 2 box
        }
      }
    } else {
      console.log(">>>>>>>>>>>>>>>>>>>> SECOND AIR OP:", strikeGroup)

      // For SGs with target, prioritise target
      // else move as RETURN 2 box (no target possible)
      const strikeGroupLocation = controller.getStrikeGroupLocation(strikeGroup.name, GlobalUnitsModel.Side.US)
      console.log(">>>>>>>>>>>>>>>>>>>> LOCATION=:", strikeGroupLocation)
      console.log(">>> TARGETS=", strikeGroup.targetsSecondAirOp)

      if (!usdmcvTargeted && numTargetsInRange > 1 && strikeGroup.targetsSecondAirOp.includes("US-DMCV")) {
        const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
        await moveStrikeGroup(controller, strikeGroup, strikeGroupLocation, locationUSDMCV, setStrikeGroupUpdate, test)
        usdmcvTargeted = true
        return true
      }
      if (strikeGroup.targetsSecondAirOp.includes("CSF")) {
        // CHECK TO SEE IF THE ALLOCATED TARGET (1AF) is STILL THERE...

        // console.log("1AF IS A TARGET...")
        const location1AF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.JAPAN)
        if (
          controller.allCarriersSunkorDMCV(GlobalUnitsModel.Side.JAPAN) ||
          location1AF.currentHex === Command.OFFBOARD
        ) {
          strikeGroup.attacked = true
          return false
        }
        console.log("MOVE SG", strikeGroup.name)
        await moveStrikeGroup(controller, strikeGroup, strikeGroupLocation, location1AF, setStrikeGroupUpdate, test)
        return true
      }

      // no targets -> set attacked to true
      strikeGroup.attacked = true
    }
  }
  return false
}
