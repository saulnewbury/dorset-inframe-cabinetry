'use client'
import { useMemo, useRef, useEffect } from 'react'
import { Edges } from '@react-three/drei'
import {
  DoubleSide,
  Shape,
  Vector2,
  Color,
  ShaderMaterial,
  UniformsUtils
} from 'three'

export default function FloorCheckers({
  points,
  handlePan,
  gridSize = 0.33,
  colorA = '#ffffff',
  colorB = '#333333'
}) {
  console.log('FloorCheckers rendering with colors:', colorA, colorB)

  // Ref to access the material
  const materialRef = useRef()

  const shape = useMemo(
    () => new Shape(points.map((p) => new Vector2(p.x, p.z))).closePath(),
    [points]
  )

  // Convert hex to Color objects (Three.js built-in)
  const color1 = useMemo(() => new Color(colorA), [colorA])
  const color2 = useMemo(() => new Color(colorB), [colorB])

  // Pre-define the shader with uniforms that can be updated
  const shaderData = useMemo(() => {
    return {
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        gridSize: { value: gridSize }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float gridSize;
        varying vec3 vWorldPosition;
        
        void main() {
          float x = vWorldPosition.x;
          float z = vWorldPosition.z;
          bool isEven = mod(floor(x / gridSize) + floor(z / gridSize), 2.0) < 0.5;
          vec3 finalColor = isEven ? color1 : color2;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    }
  }, [gridSize]) // Only recompute if gridSize changes, colors will be updated via uniforms

  // Create shader material once
  const shaderMaterial = useMemo(() => {
    const material = new ShaderMaterial({
      uniforms: UniformsUtils.clone(shaderData.uniforms),
      vertexShader: shaderData.vertexShader,
      fragmentShader: shaderData.fragmentShader,
      side: DoubleSide
    })

    return material
  }, [shaderData])

  // Update uniforms when colors change (faster than recreating material)
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color1.value.set(colorA)
      materialRef.current.uniforms.color2.value.set(colorB)
      materialRef.current.uniformsNeedUpdate = true
    }
  }, [colorA, colorB])

  return (
    <group
      onPointerOver={() => handlePan(true)}
      onPointerOut={() => handlePan(false)}
    >
      <mesh receiveShadow rotation-x={Math.PI / 2} position-y={-0.001}>
        <shapeGeometry args={[shape]} />
        <primitive
          ref={materialRef}
          object={shaderMaterial}
          attach='material'
        />
        <Edges threshold={15} color='gray' />
      </mesh>
    </group>
  )
}
