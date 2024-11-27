import React, { useContext } from "react"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App"
import JapanReorganizationBoxOffsets from "./JapanReorganizationBoxOffsets"
import Reorgaziza from "../buttons/Reorgaziza"
import GlobalInit from "../../model/GlobalInit"

function JapanReorganizationDropZones() {
  const { enabledJapanReorgBoxes, reorgAirUnits, setEnabledJapanReorgBoxes, setEnabledUSReorgBoxes } =
    useContext(BoardContext)

  if (!enabledJapanReorgBoxes) {
    return []
  }

  const japanZones = (
    <Reorgaziza
      controller={GlobalInit.controller}
      key={0}
      name="US Fleet Box"
      zones={JapanReorganizationBoxOffsets}
      enabled={true}
      reorgUnits={reorgAirUnits}
      setEnabledUSReorgBoxes={setEnabledUSReorgBoxes}
      setEnabledJapanReorgBoxes={setEnabledJapanReorgBoxes}
      side={GlobalUnitsModel.Side.JAPAN}
      dc="drag-drop-zone-fleet zone-reorg bg-japan-reorg"
    ></Reorgaziza>
  )
  return <>{japanZones}</>
}

export default JapanReorganizationDropZones
