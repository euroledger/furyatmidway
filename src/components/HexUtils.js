export const convertCoords = (q, r) => {
  const r1 = q >= 2 ? r + Math.floor(q / 2) : r

  const row = String.fromCharCode(q - 1 + "A".charCodeAt(0))
  return { q1: row, r1 }
}

export const hexOrigin = {
  x: -15.3,
  y: -20.5,
}

export const hexSize = 29.07

export const flatHexToPixel = (hex) => {
  const x = hexSize * ((3 / 2) * hex.q) + hexOrigin.x
  const y = hexSize * ((Math.sqrt(3) / 2) * hex.q + Math.sqrt(3) * hex.r) + hexOrigin.y
  return { x, y }
}
