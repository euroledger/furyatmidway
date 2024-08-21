export default function setStrikeGroupPopup(side, show, hex) {
    if (show === false || hex === undefined) {
      setShowPopup(false)
      return
    }
    const hexy = hex
    setHex(() => hex)
    setSide(() => side)
    const groups = controller.getAllStrikeGroupsInLocation(hexy, side)
    setstrikeGroupsAtLocation(() => groups)

    const fleets = controller.getAllFleetsInLocation(hexy, side)
    setFleetsAtLocation(() => fleets)
    console.log("FLEETS =", fleets)

    if (groups.length > 0 || fleets.length > 0) {
      setShowPopup(true)
      setPopUpPosition(() => hexy.currentHex)
    } else {
      setShowPopup(false)
    }

    setCurrentMouseHex({})
  }