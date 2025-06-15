'use client'

import { useAppState } from '@/appState'
import { AppContext } from '@/context'

import ModelContextProvider from '@/components/ModelContextProvider'
import { Canvas } from '@react-three/fiber'
import Experience from '@/app/(planner)/kitchen-planner/Experience'
import Camera from '@/app/(planner)/kitchen-planner/Camera'
import ViewControls from '@/app/(planner)/kitchen-planner/ViewControls'

export default function ModelView({ model }) {
  const { is3D, set3D } = useAppState()
  return (
    <AppContext.Provider value={is3D}>
      <ModelContextProvider value={[model, () => {}]}>
        <Canvas frameloop="demand" shadows>
          <Camera is3D={is3D} />
          <Experience is3D={is3D} />
        </Canvas>
        <ViewControls
          changePerspective={(bool) => set3D(bool)}
          is3D={is3D}
          top={true}
        />
      </ModelContextProvider>
    </AppContext.Provider>
  )
}
