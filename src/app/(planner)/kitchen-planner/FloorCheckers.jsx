'use client'
import { useMemo, useRef, useEffect } from 'react'
import { Edges } from '@react-three/drei'
import { DoubleSide, Shape, Vector2 } from 'three'

export default function FloorCheckers({
  points,
  handlePan,
  gridSize = 0.33,
  colorA = '#ffffff',
  colorB = '#333333'
}) {
  // console.log('FloorCheckers rendering with colors:', colorA, colorB)

  // Material ref
  const materialRef = useRef()

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
  const aColorRGB = useMemo(() => hexToRgb(colorA), [colorA])
  const bColorRGB = useMemo(() => hexToRgb(colorB), [colorB])

  // Create a unique but stable id for the shader
  const shaderId = useMemo(
    () => Math.random().toString(36).substring(2, 15),
    []
  )

  // Update shader when colors change
  useEffect(() => {
    if (materialRef.current) {
      // Force material update
      materialRef.current.needsUpdate = true

      // Register our shader modification again with the new colors
      materialRef.current.customProgramCacheKey = () =>
        shaderId + colorA + colorB
    }
  }, [colorA, colorB, shaderId])

  return (
    <group
      onPointerOver={() => handlePan(true)}
      onPointerOut={() => handlePan(false)}
    >
      <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.001}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          ref={materialRef}
          // side={DoubleSide}
          receiveShadow
          customProgramCacheKey={() => shaderId + colorA + colorB}
          onBeforeCompile={(shader) => {
            // Add world position varying for checkerboard calculation
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              varying vec2 vUv;
              varying vec3 vPosition;`
            )

            // Pass UV and position to fragment shader
            shader.vertexShader = shader.vertexShader.replace(
              '#include <uv_vertex>',
              `#include <uv_vertex>
              vUv = uv;
              vPosition = position;`
            )

            // Add checkerboard pattern calculation to fragment shader
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
              varying vec2 vUv;
              varying vec3 vPosition;
              
              // Checkerboard function
              vec3 getCheckerboard(vec3 pos, float size, vec3 color1, vec3 color2) {
                // Use x and z for checkerboard pattern (x and y in object space due to rotation)
                float x = pos.x;
                float z = pos.y;
                
                // Create proper checkerboard pattern
                bool isEvenX = mod(floor(x / size), 2.0) < 0.5;
                bool isEvenZ = mod(floor(z / size), 2.0) < 0.5;
                
                // XOR operation for checkerboard
                bool isEvenCell = (isEvenX && !isEvenZ) || (!isEvenX && isEvenZ);
                
                return isEvenCell ? color1 : color2;
              }`
            )

            // Replace diffuse color calculation with checkerboard
            shader.fragmentShader = shader.fragmentShader.replace(
              'vec4 diffuseColor = vec4( diffuse, opacity );',
              `vec3 checkerColor = getCheckerboard(
                vPosition, 
                ${gridSize.toFixed(4)}, 
                vec3(${aColorRGB[0].toFixed(4)}, ${aColorRGB[1].toFixed(
                4
              )}, ${aColorRGB[2].toFixed(4)}),
                vec3(${bColorRGB[0].toFixed(4)}, ${bColorRGB[1].toFixed(
                4
              )}, ${bColorRGB[2].toFixed(4)})
                );
                // Apply darkness factor 
                vec3 adjustedCheckerColor = checkerColor * 0.5;
                
                // Add contrast enhancement
                float contrastFactor = 1.2; // Adjust for more or less contrast
                vec3 contrastEnhanced = (adjustedCheckerColor - 0.5) * contrastFactor + 0.5;
                // Clamp to prevent values outside valid range
                contrastEnhanced = clamp(contrastEnhanced, vec3(0.0), vec3(1.0));
                
                vec4 diffuseColor = vec4(contrastEnhanced, opacity);`
            )
          }}
        />
        <Edges threshold={15} color="gray" />
      </mesh>
    </group>
  )
}
