import React, { useContext } from "react"
import "../../board.css"
import { BoardContext } from "../../../App"
import DamageSunkCounter from "./DamageSunkCounter"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

function DamageSunkCounters({ counterData }) {
  
  const { damageMarkerUpdate } = useContext(BoardContext)

  let markers = GlobalUnitsModel.damageMarkers

  markers = markers.concat(GlobalUnitsModel.sunkMarkers)


  const damageSunkCounters = markers.map((marker) => {
    return <DamageSunkCounter counterData={marker} markerUpdate={damageMarkerUpdate}></DamageSunkCounter>
  })

  return <>{damageSunkCounters}</>
}

export default DamageSunkCounters
