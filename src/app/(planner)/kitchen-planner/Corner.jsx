'use client'

export default function Corner({
  params,
  t,
  h,
  handleCoordinates,
  toggleHandle
}) {
  const { id, x, z } = params
  return (
    <mesh
      position={[x, h + 0.1, z]}
      onPointerOver={() => {
        toggleHandle()
        handleCoordinates(x, z, id)
      }}
    >
      <boxGeometry args={[t * 2, 0, t * 2]} />
      <meshStandardMaterial color='green' wireframe />
    </mesh>
  )
}
