import React, { useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppState } from '@/appState'

// Scene capture component
const CaptureSceneAndCamera = ({ setScene, setCamera }) => {
  const { scene, camera } = useThree()

  React.useEffect(() => {
    setScene(scene)
    setCamera(camera)
  }, [scene, camera, setScene, setCamera])

  return null
}

// Screenshot hook
export const useScreenshot = (width = 3840, height = 2160) => {
  const [scene, setScene] = React.useState(null)
  const [camera, setCamera] = React.useState(null)
  const { addSnapshot } = useAppState()

  const takeScreenshot = useCallback(() => {
    if (!scene || !camera) {
      console.error('Scene or camera not available')
      return
    }

    // Create a new renderer with desired size
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    })

    // Set up size and pixel ratio
    renderer.setSize(width, height)
    renderer.setPixelRatio(1)

    // Background settings
    renderer.setClearColor(0xfffffff, 1)

    // Store original camera aspect
    const originalAspect = camera.aspect

    try {
      // Update camera for the new render target size
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      // Render the scene to the new renderer
      renderer.render(scene, camera)

      // Convert to PNG data URL
      const dataURL = renderer.domElement.toDataURL('image/png')

      // Add to app state
      addSnapshot(dataURL)
    } catch (error) {
      console.error('Error taking screenshot:', error)
    } finally {
      // Restore camera settings
      camera.aspect = originalAspect
      camera.updateProjectionMatrix()

      // Clean up
      renderer.dispose()
    }
  }, [scene, camera, width, height])

  // Create a component that the user can include in their scene
  const SceneCapture = () => (
    <CaptureSceneAndCamera setScene={setScene} setCamera={setCamera} />
  )

  return { takeScreenshot, SceneCapture }
}
export default useScreenshot
