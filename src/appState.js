import { create } from 'zustand'

/**
 * A simple 'store' for application state.
 */
export const useAppState = create((set) => ({
  is3D: false,
  set3D: (to) => set({ is3D: to }),
  snapshots: [],
  addSnapshot: (snapshot) =>
    set((state) => ({
      snapshots: [...state.snapshots, snapshot]
    })),
  removeSnapshot: (snapshot) =>
    set((state) => ({
      snapshots: state.snapshots.filter((s) => s !== snapshot)
    })),
  clearSnapshots: () => set({ snapshots: [] })
}))
