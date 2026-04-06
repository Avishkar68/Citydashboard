"use client"

import { create } from "zustand"

interface LocationState {
  destination: { lat: number; lng: number; name: string } | null
  setDestination: (dest: { lat: number; lng: number; name: string }) => void
  clearDestination: () => void
}

export const useLocationStore = create<LocationState>((set) => ({
  destination: null,
  setDestination: (dest) => set({ destination: dest }),
  clearDestination: () => set({ destination: null }),
}))