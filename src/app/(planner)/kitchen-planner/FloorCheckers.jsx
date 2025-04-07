'use client'
import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import { DoubleSide, Shape, Vector2 } from 'three'

export default function Floor({
  points,
  handlePan,
  showGrid = true,
  gridSize = 0.33,
  lightColor = '#ffffff',
  darkColor = '#333333'
}) {
  const shape = useMemo(
    () => new Shape(points.map((p) => new Vector2(p.x, p.z))).closePath(),
    [points]
  )

  // Convert hex colors to RGB vectors for shader
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        ]
      : [1, 1, 1] // Default to white if invalid
  }

  // Create vectors for color values
  const lightColorRGB = useMemo(() => hexToRgb(lightColor), [lightColor])
  const darkColorRGB = useMemo(() => hexToRgb(darkColor), [darkColor])

  return (
    <group
      onPointerOver={() => handlePan(true)}
      onPointerOut={() => handlePan(false)}
    >
      <mesh receiveShadow rotation-x={Math.PI / 2} position-y={-0.001}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          side={DoubleSide}
          receiveShadow
          onBeforeCompile={(shader) => {
            // Add world position varying for checkerboard calculation
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              varying vec3 vWorldPosition;`
            )

            // Calculate world position in vertex shader
            shader.vertexShader = shader.vertexShader.replace(
              '#include <worldpos_vertex>',
              `#include <worldpos_vertex>
              vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;`
            )

            // Add checkerboard pattern calculation to fragment shader
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
              varying vec3 vWorldPosition;
              
              // Checkerboard function
              vec3 getCheckerboard(vec3 worldPos, float size, vec3 color1, vec3 color2, float showGrid) {
                float x = worldPos.x;
                float z = worldPos.z;
                vec2 checkPos = vec2(x, z) / size;
                ivec2 cell = ivec2(floor(checkPos));
                bool isEven = ((cell.x + cell.y) % 2) == 0;
                vec3 color = isEven ? color1 : color2;
                return mix(color1, color, showGrid);
              }`
            )

            // Replace diffuse color calculation with checkerboard
            shader.fragmentShader = shader.fragmentShader.replace(
              'vec4 diffuseColor = vec4( diffuse, opacity );',
              `vec3 checkerColor = getCheckerboard(
                vWorldPosition, 
                ${gridSize.toFixed(4)}, 
                vec3(${lightColorRGB[0].toFixed(4)}, ${lightColorRGB[1].toFixed(
                4
              )}, ${lightColorRGB[2].toFixed(4)}),
                vec3(${darkColorRGB[0].toFixed(4)}, ${darkColorRGB[1].toFixed(
                4
              )}, ${darkColorRGB[2].toFixed(4)}),
                ${showGrid ? '1.0' : '0.0'}
              );
              vec4 diffuseColor = vec4(checkerColor, opacity);`
            )
          }}
        />
        <Edges threshold='15' color='gray' />
      </mesh>
    </group>
  )
}
