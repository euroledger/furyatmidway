import React from "react"
import "./main.scss"
import {
  convertCoords,
  hexOrigin,
  hexSize,
  flatHexToPixel,
  areCoordinatesOnMap,
} from "./HexUtils"

const POINTY = 0
const FLAT = 1

const hexType = FLAT


export default class CanvasHex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hexSize: hexSize,
      scale: props.scale,
      side: props.side,
      usRegions: props.usRegions,
      jpRegions: props.jpRegions,
      jpMIFRegions: props.jpMIFRegions
    }
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }
  UNSAFE_componentWillMount() {
    this.hexParameters = hexType === POINTY ? this.getPointyHexParameters() : this.getFlatHexParameters()

    this.setState({
      canvasSize: { canvasWidth: 460, canvasHeight: 385 },
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      usRegions: nextProps.usRegions,
      jpRegions: nextProps.jpRegions,
      jpMIFRegions: nextProps.jpMIFRegions
    })
    this.clearCanvas(nextProps.usRegions, nextProps.jpRegions, nextProps.jpMIFRegions)
  }
  componentDidMount() {
    this.setState({
      canvasPosition: { left: 0, right: 0, top: 0, bottom: 0 },
    })
    const { canvasWidth, canvasHeight } = this.state.canvasSize
    this.canvasHex.width = canvasWidth
    this.canvasHex.height = canvasHeight
    this.canvasCoordinates.width = canvasWidth
    this.canvasCoordinates.height = canvasHeight
    this.getCanvasPosition(this.canvasCoordinates)
    if (hexType === POINTY) {
      this.drawPointyHexes()
    } else {
      this.drawFlatHexes()
    }
  }

  clearCanvas(usRegions, jpRegions, jpMIFRegions) {
    const { canvasWidth, canvasHeight } = this.state.canvasSize
    const ctx = this.canvasCoordinates.getContext("2d")
    ctx.clearRect(0, 0, canvasWidth, canvasHeight) // clears the canvas
    if (usRegions || (this.state.usRegions && this.state.usRegions.length > 0)) {
      const regs = usRegions ? usRegions : this.state.usRegions
      this.drawRegions("us", regs, "rgba(102, 178,255, 0.4)")
      this.forceUpdate()
    } 
    if (jpRegions || (this.state.jpRegions && this.state.jpRegions.length > 0)) {
      const regs = jpRegions ? jpRegions : this.state.jpRegions
      this.drawRegions("japan", regs, "rgba(223, 71,71, 0.6)")
      this.forceUpdate()
    } 
    if (jpMIFRegions || (this.state.jpMIFRegions && this.state.jpMIFRegions.length > 0)) {
      const regs = jpMIFRegions ? jpMIFRegions : this.state.jpMIFRegions
      this.drawRegions("japan", regs, "rgba(255, 255, 255, 0.4)")
      this.forceUpdate()
    } 
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.clearCanvas()

    if (nextState.currentHex !== this.state.currentHex) {
      const { q, r, x, y } = nextState.currentHex
      let colors = { us: "rgba(0, 0, 255, 0.6)", japan: "rgba(255, 0, 0, 0.6)" }

      if (hexType === POINTY) {
        this.drawPointyHex(this.canvasCoordinates, { x, y }, "lime", 3)
      } else {
        this.drawAndFillHex(this.canvasCoordinates, { x, y }, colors[this.state.side], 3)
      }
      return true
    }
    return false
  }

  // TODO Move to HexMap Utils (to share with model)
  cubeDirection = (direction) => {
    const cubeDirection = [
      { q: +1, r: 0 },
      { q: +1, r: -1 },
      { q: 0, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: +1 },
      { q: 0, r: +1 },
    ]
    return cubeDirection[direction]
  }

  cubeAdd = (a, b) => {
    return { q: a.q + b.q, r: a.r + b.r }
  }

  getCubeNeighbour = (h, direction) => {
    return this.cubeAdd(h, this.cubeDirection(direction))
  }

  drawRegions = (side, hexes, color) => {
    if (side != this.state.side) {
      return
    }
    for (let hex of hexes) {
      if (hex === undefined) {
        continue
      }
      const { x, y } = flatHexToPixel({ q: hex.q, r: hex.r })
      this.drawAndFillHex(this.canvasCoordinates, { x, y }, color)
    }
  }
  drawNeighbours = (h) => {
    for (let i = 0; i <= 5; i++) {
      const { q, r } = this.getCubeNeighbour({ q: h.q, r: h.r }, i)
      const { x, y } = flatHexToPixel({ q, r })
      if (!areCoordinatesOnMap(q, r)) {
        continue
      }
      this.drawAndFillHex(this.canvasCoordinates, { x, y }, "rgba(255, 128, 0, 0.3)")

      // this.drawFlatHex(this.canvasCoordinates, { x, y }, "black", 2)
    }
  }

  // flatHexToPixel = (hex) => {
  //   const x = this.state.hexSize * ((3 / 2) * hex.q) + hexOrigin.x
  //   const y = this.state.hexSize * ((Math.sqrt(3) / 2) * hex.q + Math.sqrt(3) * hex.r) + hexOrigin.y
  //   return { x, y }
  // }

  pixelToFlatHex = ({ x, y }) => {
    let q = ((x - hexOrigin.x) * 2) / 3 / (this.state.hexSize * this.props.scale)
    let r = (((y - hexOrigin.y) * Math.sqrt(3)) / 3 - (x - hexOrigin.x) / 3) / (this.state.hexSize * this.props.scale)
    return { q, r, s: -q - r }
  }

  pointyHexToPixel = (hex) => {
    const x = this.state.hexSize * Math.sqrt(3) * (hex.q + hex.r / 2) + hexOrigin.x
    const y = ((this.state.hexSize * 3) / 2) * hex.r + hexOrigin.y
    return { x, y }
  }

  pixelToPointyHex = ({ x, y }) => {
    let q = (((x - hexOrigin.x) * Math.sqrt(3)) / 3 - (y - hexOrigin.y) / 3) / this.state.hexSize
    let r = ((y - hexOrigin.y) * 2) / 3 / this.state.hexSize
    return { q, r, s: -q - r }
  }

  getFlatHexCornerCoord = (center, i) => {
    const angle_deg = 60 * i
    const angle_rad = (Math.PI / 180) * angle_deg

    const x = center.x + this.state.hexSize * Math.cos(angle_rad)
    const y = center.y + this.state.hexSize * Math.sin(angle_rad)
    return { x, y:y+10 }
  }

  getPointyHexCornerCoord = (center, i) => {
    const angle_deg = 60 * i - 30
    const angle_rad = (Math.PI / 180) * angle_deg

    const x = center.x + this.state.hexSize * Math.cos(angle_rad)
    const y = center.y + this.state.hexSize * Math.sin(angle_rad)
    return { x, y }
  }

  getFlatHexParameters = () => {
    let hexWidth = this.state.hexSize * 2
    let hexHeight = Math.sqrt(3) * this.state.hexSize
    let vertDist = hexHeight
    let horizDist = (hexWidth * 3) / 4
    return { hexWidth, hexHeight, vertDist, horizDist }
  }

  getPointyHexParameters = () => {
    let hexHeight = this.state.hexSize * 2
    let hexWidth = (Math.sqrt(3) / 2) * hexHeight
    let vertDist = (hexHeight * 3) / 4
    let horizDist = hexWidth
    return { hexWidth, hexHeight, vertDist, horizDist }
  }

  drawHexCoordinates = (canvasID, center, hex) => {
    const row = String.fromCharCode(hex.q - 1 + "A".charCodeAt(0))
    const ctx = canvasID.getContext("2d")

    let col = 0
    if (hex.r === 1) {
      col = 0
    }
    if (hex.r === 2) {
      col = 200
    }
    // ctx.fillText(hex.q, center.x - 11, center.y + 3);
    // ctx.fillText(hex.r, center.x + 5, center.y + 3);
  }

  drawFlatHexes = () => {
    const { canvasWidth, canvasHeight } = this.state.canvasSize
    const { hexWidth, hexHeight, vertDist, horizDist } = this.hexParameters
    let qLeftSide = Math.round(hexOrigin.x / horizDist) * 4
    let qRightSide = Math.round((canvasWidth - hexOrigin.x) / horizDist) * 2
    let rTopSide = Math.round(hexOrigin.y / vertDist) * 4
    let rBottomSide = Math.round((canvasHeight - hexOrigin.y) / vertDist) * 2

    for (let r = -rTopSide; r <= rBottomSide; r++) {
      let p = 0
      for (let q = 0; q <= qRightSide; q++) {
        if (q % 2 === 0 && q !== 0) {
          p++
        }
        let { x, y } = flatHexToPixel({ q, r: r - p })
        if (
          x > hexWidth / 2 &&
          x < canvasWidth - hexWidth / 2 &&
          y > hexHeight / 2 &&
          y < canvasHeight - hexHeight / 2
        ) {
          this.drawFlatHex(this.canvasHex, { x, y }, "rgba(50, 40, 0, 0)", 1)

          const { q1, r1 } = convertCoords(q, r - p)
          this.drawHexCoordinates(this.canvasHex, { x, y }, { q: q1, r: r1 })
        }
      }
    }

    for (let r = -rTopSide; r <= rBottomSide; r++) {
      let n = 0
      for (let q = -1; q >= -qLeftSide; q--) {
        if (q % 2 !== 0) {
          n++
        }
        let { x, y } = flatHexToPixel({ q, r: r + n })
        if (
          x > hexWidth / 2 &&
          x < canvasWidth - hexWidth / 2 &&
          y > hexHeight / 2 &&
          y < canvasHeight - hexHeight / 2
        ) {
          this.drawFlatHex(this.canvasHex, { x, y }, "rgba(50, 40, 0, 0)", 1)
          this.drawHexCoordinates(this.canvasHex, { x, y }, { q, r: r + n })
        }
      }
    }
  }

  drawPointyHexes = () => {
    const { canvasWidth, canvasHeight } = this.state.canvasSize
    const { hexWidth, hexHeight, vertDist, horizDist } = this.hexParameters
    let qLeftSide = Math.round(hexOrigin.x / horizDist) * 4
    let qRightSide = Math.round((canvasWidth - hexOrigin.x) / horizDist) * 2
    let rTopSide = Math.round(hexOrigin.y / vertDist) * 4
    let rBottomSide = Math.round((canvasHeight - hexOrigin.y) / vertDist) * 2

    let p = 0
    for (let r = 0; r <= rBottomSide; r++) {
      if (r % 2 === 0 && r !== 0) {
        p++
      }
      for (let q = -qLeftSide; q <= qRightSide; q++) {
        let { x, y } = this.pointyHexToPixel({ q: q - p, r })
        if (
          x > hexWidth / 2 &&
          x < canvasWidth - hexWidth / 2 &&
          y > hexHeight / 2 &&
          y < canvasHeight - hexHeight / 2
        ) {
          this.drawPointyHex(this.canvasHex, { x, y })
          this.drawHexCoordinates(this.canvasHex, { x, y }, { q: q - p, r })
        }
      }
    }
    let n = 0
    for (let r = -1; r >= -rTopSide; r--) {
      if (r % 2 === 0) {
        n++
      }
      for (let q = -qLeftSide; q <= qRightSide; q++) {
        let { x, y } = this.pointyHexToPixel({ q: q + n, r })
        if (
          x > hexWidth / 2 &&
          x < canvasWidth - hexWidth / 2 &&
          y > hexHeight / 2 &&
          y < canvasHeight - hexHeight / 2
        ) {
          this.drawPointyHex(this.canvasHex, { x, y })
          this.drawHexCoordinates(this.canvasHex, { x, y }, { q: q + n, r })
        }
      }
    }
  }

  drawPointyHex = (canvasID, { x, y }, color, width) => {
    for (let i = 0; i <= 5; i++) {
      let start = this.getPointyHexCornerCoord({ x, y }, i)
      let end = this.getPointyHexCornerCoord({ x, y }, i + 1)
      this.drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y: end.y }, color, width)
    }
  }

  drawFlatHex = (canvasID, { x, y }, color, width) => {
    for (let i = 0; i <= 5; i++) {
      let start = this.getFlatHexCornerCoord({ x, y }, i)
      let end = this.getFlatHexCornerCoord({ x, y }, i + 1)
      this.drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y: end.y }, color, width)
    }
  }

  drawAndFillHex(canvasID, { x, y }, color, width) {
    let start = this.getFlatHexCornerCoord({ x, y }, 0)
    const ctx = canvasID.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)

    for (let i = 0; i <= 5; i++) {
      let end = this.getFlatHexCornerCoord({ x, y }, i + 1)
      ctx.strokeStyle = color
      // ctx.lineWidth = width
      ctx.lineTo(end.x, end.y)

      // this.drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y: end.y })
    }
    ctx.stroke()
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }
  drawHex(canvasID, center) {
    for (let i = 0; i <= 5; i++) {
      let start, end
      if (hexType === POINTY) {
        start = this.getPointyHexCornerCoord(center, i)
        end = this.getPointyHexCornerCoord(center, i + 1)
      } else {
        start = this.getFlatHexCornerCoord(center, i)
        end = this.getFlatHexCornerCoord(center, i + 1)
      }

      this.drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y: end.y })
    }
  }

  drawLine(canvasID, start, end, color, width) {
    const ctx = canvasID.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.closePath()
  }

  cubeRound = (frac) => {
    var q = Math.round(frac.q)
    var r = Math.round(frac.r)
    var s = Math.round(frac.s)

    var q_diff = Math.abs(q - frac.q)
    var r_diff = Math.abs(r - frac.r)
    var s_diff = Math.abs(s - frac.s)

    if (q_diff > r_diff && q_diff > s_diff) {
      q = -r - s
    } else if (r_diff > s_diff) {
      r = -q - s
    } else {
      s = -q - r
    }

    return { q, r, s }
  }

  getCanvasPosition(canvasID) {
    if (!this.state.canvasPosition) {
      return
    }
    const { left, right, top, bottom } = this.state.canvasPosition

    let rect = canvasID.getBoundingClientRect()
    this.setState({
      canvasPosition: {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      },
    })
  }

  // convert the axial coordinates to the offset coordinates (as printed on the game map)
  // convertCoords = (q, r) => {
  //   const r1 = q >= 2 ? r + Math.floor(q / 2) : r

  //   const row = String.fromCharCode(q - 1 + "A".charCodeAt(0))
  //   return { q1: row, r1 }
  // }

  handleMouseLeave = (e) => {
    this.clearCanvas()
  }

  handleMouseMove = (e) => {
    this.determineMousePosition(e)
    this.props.setCurrentMousePosition(() => this.state.currentHex)
  }

  determineMousePosition = (e) => {
    this.getCanvasPosition(this.canvasCoordinates)

    const { left, right, top, bottom } = this.state.canvasPosition

    const mx = e.pageX - left
    const my = e.pageY - top - window.scrollY

    // console.log("?>>>>>>>>>>>>>mx =", mx, "my =",my)
    // console.log("e.pageX =", e.pageX, "e.pageY =", e.pageY)
    // console.log("lefy =", left, " top = ", top)

    if (hexType === POINTY) {
      const { q, r } = this.cubeRound(this.pixelToPointyHex({ x: mx, y: my }))

      const { x, y } = this.pointyHexToPixel({ q, r })
      this.setState({
        currentHex: { ...this.state.currentHex, q, r, x, y },
      })
    } else {
      const { q, r } = this.cubeRound(this.pixelToFlatHex({ x: mx, y: my }))
      const { x, y } = flatHexToPixel({ q, r })

      if (!areCoordinatesOnMap(q, r)) {
        return
      }

      // if (this.state.currentHex) {
      //   console.log(`(${this.state.currentHex.q}, ${this.state.currentHex.r})`)
      // }
      const { q1, r1 } = convertCoords(q, r)
      this.setState({
        currentHex: { ...this.state.currentHex, q, r, x, y, row: q1, col: r1 }, // row col are the midway map coords
      })
    }
  }

  handleDragOver(e) {
    e.preventDefault()
    this.determineMousePosition(e)
    // if (this.state.currentHex) {
    //   console.log("Set current coords to", this.state.currentHex.row, this.state.currentHex.col)
    // }
    this.props.setCurrentCoords(this.state.currentHex)
  }

  handleDragEnd(e) {
    e.preventDefault()

    if (!this.state.currentHex) {
      return
    }
    this.setState({
      currentHex: { ...this.state.currentHex, side: this.state.side },
    })
  }
  handleClick = (e) => {
    if (!this.state.currentHex) {
      return
    }
    const { q, r } = this.state.currentHex
    this.drawNeighbours({ q, r })
  }
  render() {
    return (
      <div>
        <canvas ref={(canvasHex) => (this.canvasHex = canvasHex)}></canvas>
        <canvas
          ref={(canvasCoordinates) => (this.canvasCoordinates = canvasCoordinates)}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          onDrop={(e) => this.handleDragEnd(e)}
          onDragOver={(e) => this.handleDragOver(e)}
          onClick={this.handleClick}
        ></canvas>
      </div>
    )
  }
}
