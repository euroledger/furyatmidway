import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import Controller from "../../controller/Controller"
import { distanceBetweenHexes } from "../../components/HexUtils"
import HexCommand from "../../commands/HexCommand"
import { createStrikeGroupUpdate } from "../../AirUnitData"
import {
  setValidDestinationBoxes,
  isFirstAirOpForStrike,
  firstAirOpUSStrikeRegion,
  secondAirOpUSStrikeRegion,
} from "../../controller/AirOperationsHandler"
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

function getAirDistances(controller, currentHex) {
  const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const locationIJNDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
  const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

  let distanceBetweenCurrentHexand1AF = 100
  let distanceBetweenCurrentHexandMIF = 100
  let distanceBetweenCurrentHexandIJNDMCV = 100

  if (location1AF !== undefined && location1AF.currentHex !== undefined) {
    distanceBetweenCurrentHexand1AF = distanceBetweenHexes(currentHex, location1AF.currentHex)
  }
  if (locationIJNDMCV !== undefined && locationIJNDMCV.currentHex !== undefined) {
    distanceBetweenCurrentHexandIJNDMCV = distanceBetweenHexes(currentHex, locationIJNDMCV.currentHex)
  }
  if (locationMIF !== undefined && locationMIF.currentHex !== undefined) {
    distanceBetweenCurrentHexandMIF = distanceBetweenHexes(currentHex, locationMIF.currentHex)
  }
  return {
    distanceBetweenCurrentHexand1AF,
    distanceBetweenCurrentHexandMIF,
    distanceBetweenCurrentHexandIJNDMCV,
  }
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


async function moveStrikeGroup(controller, unit, fromHex, toHex, setStrikeGroupUpdate, test) {
  await delay(DELAY_MS)
  const usStrikeGroupMove = createStrikeGroupUpdate(unit.name, toHex.currentHex.q, toHex.currentHex.r)

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
    console.log("SG UPDATE:", usStrikeGroupMove)
    setStrikeGroupUpdate(usStrikeGroupMove)
  }

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
      continue
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
      continue
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // ii) SBDs
  let diveBombers = unitsInHangar.filter((unit) => unit.aircraftUnit.diveBomber === true)
  for (let unit of diveBombers) {
    if (unit.carrier.includes("Midway")) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // ii) TBDs
  let torpedoBombers = unitsInHangar.filter(
    (unit) => unit.aircraftUnit.diveBomber === false && unit.aircraftUnit.attack === true
  )
  for (let unit of torpedoBombers) {
    if (unit.carrier.includes("Midway")) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // 8a. Get all air units in Return Boxes
  // 8b. Get valid destinations for units in Return Boxes
  // 8c. Move Units in Return Boxes to next Return Box or Hangar

  // const airUnitsOnFlightDeck =
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
    myStrikeGroup = strikeGroup
    myStrikeGroup.units = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
    if (myStrikeGroup.units.length === 0) {
      continue
    }
    strikeUnitSortedProperties.push(myStrikeGroup)
  }

  strikeUnitSortedProperties.sort(function (a, b) {
    if (a.name.includes("Midway") && !b.name.includes("Midway")) {
      return 1
    } else if (!a.name.includes("Midway") && b.name.includes("Midway")) {
      return -1
    } else if (controller.anyFightersInStrike(a.box) && !controller.anyFightersInStrike(b.box)) {
      return 1
    } else if (!controller.anyFightersInStrike(a.box) && controller.anyFightersInStrike(b.box)) {
      return -1
    } else if (a.units.length === 2 && b.units.length !== 2) {
      return 1
    } else if (a.units.length !== 2 && b.units.length === 2) {
      return -1
    }
    return -1
  })

  return strikeUnitSortedProperties
}

export function getFirstAirOpTargetsInRange(controller, strikeGroup, speed) {
  const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
  if (unitsInGroup.length === 0) {
    return []
  }
  let strikeGroupLocation
  if (unitsInGroup[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
    strikeGroupLocation = Controller.MIDWAY_HEX
  } else {
    strikeGroupLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  }
  const { distanceBetweenCurrentHexand1AF, distanceBetweenCurrentHexandMIF, distanceBetweenCurrentHexandIJNDMCV } =
    getAirDistances(controller, strikeGroupLocation.currentHex)

  let targets = new Array()

  console.log("distanceBetweenCurrentHexand1AF=", distanceBetweenCurrentHexand1AF)
  if (distanceBetweenCurrentHexand1AF <= speed) {
    targets.push("1AF")
  }
  if (distanceBetweenCurrentHexandMIF <= speed) {
    targets.push("MIF")
  }
  if (distanceBetweenCurrentHexandIJNDMCV <= speed) {
    targets.push("IJN-DMCV")
  }
  return targets
}

export function getSecondAirOpTargetsInRange(controller, strikeGroup) {
  // get list of target that are between 3 and 5 (or 4 for TBDs) hex range
  // these can be attacked in the second air op

  const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)
  if (unitsInGroup.length === 0) {
    return []
  }
  let strikeGroupLocation
  if (unitsInGroup[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
    strikeGroupLocation = Controller.MIDWAY_HEX
  } else {
    strikeGroupLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  }
  const { distanceBetweenCurrentHexand1AF, distanceBetweenCurrentHexandMIF, distanceBetweenCurrentHexandIJNDMCV } =
    getAirDistances(controller, strikeGroupLocation.currentHex)

  let targets = new Array()
  const speed = controller.getSlowestUnitSpeedInStrikeGroup(strikeGroup.box) + 2 // max 5 hex range

  if (distanceBetweenCurrentHexand1AF <= speed && distanceBetweenCurrentHexand1AF > 2) {
    targets.push("1AF")
  }
  if (distanceBetweenCurrentHexandMIF <= speed && distanceBetweenCurrentHexandMIF > 2) {
    targets.push("MIF")
  }
  if (distanceBetweenCurrentHexandIJNDMCV <= speed && distanceBetweenCurrentHexandIJNDMCV > 2) {
    targets.push("IJN-DMCV")
  }
  return targets
}

export function getClosestHexToTarget(target, usRegion) {
  // Find hex in usRegion that is closest to target
  let distance = 100
  let toHex
  for (const hex of usRegion) {
    const distanceBH = distanceBetweenHexes(hex, target.currentHex) 
    if (distanceBH < distance) {
      distance = distanceBH
      toHex = hex
    }
  } 
  return {
    currentHex: {
      q: toHex.q,
      r: toHex.r
    }
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
    if (isFirstAirOpForStrike(controller, strikeGroup, GlobalUnitsModel.Side.US)) {
      const targetsFirstAirOp = getFirstAirOpTargetsInRange(controller, strikeGroup, 2)
      strikeGroup.targetsFirstAirOp = targetsFirstAirOp

      const targetsSecondAirOp = getSecondAirOpTargetsInRange(controller, strikeGroup)
      strikeGroup.targetsSecondAirOp = targetsSecondAirOp
    } else {
      const speed = controller.getSlowestUnitSpeedInStrikeGroup(strikeGroup.box)
      const targetsSecondAirOp = getFirstAirOpTargetsInRange(controller, strikeGroup, speed)
      strikeGroup.targetsSecondAirOp = targetsSecondAirOp
    }
  }
}
export async function moveStrikeGroups(controller, stateObject, test) {
  const { setStrikeGroupUpdate } = stateObject

  // move any strike groups across the map

  // loop through each strike group

  // there may be some targets that are with 2 hexes and others that
  // are further away.
  // Need to allocate targets on this bases
  let strikeUnits = controller.getStrikeUnits(GlobalUnitsModel.Side.US)
  getAllTargetsInRange(controller, strikeUnits)

  const targets = numTargetsInRange(strikeUnits)

  // filter and sort (into strike order) strike groups with 1 or more targets

  // TODO Set priority targets

  let strikeGroupsWithTarget = strikeUnits.filter((sg) => sg.targetsFirstAirOp.length > 0)
  let strikeGroupsWithOutTarget = strikeUnits.filter((sg) => sg.targetsFirstAirOp.length === 0)

  strikeGroupsWithTarget = sortStrikeGroups(controller, strikeGroupsWithTarget)

  strikeUnits = strikeGroupsWithTarget.concat(strikeGroupsWithOutTarget)

  let ijndmcvTargeted = false // only 1 SG should move to attack this fleet if more than 1 target
  for (const strikeGroup of strikeUnits) {
    const unitsInGroup = controller.getAirUnitsInStrikeGroups(strikeGroup.box)

    if (unitsInGroup.length === 0 && !strikeGroup.attacked) {
      continue
    }
    if (isFirstAirOpForStrike(controller, strikeGroup, GlobalUnitsModel.Side.US)) {
      const usRegion = firstAirOpUSStrikeRegion(controller, strikeGroup)


      if (strikeGroup.targetsFirstAirOp.length >= 1) {
        if (GlobalGameState.gameTurn === 6 || GlobalGameState.gameTurn === 7) {
          // prioritise MIF 
          if (strikeGroup.targetsFirstAirOp.includes("MIF")) {
            const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
            await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, locationMIF, setStrikeGroupUpdate, test)
            return
          }
        }

        // For SGs with multiple possible targets, prioritise target
        // 1. IJNDMCV is priority
        // 2. 1AF
        // 3. MIF
        // This may change later in the game (also maybe use Midway planes vs MIF as 1st priority)
        // after SG moved to target exit the loop -> this function will need to be called again if there are any other SGs

        // We may have situation where one fleet is within 2 hexes and another is 5 hexes away
        // Or two fleets, both 4 or 5 hexes away but in opposite directions

        // Need to set priorities in advance of moving

        // Only send one SG to attack IJNDMCV -
        // Need to check if 1AF is also in range
        if (!ijndmcvTargeted && numTargetsInRange > 1 && strikeGroup.targetsFirstAirOp.includes("IJN-DMCV")) {
          const locationIJNDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, locationIJNDMCV, setStrikeGroupUpdate, test)
          ijndmcvTargeted = true
          return
        }
        if (strikeGroup.targetsFirstAirOp.includes("1AF")) {
          const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, location1AF, setStrikeGroupUpdate, test)
          return
        }
        if (strikeGroup.targetsFirstAirOp.includes("MIF")) {
          const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, locationMIF, setStrikeGroupUpdate, test)
          return
        }
      } else if (strikeGroup.targetsFirstAirOp.length === 0) {

        console.log("NO TARGETS IN RANGE MOVE STRIKE GROUPS AS CLOSE AS POSSIBLE")
        // else move as close as possible to target
        //  => loop through all hexes and pick the one which has lowest range to target
        if (!ijndmcvTargeted && numTargetsInRange > 1 && strikeGroup.targetsSecondAirOp.includes("IJN-DMCV")) {
          const locationIJNDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
          const toHex = getClosestHexToTarget(locationIJNDMCV, usRegion)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, toHex, setStrikeGroupUpdate, test)
          ijndmcvTargeted = true
        }
        if (strikeGroup.targetsSecondAirOp.includes("1AF")) {
          console.log("\t=>1AF IS CLOSEST TARGET")
          const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
          const toHex = getClosestHexToTarget(location1AF, usRegion)
          console.log("toHex=", toHex)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, toHex, setStrikeGroupUpdate, test) 
        }
        if (strikeGroup.targetsSecondAirOp.includes("MIF")) {
          const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
          const toHex = getClosestHexToTarget(locationMIF, usRegion)
          await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, toHex, setStrikeGroupUpdate, test)
        }
      }
    } else {
      const usRegion = secondAirOpUSStrikeRegion(controller, strikeGroup)

      const { distanceBetweenCurrentHexand1AF, distanceBetweenCurrentHexandMIF, distanceBetweenCurrentHexandIJNDMCV } =
        getAirDistances(controller, strikeGroup.location)

      // For SGs with target, prioritise target
      // else move as RETURN 2 box (no target possible)
      if (!ijndmcvTargeted && numTargetsInRange > 1 && strikeGroup.targetsFirstAirOp.includes("IJN-DMCV")) {
        const locationIJNDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
        await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, locationIJNDMCV, setStrikeGroupUpdate, test)
        ijndmcvTargeted = true
        return
      }
      if (strikeGroup.targetsFirstAirOp.includes("1AF")) {
        const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
        await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, location1AF, setStrikeGroupUpdate, test)
        return
      }
      if (strikeGroup.targetsFirstAirOp.includes("MIF")) {
        const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
        await moveStrikeGroup(controller, strikeGroup, HexCommand.OFFBOARD, locationMIF, setStrikeGroupUpdate, test)
        return
      }

      // TODO no targets -> I think we just set attacked to true
    }
  }
}

export async function generateUSAirOperationsMovesMidway(controller, stateObject, test) {
  // TODO
  // Whether to form Midway strike should be random at first

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
  const { distanceBetweenMidwayandIJNDMCV, distanceBetweenMidwayandMIF, distanceBetweenMidwayand1AF } =
    getFleetDistances(controller)

  const minDistanceToEnemyFleet = Math.min(
    distanceBetweenMidwayand1AF,
    distanceBetweenMidwayandMIF,
    distanceBetweenMidwayandIJNDMCV
  )
  if (minDistanceToEnemyFleet > 5) {
    return
  }

  // get all attack aircraft
  let usAirUnitsOnFlightDecks = controller.getAllUnitsOnMidwayRunways()

  // Set Up Strike Groups first

  for (let unit of usAirUnitsOnFlightDecks) {
    if (!unit.carrier.includes("Midway")) {
      continue
    }
    setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.US)

    const destinations = controller.getValidAirUnitDestinations(unit.name)
    const unitsOnCarrierFlighftDeck = controller.getAllUnitsOnUSFlightDeckofNamedCarrier("Midway")

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

    if (unit.aircraftUnit.attack && minDistanceToEnemyFleet > unit.aircraftUnit.movement + 2) {
      // OUT OF RANGE
      continue
    }

    if (unit.aircraftUnit.attack) {
      const strikeBox = destinations.find((box) => box.includes("STRIKE"))
      await moveAirUnitToStrikeGroup({
        controller,
        unit,
        setTestUpdate,
        test,
        strikeBox,
      })
    }

    // get all fighter aircraft
    usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(true)

    for (let unit of usAirUnitsOnFlightDecks) {
      if (!unit.carrier.includes("Midway")) {
        continue
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
  }

  // 6. Move Unit from Flight Deck to CAP Boxes
  // 7a. Get all air units in Hangar

  let unitsInHangar = controller.getAllUnitsInUSHangars()

  // i) fighters
  let fighters = unitsInHangar.filter((unit) => unit.aircraftUnit.attack === false)
  for (let unit of fighters) {
    if (!unit.carrier.includes("Midway")) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // ii) SBDs
  let diveBombers = unitsInHangar.filter((unit) => unit.aircraftUnit.diveBomber === true)
  for (let unit of diveBombers) {
    if (!unit.carrier.includes("Midway")) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // ii) TBDs
  let torpedoBombers = unitsInHangar.filter(
    (unit) => unit.aircraftUnit.diveBomber === false && unit.aircraftUnit.attack === true
  )
  for (let unit of torpedoBombers) {
    if (!unit.carrier.includes("Midway")) {
      continue
    }
    await hangarToFlightDeck({ controller, unit, setTestUpdate, test })
  }

  // 8a. Get all air units in Return Boxes
  // 8b. Get valid destinations for units in Return Boxes
  // 8c. Move Units in Return Boxes to next Return Box or Hangar
}
