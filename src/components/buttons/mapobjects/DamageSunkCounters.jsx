import React, { useContext } from "react"
import "../../board.css"
import { BoardContext } from "../../../App"
import DamageSunkCounter from "./DamageSunkCounter"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalGameState from "../../../model/GlobalGameState"

function DamageSunkCounters({ counterData }) {
  const { damageMarkerUpdate } = useContext(BoardContext)

  const counters = Array.from(counterData.values())

  let markers = GlobalUnitsModel.damageMarkers

  markers = markers.concat(GlobalUnitsModel.sunkMarkers)

  // @TODO QUack PUT THIS BACK
  // if (GlobalGameState.sideWithInitiative !== damageMarkerUpdate.side) {
  //   return
  // }
  if (damageMarkerUpdate.name !== "") {
    console.log("damage marker update =", damageMarkerUpdate)
  }
  const damageSunkCounters = markers.map((marker) => {
    return <DamageSunkCounter counterData={marker} markerUpdate={damageMarkerUpdate}></DamageSunkCounter>
  })

  return <>{damageSunkCounters}</>
}

export default DamageSunkCounters
