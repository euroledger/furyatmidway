export const convertCoords = (q, r) => {
  const r1 = q >= 2 ? r + Math.floor(q / 2) : r

  const row = String.fromCharCode(q - 1 + "A".charCodeAt(0))
  return { q1: row, r1 }
}

export const hexOrigin = {
  x: -15.3,
  y: -30.5,
}

export const hexSize = 29.07

export const axialToCube = (hex) => {
  const q = hex.q
  const r = hex.r
  const s = -q - r
  return { q, r, s }
}
export const isMidwayHex = (hex) => {
  return hex.q === 6 && hex.r === 3
}

export const flatHexToPixel = (hex) => {
  const x = hexSize * ((3 / 2) * hex.q) + hexOrigin.x
  const y = hexSize * ((Math.sqrt(3) / 2) * hex.q + Math.sqrt(3) * hex.r) + hexOrigin.y
  return { x, y }
}

export const cubeSubtract = (a, b) => {
  const hexA = axialToCube(a)
  const hexB = axialToCube(b)
  return { q: hexA.q - hexB.q, r: hexA.r - hexB.r, s: hexA.s - hexB.s }
}

export const distanceBetweenHexes = (a, b) => {
  const hexA = axialToCube(a)
  const hexB = axialToCube(b)

  const { q, r, s } = cubeSubtract(hexA, hexB)
  return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2
}

export const areCoordinatesOnMap = (q, r) => {
  const odd = [7, 6, 5, 4, 3]
  const oddTop = [0, -1, -2, -3, -4]

  const index = Math.floor(q / 2)

  // for the midway map, restrict hex selection to the displayed
  if (q === 1 && r >= 7) {
    return false
  }
  if (q === 3 && r >= 6) {
    return false
  }
  if (q === 5 && r >= 5) {
    return false
  }

  if (q === 7 && r >= 4) {
    return false
  }
  if (q === 9 && r >= 3) {
    return false
  }
  if (q === 0 || q >= 10 || (q % 2 === 1 && r === odd[index]) || (q % 2 === 0 && r >= odd[index])) {
    return false
  }

  if (r === oddTop[index]) {
    return false
  }
  return true
}

export const coordsOnMap = (q, r) => {
  const bounds = [
    [1, 6],
    [0, 5],
    [0, 5],
    [-1, 4],
    [-1, 4],
    [-2, 3],
    [-2, 3],
    [-3, 2],
    [-3, 2],
  ]

  if (q < 1 || q > 9) {
    return false
  }
  const q1 = bounds[q - 1][0]
  const r1 = bounds[q - 1][1]

  // console.log("q, r = ", q,r)
  // console.log("q1, r1 = ", q1,r1)

  if (r < q1 || r > r1) {
    return false
  }
  return true
}
export const getAllHexes = () => {
  const allHexes = new Array()
  for (let q = 1; q < 10; q++) {
    for (let r = -3; r < 7; r++) {
      if (coordsOnMap(q, r)) {
        allHexes.push({ q, r})
      }
    }
  }
  return allHexes
}

export const allHexesWithinDistance = (hex, distance, excludeMidway) => {
  const hexes = getAllHexes()
  const region = new Array()
  for (let h of hexes) {
    if (excludeMidway && h.q === 6 && h.r === 3) {
      continue
    }
    const d = distanceBetweenHexes(h, hex)
    if (d <= distance) {
      region.push(h)
    }
  }
  return region
}

