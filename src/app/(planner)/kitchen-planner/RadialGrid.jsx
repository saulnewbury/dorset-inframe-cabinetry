export default function RadialGrid({ coords }) {
  const { x, z } = coords

  return (
    <mesh position={[x, 0.1, z]} rotation-x={Math.PI * 0.5}>
      <circleGeometry args={[20, 16, 0, Math.PI * 2]} />
      <meshBasicMaterial color='red' transparent opacity={0.2} wireframe />
    </mesh>
  )
}
