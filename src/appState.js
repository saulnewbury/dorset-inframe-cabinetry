import { create } from 'zustand'

/**
 * A simple 'store' for application state.
 */
export const useAppState = create((set) => ({
  is3D: false,
  set3D: (to) => set({ is3D: to })
}))
