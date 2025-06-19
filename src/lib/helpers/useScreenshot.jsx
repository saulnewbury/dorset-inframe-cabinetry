import { useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppState } from '@/appState'

// Scene capture component
const CaptureSceneAndCamera = ({ setScene, setCamera }) => {
  const { scene, camera } = useThree()

  useEffect(() => {
    setScene(scene)
    setCamera(camera)
  }, [scene, camera, setScene, setCamera])

  return null
}

// Screenshot hook
export const useScreenshot = (width = 3840, height = 2160) => {
  const [scene, setScene] = useState(null)
  const [camera, setCamera] = useState(null)
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
    renderer.setSize(width, height, false)
    renderer.setPixelRatio(1)

    // Background settings
    renderer.setClearColor(0xfffffff, 1)

    // Store original camera aspect and bounds
    const originalAspect = camera.aspect
    const originalBounds = camera.isOrthographicCamera
      ? {
          left: camera.left,
          right: camera.right,
          top: camera.top,
          bottom: camera.bottom,
          zoom: camera.zoom
        }
      : null

    try {
      // Update camera for the new render target size
      camera.aspect = width / height
      if (camera.isOrthographicCamera) {
        const zoomRatio = Math.min(
          width / (originalBounds.right - originalBounds.left),
          height / (originalBounds.top - originalBounds.bottom)
        )
        camera.left = -0.5 * width
        camera.right = 0.5 * width
        camera.top = 0.5 * height
        camera.bottom = -0.5 * height
        camera.zoom = originalBounds.zoom * zoomRatio
      }
      camera.updateProjectionMatrix()

      // Render the scene to the new renderer
      renderer.render(scene, camera)

      // Convert to PNG data URL and add to snapshots
      renderer.domElement.toBlob((blob) => {
        const dataURL = URL.createObjectURL(blob)
        addSnapshot(dataURL)
      }, 'image/png')
    } catch (error) {
      console.error('Error taking screenshot:', error)
    } finally {
      // Restore camera settings
      camera.aspect = originalAspect
      if (originalBounds) {
        camera.left = originalBounds.left
        camera.right = originalBounds.right
        camera.top = originalBounds.top
        camera.bottom = originalBounds.bottom
        camera.zoom = originalBounds.zoom
      }
      camera.updateProjectionMatrix()

      // Clean up
      renderer.dispose()
    }
  }, [scene, camera, width, height, addSnapshot])

  // Create a component that the user can include in their scene
  const SceneCapture = () => (
    <CaptureSceneAndCamera setScene={setScene} setCamera={setCamera} />
  )

  return { takeScreenshot, SceneCapture }
}
export default useScreenshot
