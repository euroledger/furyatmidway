// this should be a state (box) flow model

import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import Controller from "./Controller"
import USAirBoxOffsets from "../components/draganddrop/USAirBoxOffsets"
import JapanAirBoxOffsets from "../components/draganddrop/JapanAirBoxOffsets"
import { moveAirUnitToEliminatedBox } from "../DiceHandler"
import { distanceBetweenHexes } from "../components/HexUtils"
import { japanStrikeGroups, usStrikeGroups } from "../CounterLoader"

function getValidUSDestinationsRETURN1(controller, name, parentCarrier, side, useMidway) {
  // Returning US Strike Aircraft can return to either TF's carriers or Midway if within 2 hexes of CSF
  let destinationsArray = new Array()

  const { boxName } = controller.getAirUnitLocation(name)
  const tf = controller.getTaskForceForAirBox(boxName)

  const carriersInTF = controller.getAllCarriersInTaskForce(tf, side)

  for (const carrier of carriersInTF) {
    if (!controller.isSunk(carrier.name) && controller.isHangarAvailable(carrier.name)) {
      // this unit can go to its parent carrier hangar
      const box = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
      destinationsArray.push(box)
    }
  }
  if (destinationsArray.length === 0 && tf !== GlobalUnitsModel.TaskForce.MIDWAY) {
    destinationsArray = tryOtherTaskForce(controller, parentCarrier, side, useMidway)
  }

  return destinationsArray
}

function getValidJapanDestinationsRETURN1OtherTF(controller, name, side) {
  let destinationsArray = new Array()

  const { boxName } = controller.getAirUnitLocation(name)
  const tf = controller.getTaskForceForAirBox(boxName)

  const carriersInTF = controller.getAllCarriersInTaskForce(tf, side)

  for (const carrier of carriersInTF) {
    if (!controller.isSunk(carrier.name) && controller.isHangarAvailable(carrier.name)) {
      // this unit can go to its parent carrier hangar
      const box = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
      destinationsArray.push(box)
    }
  }
  return destinationsArray
}
export function getValidUSDestinationsCAP(controller, parentCarrier, side) {
  // This is returning CAP, must always go to same TF
  // and we check flight deck not hangar
  let destinationsArray = new Array()
  const thisTF = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInTF = controller.getAllCarriersInTaskForce(thisTF, side)

  for (const carrier of carriersInTF) {
    const boxName = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

    const destAvailable = controller.isFlightDeckAvailable(carrier.name, side)
    if (!controller.isSunk(carrier.name) && destAvailable) {
      // this unit can go to its parent carrier flight deck
      destinationsArray.push(boxName)
    } else if (controller.isSunk(carrier.name)) {
      continue
    }
    // As this is CAP -> can go to hangar instead
    // if carrier not at capacity
    if (controller.isHangarAvailable(carrier.name)) {
      const capHangar = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")
      destinationsArray.push(capHangar)
    }
  }
  // Never try other task force
  return destinationsArray
}

function getValidJapanDestinationsRETURN1(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  if (controller.isSunk(parentCarrier)) {
    // console.log(parentCarrier, "sunk, try other carrier")
    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
  } else if (controller.isHangarAvailable(parentCarrier)) {
    // console.log(parentCarrier, " => Hangar avaiable")

    const box = controller.getAirBoxForNamedShip(side, parentCarrier, "HANGAR")
    destinationsArray.push(box)
  } else {
    // console.log(parentCarrier, "=> Hangar NOT avaiable")

    destinationsArray = tryOtherCarrier(controller, parentCarrier, side)
    if (destinationsArray.length === 0) {
      destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
    }
  }
  return destinationsArray
}

export function getValidJapanDestinationsCAP(controller, parentCarrier, side) {
  let destinationsArray = new Array()

  const boxName = controller.getAirBoxForNamedShip(side, parentCarrier, "FLIGHT_DECK")
  const destAvailable = controller.isFlightDeckAvailable(parentCarrier, side)

  if (!controller.isSunk(parentCarrier) && destAvailable) {
    destinationsArray.push(boxName)
  }
  if (controller.getCarrierHits(parentCarrier) < 2 && controller.isHangarAvailable(parentCarrier)) {
    const capHangar = controller.getAirBoxForNamedShip(side, parentCarrier, "HANGAR")
    destinationsArray.push(capHangar)
    return destinationsArray
  }
  destinationsArray = destinationsArray.concat(tryOtherCarrierCAP(controller, parentCarrier, side))
  return destinationsArray
}

function tryOtherTaskForce(controller, parentCarrier, side, useMidway) {
  let destinationsArray = new Array()
  const taskForce = controller.getTaskForceForCarrier(parentCarrier, side)
  const carriersInOtherTaskForce = controller.getCarriersInOtherTF(taskForce, side)
  if (useMidway && !controller.isMidwayBaseDestroyed()) {
    // add Midway base to carriers
    carriersInOtherTaskForce.push(GlobalUnitsModel.usFleetUnits.get(GlobalUnitsModel.Carrier.MIDWAY))
  }
  for (const carrier of carriersInOtherTaskForce) {
    // console.log("----------> try", carrier.name)
    if (!controller.isSunk(carrier.name)) {
      if (controller.isHangarAvailable(carrier.name)) {
        const box = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

        destinationsArray.push(box)
      }
      // else {
      //   console.log("NO room on carrier", carrier.name)
      // }
    }
  }
  return destinationsArray
}
function tryOtherCarrier(controller, parentCarrier, side, cap) {
  let destinationsArray = new Array()
  const otherCarrier = controller.getOtherCarrierInTF(parentCarrier, side)
  if (!otherCarrier) {
    return destinationsArray // empty list, eg TF 17 has no other carrier
  }
  const destAvailable = !cap
    ? controller.isHangarAvailable(otherCarrier.name)
    : controller.isFlightDeckDamaged(otherCarrier.name)

  if (controller.isSunk(otherCarrier.name)) {
    // otherwise...try carriers in other task force
    // if no options -> unit is eliminated
    // console.log(otherCarrier.name,"sunk, try other task force")
    destinationsArray = tryOtherTaskForce(controller, parentCarrier, side)
  } else if (destAvailable) {
    const boxName = !cap ? "HANGAR" : "FLIGHT_DECK"
    const box = controller.getAirBoxForNamedShip(side, otherCarrier.name, boxName)
    destinationsArray.push(box)
  }
  return destinationsArray
}
function tryOtherCarrierCAP(controller, parentCarrier, side) {
  let destinationsArray = new Array()
  const otherCarrier = controller.getOtherCarrierInTF(parentCarrier, side)
  if (!otherCarrier) {
    return destinationsArray // empty list, eg TF 17 has no other carrier
  }

  if (controller.isSunk(otherCarrier.name)) {
    return destinationsArray
  }

  const destAvailable = controller.isFlightDeckAvailable(otherCarrier.name, side)
  if (destAvailable) {
    const box = controller.getAirBoxForNamedShip(side, otherCarrier.name, "FLIGHT_DECK")
    destinationsArray.push(box)
  }
  if (controller.isHangarAvailable(otherCarrier.name)) {
    const capHangar = controller.getAirBoxForNamedShip(side, otherCarrier.name, "HANGAR")
    destinationsArray.push(capHangar)
  }
  return destinationsArray
}
export function doReturn1(controller, name, side, useMidway) {
  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinationsRETURN1(controller, name, parentCarrier, side, useMidway)
  } else {
    const { boxName } = controller.getAirUnitLocation(name)
    const tf = controller.getTaskForceForAirBox(boxName)
    const parentTF = controller.getTaskForceForCarrier(parentCarrier, side)

    if (tf === parentTF) {
      destinationsArray = getValidJapanDestinationsRETURN1(controller, parentCarrier, side)
    } else {
      destinationsArray = getValidJapanDestinationsRETURN1OtherTF(controller, name, side)
    }
  }
  controller.setValidAirUnitDestinations(name, destinationsArray)

  if (destinationsArray.length === 0) {
    // no available carrier - unit elimintated
    controller.setAirUnitEliminated(name, side)
  }
  return destinationsArray
}

export function doReturn2(controller, name, side) {
  // Unit can only move to return1 box (of same TF return2 box in which it currently resides)
  const { boxName } = controller.getAirUnitLocation(name)
  const tf = controller.getTaskForceForAirBox(boxName)
  const destBox = controller.getReturn1AirBoxForNamedTaskForce(side, tf)

  const boxArray = new Array()
  if (destBox) {
    boxArray.push(destBox)
    controller.setValidAirUnitDestinations(name, boxArray)
  }
}

export function doStrikeBoxJapan(controller, name, strikeGroup, side) {
  // For now
  // Once a unit has moved into the strike box
  // disallow further moves
  controller.setValidAirUnitDestinations(name, new Array())

  // Once strike has finished, set possible return boxes as destinations
  // some tests do not have strike groups set up, no need for this function

  const unit = controller.getAirUnitForName(name)
  const tf = controller.getTaskForceForCarrier(unit.carrier, side)

  // console.log(
  //   "SG:",
  //   strikeGroup.name,
  //   "strikeGroup.airOpMoved=",
  //   strikeGroup.airOpMoved,
  //   "strikeGroup.airOpAttacked=",
  //   strikeGroup.airOpAttacked
  // )
  // Japanese Units must go to return box of parent carrier unless it is damaged
  const parentCarrier = controller.getCarrierForAirUnit(name)
  const hits = controller.getCarrierHits(parentCarrier)

  let destArray = new Array()
  if (strikeGroup.airOpAttacked && strikeGroup.airOpMoved === strikeGroup.airOpAttacked) {
    // GOTO RETURN 1 BOX
    const return1Box = controller.getReturn1AirBoxForNamedTaskForce(side, tf)
    destArray.push(return1Box)

    if (hits !== 0) {
      // parent carrier damaged - allow other TF as well
      const otherTF = controller.getOtherTaskForce(tf, side)
      const carriersInOtherTaskForce = controller.getCarriersInOtherTF(otherTF, side)
      for (let carrier of carriersInOtherTaskForce) {
        if (!controller.isSunk(carrier.name) && carrier.hits < 2) {
          const return1BoxOtherTF = controller.getReturn1AirBoxForNamedTaskForce(side, otherTF)
          destArray.push(return1BoxOtherTF)
          break
        }
      }
    }
  } else if (strikeGroup.attacked && strikeGroup.airOpMoved !== strikeGroup.airOpAttacked) {
    // GOTO RETURN 2 BOX
    const return2Box = controller.getReturn2AirBoxForNamedTaskForce(side, tf)
    destArray.push(return2Box)

    if (hits !== 0) {
      // parent carrier damaged - allow other TF as well
      const otherTF = controller.getOtherTaskForce(tf, side)
      const carriersInOtherTaskForce = controller.getCarriersInOtherTF(otherTF, side)
      for (let carrier of carriersInOtherTaskForce) {
        if (!controller.isSunk(carrier.name) && carrier.hits < 2) {
          const return2BoxOtherTF = controller.getReturn2AirBoxForNamedTaskForce(side, otherTF)
          destArray.push(return2BoxOtherTF)
          break
        }
      }
    }
  }
  controller.setValidAirUnitDestinations(name, destArray)
}

export function doStrikeBoxUS(controller, name, side) {
  controller.setValidAirUnitDestinations(name, new Array())

  const location = controller.getAirUnitLocation(name)

  const strikeGroup = controller.getStrikeGroupForBox(side, location.boxName)

  const unit = controller.getAirUnitForName(name)
  const tf = controller.getTaskForceForCarrier(unit.carrier)

  let destArray = new Array()
  // console.log(
  //   "SG:",
  //   strikeGroup.name,
  //   "strikeGroup.airOpMoved=",
  //   strikeGroup.airOpMoved,
  //   "strikeGroup.airOpAttacked=",
  //   strikeGroup.airOpAttacked
  // )


  if (strikeGroup.airOpAttacked && strikeGroup.airOpMoved === strikeGroup.airOpAttacked) {
    // GOTO RETURN 1 BOX of either TF (or Midway if in range)
    const return1Box = controller.getReturn1AirBoxForNamedTaskForce(side, tf)
    destArray.push(return1Box)
    const otherTF = controller.getOtherTaskForce(tf, side)
    const carriersInOtherTaskForce = controller.getCarriersInOtherTF(otherTF, side)
    for (let carrier of carriersInOtherTaskForce) {
      if (carrier.hits < 2) {
        const return1BoxOtherTF = controller.getReturn1AirBoxForNamedTaskForce(side, otherTF)
        destArray.push(return1BoxOtherTF)
        break
      }
    }

    // check Midway in range - attack hex within 5 hexes of Midway
    const locationOfStrikeGroup = controller.getStrikeGroupLocation(strikeGroup.name, side)

    if (
      distanceBetweenHexes(locationOfStrikeGroup.currentHex, Controller.MIDWAY_HEX.currentHex) <= 5 &&
      !controller.isMidwayBaseDestroyed()
    ) {
      const midwayTF = GlobalUnitsModel.TaskForce.MIDWAY
      const return1BoxMidway = controller.getReturn1AirBoxForNamedTaskForce(side, midwayTF)
      destArray.push(return1BoxMidway)
    }
  } else if (strikeGroup.attacked && strikeGroup.airOpMoved !== strikeGroup.airOpAttacked) {
    // GOTO RETURN 2 BOX\
    const return2Box = controller.getReturn2AirBoxForNamedTaskForce(side, tf)

    destArray.push(return2Box)
    // Do not allow other TF return boxes for Midway aircraft
    if (tf !== GlobalUnitsModel.TaskForce.MIDWAY) {
      const otherTF = controller.getOtherTaskForce(tf, side)
      const carriersInOtherTaskForce = controller.getCarriersInOtherTF(otherTF, side)
      for (let carrier of carriersInOtherTaskForce) {
        if (carrier.hits < 2) {
          const return2BoxOtherTF = controller.getReturn2AirBoxForNamedTaskForce(side, otherTF)
          destArray.push(return2BoxOtherTF)
          break
        }
      }
      const locationOfStrikeGroup = controller.getStrikeGroupLocation(strikeGroup.name, side)
      if (
        distanceBetweenHexes(locationOfStrikeGroup.currentHex, Controller.MIDWAY_HEX.currentHex) <= 5 &&
        !controller.isMidwayBaseDestroyed()
      ) {
        const midwayTF = GlobalUnitsModel.TaskForce.MIDWAY
        const return2BoxMidway = controller.getReturn2AirBoxForNamedTaskForce(side, midwayTF)
        destArray.push(return2BoxMidway)
      }
    }
  }
  controller.setValidAirUnitDestinations(name, destArray)
}
export function doFlightDeck(controller, name, side) {
  // Air Units on the Flight Deck can go to
  const location = controller.getAirUnitLocation(name)
  const carrierName = controller.getCarrierForAirBox(location.boxName)

  let destinationsArray = new Array()

  const unit = controller.getAirUnitForName(name)

  //  i) CAP Box (if fighter)
  if (!unit.aircraftUnit.attack) {
    const capBox = controller.getCapBoxForNamedCarrier(carrierName, side)
    destinationsArray.push(capBox)
  }
  //  ii) Strike Box
  // Note For US air units, we will need to filter out any strike boxes
  // containing air units from other carriers
  const strikeBoxes = controller.getStrikeBoxes(name, side)
  destinationsArray = destinationsArray.concat(strikeBoxes)

  //  iii) Hangar
  const hangarBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")
  destinationsArray.push(hangarBox)

  controller.setValidAirUnitDestinations(name, destinationsArray)
}

export function doHangar(controller, name, side) {
  const location = controller.getAirUnitLocation(name)
  const carrierName = controller.getCarrierForAirBox(location.boxName)
  controller.setValidAirUnitDestinations(name, new Array())

  // const parentCarrier = controller.getCarrierForAirUnit(name)
  const destBox = controller.getAirBoxForNamedShip(side, carrierName, "FLIGHT_DECK")

  // check there is room on this carrier's flight deck
  const destAvailable = controller.isFlightDeckAvailable(carrierName, side)

  if (!destAvailable) {
    return
  }
  const boxArray = new Array()
  if (destBox) {
    boxArray.push(destBox)
    controller.setValidAirUnitDestinations(name, boxArray)
  }
}

export function doCapReturn(controller, name, side) {
  // determine parent carrier and if flight deck of that carrier is damaged
  // and carrier is not at capacity
  const parentCarrier = controller.getCarrierForAirUnit(name)
  let destinationsArray = new Array()
  if (side === GlobalUnitsModel.Side.US) {
    destinationsArray = getValidUSDestinationsCAP(controller, parentCarrier, side)
  } else {
    destinationsArray = getValidJapanDestinationsCAP(controller, parentCarrier, side)
  }
  controller.setValidAirUnitDestinations(name, destinationsArray)

  if (destinationsArray.length === 0) {
    // no available carrier - unit elimintated
    controller.setAirUnitEliminated(name, side)
  }
  return destinationsArray
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// function createStrikeGroupUpdate(sg) {
//   const usSGPositions = [
//     {
//       left: "95%",
//       top: "63%",
//     },
//     {
//       left: "95%",
//       top: "67.5%",
//     },
//     {
//       left: "95%",
//       top: "72.0%",
//     },
//     {
//       left: "95%",
//       top: "76.5%",
//     },
//     {
//       left: "95%",
//       top: "81.0%",
//     },
//     {
//       left: "95%",
//       top: "85.5%",
//     },
//     {
//       left: "95%",
//       top: "89.5%",
//     },
//   ]
//   console.log("SG INITIAL POSITION=", sg.initialPosition)

//   const str = sg.name
//   let res = str.charAt(str.length - 1);
// console.log("LAST CHAR=", res)

//   let index = Number(res)
//   let update = {
//     name: sg.name,
//     position: usSGPositions[index - 1],
//     moved: false,
//     attacked: false,
//     initial: true
//   }
//   return update
// }
export async function resetStrikeGroups(controller, side, setStrikeGroupUpdate) {
  // console.log("RESET STRIKE GROUPS...")
  let positions, groups
  if (side === GlobalUnitsModel.Side.JAPAN) {
    positions = japanStrikeGroups.map(({ position }) => position)
    groups = GlobalUnitsModel.jpStrikeGroups
  } else {
    positions = usStrikeGroups.map(({ position }) => position)
    groups = GlobalUnitsModel.usStrikeGroups
  }

  // console.log(">>>>>>>>>> GROUPS=", groups)
  let index = 0
  for (let strikeGroup of groups.values()) {
    if (!strikeGroup.attacked) {
      index++
      continue
    }
    // console.log("SG", strikeGroup.name, "-> RESET!")
    strikeGroup.airOpAttacked = undefined
    strikeGroup.airOpMoved = undefined
    strikeGroup.moved = false
    strikeGroup.attacked = false
    strikeGroup.position = strikeGroup.initialPosition
    strikeGroup.location = GlobalUnitsModel.AirBox.OFFBOARD

    // console.log("strikeGroup=", strikeGroup)

    controller.setStrikeGroupLocation(strikeGroup.name, GlobalUnitsModel.AirBox.OFFBOARD, side)
    controller.removeStrikeGroupFromLocation(strikeGroup.name, side)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, strikeGroup)
    index++
  }
}

export async function moveAirUnitToReturnBox(controller, strikeGroup, unit, side, setAirUnitUpdate) {
  const tf = controller.getTaskForceForCarrier(unit.carrier, side)

  let toBox
  if (strikeGroup.airOpAttacked && strikeGroup.airOpMoved === strikeGroup.airOpAttacked) {
    // GOTO RETURN 1 BOX
    toBox = controller.getReturn1AirBoxForNamedTaskForce(side, tf)
  } else {
    // GOTO RETURN 2 BOX
    toBox = controller.getReturn2AirBoxForNamedTaskForce(side, tf)
  }

  let update = {}

  const index = controller.getFirstAvailableZone(toBox)
  let position1 = USAirBoxOffsets.find((box) => box.name === toBox)

  if (side === GlobalUnitsModel.Side.JAPAN) {
    position1 = JapanAirBoxOffsets.find((box) => box.name === toBox)
  }
  update.boxName = toBox
  update.position = position1.offsets[index]
  update.name = unit.name
  update.log = false // hack to prevent logging

  setAirUnitUpdate(update)
  controller.viewEventHandler({
    type: Controller.EventTypes.AIR_UNIT_MOVE,
    data: {
      name: toBox,
      counterData: unit,
      index,
      side: GlobalGameState.sideWithInitiative,
      loading: false,
    },
  })
}

export async function moveOrphanedCAPUnitsToEliminatedBox(side) {
  const capUnitsReturning = GlobalInit.controller.getAllCAPDefendersInCAPReturnBoxes(side)
  for (const unit of capUnitsReturning) {
    await delay(1)
    const parentCarrier = GlobalInit.controller.getCarrierForAirUnit(unit.name)

    let destinationsArray
    if (side === GlobalUnitsModel.Side.JAPAN) {
      destinationsArray = getValidJapanDestinationsCAP(GlobalInit.controller, parentCarrier, side)
    } else {
      destinationsArray = getValidUSDestinationsCAP(GlobalInit.controller, parentCarrier, side)
    }
    if (destinationsArray.length === 0) {
      GlobalGameState.orphanedAirUnits.push(unit)
      moveAirUnitToEliminatedBox(GlobalInit.controller, unit)
    }
  }
}

export async function setStrikeGroupAirUnitsToNotMoved(side) {
  const strikeGroups = GlobalInit.controller.getAllStrikeGroups(side)
  for (const group of strikeGroups) {
    if (!group.attacked) {
      continue
    }
    // @TODO remove Strike Group counter from map

    // .....................

    const unitsInGroup = GlobalInit.controller.getAirUnitsInStrikeGroups(group.box)
    for (const unit of unitsInGroup) {
      // allow new move from strike box to return box (manual)
      unit.aircraftUnit.moved = false
    }
  }
}
export async function moveCAPtoReturnBox(controller, capAirUnits, setAirUnitUpdate) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  for (const capUnit of capAirUnits) {
    await delay(1)

    const steps = capUnit.aircraftUnit.steps

    if (steps === 0) {
      continue
    }
    const location = controller.getAirUnitLocation(capUnit.name)
    let update = {}

    const parentCarrier = controller.getCarrierForAirUnit(capUnit.name)
    const tf = controller.getTaskForceForCarrier(parentCarrier, sideBeingAttacked)
    const destBox = controller.getCapReturnAirBoxForNamedTaskForce(sideBeingAttacked, tf)

    let position1 = USAirBoxOffsets.find((box) => box.name === destBox)

    if (GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US) {
      position1 = JapanAirBoxOffsets.find((box) => box.name === destBox)
    }
    update.boxName = location.boxName

    const index = GlobalInit.controller.getFirstAvailableZone(destBox)
    update.position = position1.offsets[location.boxIndex]
    update.name = capUnit.name
    update.log = false

    setAirUnitUpdate(update)

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: destBox,
        counterData: capUnit,
        index: index,
        side: sideBeingAttacked,
        loading: true,
      },
    })
  }
  await delay(10)

  setAirUnitUpdate({
    unit: {},
    position: {},
    boxName: "",
    index: -1,
  })
}

// CAP -> CAP RETURN occurs after CAP has intercepted a Strike Group
export function doCap(controller, name, side) {
  if (!GlobalGameState.airAttacksComplete) {
    const parentCarrier = controller.getCarrierForAirUnit(name)
    let destinationsArray = new Array()
    if (side === GlobalUnitsModel.Side.US) {
      destinationsArray = getValidUSDestinationsCAP(controller, parentCarrier, side)
    } else {
      destinationsArray = getValidJapanDestinationsCAP(controller, parentCarrier, side)
    }
    controller.setValidAirUnitDestinations(name, destinationsArray)
    return
  }
  const parentCarrier = controller.getCarrierForAirUnit(name)
  const tf = controller.getTaskForceForCarrier(parentCarrier, side)
  const destBox = controller.getCapReturnAirBoxForNamedTaskForce(side, tf)
  const boxArray = new Array()
  if (destBox) {
    boxArray.push(destBox)
    controller.setValidAirUnitDestinations(name, boxArray)
  }
}

export function getStep1Fighters(airUnits) {
  return airUnits.filter((unit) => unit.aircraftUnit.steps === 1 && unit.aircraftUnit.attack === false)
}

export function getStep1DiveBombers(airUnits) {
  return airUnits.filter(
    (unit) =>
      unit.aircraftUnit.steps === 1 && unit.aircraftUnit.attack === true && unit.aircraftUnit.diveBomber === true
  )
}

export function getStep1TorpedoPlanes(airUnits) {
  return airUnits.filter(
    (unit) =>
      unit.aircraftUnit.steps === 1 && unit.aircraftUnit.attack === true && unit.aircraftUnit.diveBomber === false
  )
}

function checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto) {
  if (step1Fighters.length >= 2) {
    if (!auto) {
      return step1Fighters
    } else {
      // Midway fighters and dive bombers have different strength ratings, always eliminate
      // unit with lower strength first
      if (step1Fighters[0].aircraftUnit.strength <= step1Fighters[1].aircraftUnit.strength) {
        step1Fighters[0].aircraftUnit.steps = 0 // elim first unit
        step1Fighters[1].aircraftUnit.steps = 2
      } else {
        step1Fighters[0].aircraftUnit.steps = 2
        step1Fighters[1].aircraftUnit.steps = 0
      }
    }
  } else if (step1DiveBombers.length >= 2) {
    if (!auto) {
      return step1DiveBombers
    } else {
      if (step1DiveBombers[0].aircraftUnit.strength <= step1DiveBombers[1].aircraftUnit.strength) {
        step1DiveBombers[0].aircraftUnit.steps = 0 // elim first unit
        step1DiveBombers[1].aircraftUnit.steps = 2
      } else {
        step1DiveBombers[0].aircraftUnit.steps = 2
        step1DiveBombers[1].aircraftUnit.steps = 0
      }
    }
  } else {
    if (!auto) {
      return step1TorpedoPlanes
    } else {
      if (step1TorpedoPlanes[0].aircraftUnit.strength <= step1TorpedoPlanes[1].aircraftUnit.strength) {
        step1TorpedoPlanes[0].aircraftUnit.steps = 0 // elim first unit
        step1TorpedoPlanes[1].aircraftUnit.steps = 2
      } else {
        step1TorpedoPlanes[0].aircraftUnit.steps = 2
        step1TorpedoPlanes[1].aircraftUnit.steps = 0
      }
    }
  }
  return null
}

function isMidwayBox(box) {
  return box.includes("MIDWAY".toUpperCase())
}
// toBox is the destination box, hangar for returning strike, flight deck for returning CAP
// auto - if true automatically reorganise, false return object with reorg possibilities (for UI)
export function checkForReorganization(controller, fromBox, toBox, auto) {
  // 1. For a given box get all the air units in this box
  const airUnits = controller.getAllAirUnitsInBox(fromBox)

  // 2. Check to see if there are any 1 step units of the same type
  let step1Fighters = getStep1Fighters(airUnits)
  let step1DiveBombers = getStep1DiveBombers(airUnits)
  let step1TorpedoPlanes = getStep1TorpedoPlanes(airUnits)

  // 3. if any type has 2 or more units - reorganise these units
  if (step1Fighters.length >= 2 || step1DiveBombers.length >= 2 || step1TorpedoPlanes.length >= 2) {
    return checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto)
  }

  // 4. check to see if a reorg can be done in the toBox, then across boxes
  // Can never reorganize across Midway -> Carrier (since this is never a landing option)
  // But carrier -> Midway is allowed
  if (!toBox || (isMidwayBox(fromBox) && !isMidwayBox(toBox))) {
    return null
  }

  const airUnitsToBox = controller.getAllAirUnitsInBox(toBox)

  let step1FightersToBox = getStep1Fighters(airUnitsToBox)

  let step1DiveBombersToBox = getStep1DiveBombers(airUnitsToBox)
  let step1TorpedoPlanesToBox = getStep1TorpedoPlanes(airUnitsToBox)

  if (step1FightersToBox.length >= 2 || step1DiveBombersToBox.length >= 2 || step1TorpedoPlanesToBox.length >= 2) {
    return checkPlanesInBox(step1FightersToBox, step1DiveBombersToBox, step1TorpedoPlanesToBox, auto)
  }

  // 5. If there are 2 or more units across the from and to boxes - reorganise across
  // the boxes, note always eliminate the unit in the to Box so that creates space
  // for incoming unit
  step1Fighters = step1FightersToBox.concat(step1Fighters)

  step1DiveBombers = step1DiveBombersToBox.concat(step1DiveBombers)
  step1TorpedoPlanes = step1TorpedoPlanesToBox.concat(step1TorpedoPlanes)
  if (step1Fighters.length >= 2 || step1DiveBombers.length >= 2 || step1TorpedoPlanes.length >= 2) {
    const ret = checkPlanesInBox(step1Fighters, step1DiveBombers, step1TorpedoPlanes, auto)
    return ret
  }
  return null
}

function mergeUnique(arr1, arr2) {
  if (arr1 === null) {
    return arr2
  }
  if (arr2 === null) {
    return arr1
  }
  let newArray = arr1

  for (let item of arr2) {
    if (!newArray.includes(item)) {
      newArray.push(item)
    }
  }
  return newArray
}

export function checkAllJapanBoxesForReorganizationCAP(controller, unit, fromBox, side, auto) {
  let carrierName = unit.carrier
  let toBox = controller.getAirBoxForNamedShip(side, carrierName, "FLIGHT_DECK")

  let reorgUnits = new Array()

  // check reorg within CAP RETURN box
  let reorgUnitsCAP = checkForReorganization(controller, fromBox, null, auto)

  if (reorgUnitsCAP) {
    reorgUnits = reorgUnitsCAP
  }

  const hits = controller.getCarrierHits(carrierName)
  // check reorg across boxes
  // 1. Same Carrier Flight Deck
  let reorgUnitsFD = checkForReorganization(controller, fromBox, toBox, auto)
  if (reorgUnitsFD) {
    reorgUnits = mergeUnique(reorgUnits, reorgUnitsFD)
  }

  // 2. Same Carrier Hangar
  toBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")
  let reorgUnitsHangar = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnitsHangar) {
    reorgUnits = mergeUnique(reorgUnits, reorgUnitsHangar)
  }

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (hits < 2) {
        return // Japan air unit must use its own carrier if possible (ie undamaged)
      }
    }
  }
  // 3. Other Carrier in Same Task Force Flight Deck
  let carrier = controller.getOtherCarrierInTF(carrierName, side)
  if (!carrier) {
    return
  }
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

  let reorgUnitsOtherFD = checkForReorganization(controller, fromBox, toBox, auto)
  if (reorgUnitsOtherFD) {
    reorgUnits = mergeUnique(reorgUnits, reorgUnitsOtherFD)
  }
  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
  }

  // 4. Other Carrier in Same Task Force Hangar
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

  let reorgUnits3 = checkForReorganization(controller, fromBox, toBox, auto)
  reorgUnits = mergeUnique(reorgUnits, reorgUnits3)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
  }
  return null
}

export function checkAllUSBoxesForReorganizationCAP(controller, unit, fromBox, side, auto) {
  let carrierName = unit.carrier

  // check reorg within CAP RETURN box
  let reorgUnits = checkForReorganization(controller, fromBox, null, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return
  }

  // 1. Same + Other Carrier Flight Deck

  const thisTF = controller.getTaskForceForCarrier(carrierName, side)
  const carriersInTF = controller.getAllCarriersInTaskForce(thisTF, side)

  let reorgUnitsArray = new Array()

  for (const carrier of carriersInTF) {
    const toBox = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

    reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)
    if (reorgUnits) {
      reorgUnitsArray = mergeUnique(reorgUnitsArray, reorgUnits)
    }
  }
  if (reorgUnitsArray.length > 0) {
    controller.setReorganizationUnits(unit.name, reorgUnitsArray)
    return
  }
  // 2. Same + Other Carrier Hangar
  for (const carrier of carriersInTF) {
    const toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

    reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)
    if (reorgUnits) {
      reorgUnitsArray = mergeUnique(reorgUnitsArray, reorgUnits)
    }
  }
  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return
  }
  return null
}

export function checkAllBoxesForReorganization(controller, unit, fromBox, side, auto) {
  let carrierName = unit.carrier
  let toBox = controller.getAirBoxForNamedShip(side, carrierName, "HANGAR")

  // check reorg within box
  let reorgUnits = checkForReorganization(controller, fromBox, null, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    return
  }
  // check reorg across boxes
  // 1. Same Carrier
  reorgUnits = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits) {
    controller.setReorganizationUnits(unit.name, reorgUnits)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      return // Japan air unit must use its own carrier if possible
    }
  }
  // 2. Other Carrier in Same Task Force
  let carrier = controller.getOtherCarrierInTF(carrierName, side)
  if (!carrier) {
    return
  }
  toBox = controller.getAirBoxForNamedShip(side, carrier.name, "HANGAR")

  let reorgUnits2 = checkForReorganization(controller, fromBox, toBox, auto)

  if (reorgUnits2) {
    if (reorgUnits1) {
      reorgUnits2 = mergeUnique(reorgUnits1, reorgUnits2)
    }
    controller.setReorganizationUnits(unit.name, reorgUnits2)
    return
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
  return
}

export function setValidDestinationBoxes(controller, airUnitName, side) {
  controller.setValidAirUnitDestinations(airUnitName, new Array()) // just to be sure last entries are gone

  const location = controller.getAirUnitLocation(airUnitName)
  if (location.boxName.includes("RETURNING (1)")) {
    // see if US CSF within two hexes of Midway
    let hexesBetweenMidwayAndCSF = controller.numHexesBetweenFleets(
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )

    // This is not correct, the test should be if strike hex is within 5 of Midway
    // @TODO fix this!
    const useMidway = hexesBetweenMidwayAndCSF <= 2 && side === GlobalUnitsModel.Side.US
    const destinations = doReturn1(controller, airUnitName, side, useMidway)
    if (destinations.length === 0) {
      // check for possible reorganisation
      const unit = GlobalInit.counters.get(airUnitName)
      checkAllBoxesForReorganization(controller, unit, location.boxName, side, false)
    }
  }
  if (location.boxName.includes("RETURNING (2)")) {
    doReturn2(controller, airUnitName, side)
  }
  if (location.boxName.includes("CAP RETURNING")) {
    let hexesBetweenMidwayAndCSF = controller.numHexesBetweenFleets(
      { name: "MIDWAY", side: GlobalUnitsModel.Side.US },
      { name: "CSF", side: GlobalUnitsModel.Side.US }
    )
    const useMidway = hexesBetweenMidwayAndCSF <= 2 && side === GlobalUnitsModel.Side.US
    const destinations = doCapReturn(controller, airUnitName, side, useMidway)
    if (destinations.length === 0) {
      // check for possible reorganisation
      const unit = GlobalInit.counters.get(airUnitName)

      if (side === GlobalUnitsModel.Side.JAPAN) {
        checkAllJapanBoxesForReorganizationCAP(controller, unit, location.boxName, side, false)
      } else {
        checkAllUSBoxesForReorganizationCAP(controller, unit, location.boxName, side, false)
      }
    }
  }
  if (location.boxName.includes("CAP") && !location.boxName.includes("RETURNING")) {
    doCap(controller, airUnitName, side)
  }
  if (location.boxName.includes("HANGAR")) {
    doHangar(controller, airUnitName, side)
  }

  if (location.boxName.includes("FLIGHT")) {
    doFlightDeck(controller, airUnitName, side)
  }

  if (location.boxName.includes("STRIKE")) {
    // get strike group based on location
    if (side === GlobalUnitsModel.Side.JAPAN) {
      const strikeGroup = controller.getStrikeGroupForBox(GlobalUnitsModel.Side.JAPAN, location.boxName)
      doStrikeBoxJapan(controller, airUnitName, strikeGroup, side)
    } else {
      const strikeGroup = controller.getStrikeGroupForBox(GlobalUnitsModel.Side.US, location.boxName)
      doStrikeBoxUS(controller, airUnitName, side)
    }
  }
}
// This function determines which Air Boxes are valid moves for a given air unit in
// a given location, allowing for possible reorganization of step 1 units
export function handleAirUnitMoves(controller, side) {
  // 1. loop through all air units for this side
  const airUnits = controller.getAllAirUnits(side)

  // 2. for each air unit get the location

  // 3. use the following logic to work out what that unit can do
  for (let unit of airUnits) {
    if (!unit.moved) {
      setValidDestinationBoxes(controller, unit.name, side)
    }
  }
}
