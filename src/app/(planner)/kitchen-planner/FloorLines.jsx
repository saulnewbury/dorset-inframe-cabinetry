import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import {
  DoubleSide,
  Shape,
  Vector2,
  LineBasicMaterial,
  BufferGeometry,
  Vector3
} from 'three'

export default function FloorLines({
  points,
  handlePan,
  showHorizontalLines = false,
  showVerticalLines = false,
  color
}) {
  const shape = useMemo(
    () => new Shape(points.map((p) => new Vector2(p.x, p.z))).closePath(),
    [points]
  )

  // Utility function to check if a point is inside the polygon
  const isPointInPolygon = (point, polygon) => {
    const x = point.x
    const y = point.z // Using z as y for 2D polygon test

    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x
      const yi = polygon[i].z
      const xj = polygon[j].x
      const yj = polygon[j].z

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }

    return inside
  }

  // Create custom grid lines that match the floor shape
  const GridLines = useMemo(() => {
    // Find the bounding box of the floor shape
    const boundingBox = {
      minX: Math.min(...points.map((p) => p.x)),
      maxX: Math.max(...points.map((p) => p.x)),
      minZ: Math.min(...points.map((p) => p.z)),
      maxZ: Math.max(...points.map((p) => p.z))
    }

    const gridSize = 0.4 // Size of each grid cell
    const lines = []
    const lineMaterial = new LineBasicMaterial({ color: '#aaaaaa' })

    // Create horizontal grid lines (along the X axis)
    if (showHorizontalLines) {
      for (
        let z = Math.floor(boundingBox.minZ);
        z <= Math.ceil(boundingBox.maxZ);
        z += gridSize
      ) {
        let currentLine = []
        let isBuilding = false

        // Sample points across the X range
        const sampleRate = gridSize / 4 // Higher resolution for smoother clipping
        for (
          let x = boundingBox.minX - sampleRate;
          x <= boundingBox.maxX + sampleRate;
          x += sampleRate
        ) {
          const point = { x, z }
          const pointInside = isPointInPolygon(point, points)

          if (pointInside && !isBuilding) {
            // Start a new line segment
            isBuilding = true
            currentLine = [point]
          } else if (pointInside && isBuilding) {
            // Continue the current line
            currentLine.push(point)
          } else if (!pointInside && isBuilding) {
            // End the current line and store it
            if (currentLine.length > 1) {
              const lineGeometry = new BufferGeometry().setFromPoints([
                new Vector3(currentLine[0].x, 0, currentLine[0].z),
                new Vector3(
                  currentLine[currentLine.length - 1].x,
                  0,
                  currentLine[currentLine.length - 1].z
                )
              ])
              lines.push(
                <line
                  key={`horizontal-${z}-${currentLine[0].x}`}
                  geometry={lineGeometry}
                  material={lineMaterial}
                />
              )
            }
            isBuilding = false
            currentLine = []
          }
        }

        // Don't forget to add any line that reaches the border
        if (isBuilding && currentLine.length > 1) {
          const lineGeometry = new BufferGeometry().setFromPoints([
            new Vector3(currentLine[0].x, 0, currentLine[0].z),
            new Vector3(
              currentLine[currentLine.length - 1].x,
              0,
              currentLine[currentLine.length - 1].z
            )
          ])
          lines.push(
            <line
              key={`horizontal-${z}-${currentLine[0].x}`}
              geometry={lineGeometry}
              material={lineMaterial}
            />
          )
        }
      }
    }

    // Create vertical grid lines (along the Z axis)
    if (showVerticalLines) {
      for (
        let x = Math.floor(boundingBox.minX);
        x <= Math.ceil(boundingBox.maxX);
        x += gridSize
      ) {
        let currentLine = []
        let isBuilding = false

        // Sample points across the Z range
        const sampleRate = gridSize / 4 // Higher resolution for smoother clipping
        for (
          let z = boundingBox.minZ - sampleRate;
          z <= boundingBox.maxZ + sampleRate;
          z += sampleRate
        ) {
          const point = { x, z }
          const pointInside = isPointInPolygon(point, points)

          if (pointInside && !isBuilding) {
            // Start a new line segment
            isBuilding = true
            currentLine = [point]
          } else if (pointInside && isBuilding) {
            // Continue the current line
            currentLine.push(point)
          } else if (!pointInside && isBuilding) {
            // End the current line and store it
            if (currentLine.length > 1) {
              const lineGeometry = new BufferGeometry().setFromPoints([
                new Vector3(currentLine[0].x, 0, currentLine[0].z),
                new Vector3(
                  currentLine[currentLine.length - 1].x,
                  0,
                  currentLine[currentLine.length - 1].z
                )
              ])
              lines.push(
                <line
                  key={`vertical-${x}-${currentLine[0].z}`}
                  geometry={lineGeometry}
                  material={lineMaterial}
                />
              )
            }
            isBuilding = false
            currentLine = []
          }
        }

        // Don't forget to add any line that reaches the border
        if (isBuilding && currentLine.length > 1) {
          const lineGeometry = new BufferGeometry().setFromPoints([
            new Vector3(currentLine[0].x, 0, currentLine[0].z),
            new Vector3(
              currentLine[currentLine.length - 1].x,
              0,
              currentLine[currentLine.length - 1].z
            )
          ])
          lines.push(
            <line
              key={`vertical-${x}-${currentLine[0].z}`}
              geometry={lineGeometry}
              material={lineMaterial}
            />
          )
        }
      }
    }

    return lines
  }, [points, isPointInPolygon, showHorizontalLines, showVerticalLines])

  return (
    <group
      onPointerOver={() => handlePan(true)}
      onPointerOut={() => handlePan(false)}
    >
      <mesh receiveShadow rotation-x={Math.PI / 2} position-y={-0.002}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} side={DoubleSide} />
      </mesh>

      {GridLines}
    </group>
  )
}
