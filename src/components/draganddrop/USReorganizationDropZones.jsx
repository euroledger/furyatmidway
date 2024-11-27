import React, { useContext } from "react"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App"
import USReorganizationBoxOffsets from "./USReorganizationBoxOffsets"
import Reorgaziza from "../buttons/Reorgaziza"
import GlobalInit from "../../model/GlobalInit"

function USReorganizationDropZones() {
  const { enabledUSReorgBoxes, reorgAirUnits, setEnabledJapanReorgBoxes, setEnabledUSReorgBoxes } =
    useContext(BoardContext)
  if (!enabledUSReorgBoxes) {
    return
  }

  const usZones = (
    <Reorgaziza
      controller={GlobalInit.controller}
      key={0}
      name="US Fleet Box"
      zones={USReorganizationBoxOffsets}
      enabled={true}
      setEnabledUSReorgBoxes={setEnabledUSReorgBoxes}
      setEnabledJapanReorgBoxes={setEnabledJapanReorgBoxes}
      reorgUnits={reorgAirUnits}
      side={GlobalUnitsModel.Side.US}
      dc="drag-drop-zone-fleet zone-reorg bg-us-reorg"
    ></Reorgaziza>
  )
  return <>{usZones}</>
}

export default USReorganizationDropZones
