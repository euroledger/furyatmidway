import {
  distanceBetweenHexes,
  isMidwayHex
} from "../src/components/HexUtils"

test("is Midway and Distances between two hexes on map", () => {

    let hex1 = {
        q: 6,
        r: 3
    } // Midway hex

    expect (isMidwayHex(hex1)).toEqual(true)

    let hex2 = {
        q: 1, 
        r: 2
    } // Hex A, 2

    expect (isMidwayHex(hex2)).toEqual(false)
    expect (distanceBetweenHexes(hex1, hex2)).toEqual(6)

    hex1 = {
        q: 1,
        r: 1
    } // A, 1
    hex2 = {
        q: 9, 
        r: 1
    } // I, 5
    expect (distanceBetweenHexes(hex1, hex2)).toEqual(8)

    hex1 = {
        q: 1,
        r: 1
    } // A, 1
    hex2 = {
        q: 9, 
        r: -2
    } // I, 2
    expect (distanceBetweenHexes(hex1, hex2)).toEqual(8)
})
