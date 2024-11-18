'use client'

import { Shape, Vector2 } from 'three'

export default function WindowSashDouble({
  len,
  width,
  frame,
  w,
  d,
  opp,
  color
}) {
  const sash = sashDimensions(width / 2 - w * 1.5, len - w * 2)
  const sashSide = getSashSideDimensions(frame, w)
  const sashHead = getSashHeadDimensions(sash, w)

  return (
    <>
      {[null, null].map((_, idx) => {
        const px = idx === 0 ? width / 4 - w / 4 : -width / 4 + w / 4
        return (
          <group key={idx} position-x={px} position-z={0}>
            {sash.map((s, i) =>
              i < 2 ? (
                <mesh key={i} position={s.pos} rotation={s.rotation}>
                  <extrudeGeometry
                    args={[sashSide, { depth: d / 2, bevelEnabled: false }]}
                  />
                  <meshStandardMaterial
                  // color={color}
                  />
                </mesh>
              ) : (
                <mesh key={i} position={s.pos} rotation={s.rotation}>
                  <extrudeGeometry
                    args={[sashHead, { depth: d / 2, bevelEnabled: false }]}
                  />
                  <meshStandardMaterial
                  // color={color}
                  />
                </mesh>
              )
            )}
          </group>
        )
      })}

      <mesh>
        <boxGeometry args={[w, len, d]} />
        <meshStandardMaterial
        // color={color}
        />
      </mesh>
    </>
  )

  function getSashSideDimensions(sash, w) {
    const l = sash[2].len
    return new Shape([
      new Vector2(-l / 2 + w, -w / 2),
      new Vector2(-l / 2 + opp, w / 2),
      new Vector2(l / 2 - opp, w / 2),
      new Vector2(l / 2 - w, -w / 2)
    ])
  }
  function getSashHeadDimensions(sash, w) {
    const l = sash[0].len
    return new Shape([
      new Vector2(-l / 2, -w / 2),
      new Vector2(-l / 2 + opp, w / 2),
      new Vector2(l / 2 - opp, w / 2),
      new Vector2(l / 2, -w / 2)
    ])
  }

  function sashDimensions(width, height) {
    // top bottom left right
    return [
      {
        pos: [-width / 2 + w / 2, 0, -d / 4],
        rotation: [0, 0, -Math.PI / 2],
        len: width
      },
      {
        pos: [width / 2 - w / 2, 0, -d / 4],
        rotation: [0, 0, Math.PI / 2],
        len: width
      },
      {
        pos: [0, -height / 2 + w / 2, -d / 4],
        rotation: [0, 0, 0],
        len: height
      },
      {
        pos: [0, height / 2 - w / 2, -d / 4],
        rotation: [0, 0, Math.PI],
        len: height
      }
    ]
  }
}
