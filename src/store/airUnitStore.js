import { create } from 'zustand'

export const useAirUnitStore = create((set) => ({
    airUnitMap: new Map(),
    updateMap: (airUnitName, airUnit) => set((state) => {
        const map = new Map(state.airUnitMap)
        map.set(airUnitName, airUnit)
        return { airUnitMap: map }
    })
}))