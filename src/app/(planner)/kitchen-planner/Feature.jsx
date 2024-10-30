import Window3D from './Window3D'
import Door3D from './Door3D'
import Door from './Door'
import Window from './Window'

import { useExpState } from './expContext'

export default function Feature({
  type,
  width,
  height,
  anchor,
  len,
  color,
  onHover,
  onMoved
}) {
  const is3D = useExpState((state) => state.is3D)
  const [feature, open, facing] = type.split(':')

  switch (feature) {
    case 'door':
      return is3D ? (
        <Door3D width={width} />
      ) : (
        <Door
          onHover={onHover}
          open={open}
          facing={facing}
          at={anchor}
          max={len}
          length={width}
          color={color}
          onMoved={onMoved}
        />
      )
    case 'window':
      return is3D ? <Window3D width={width} height={height} /> : null
    // <Window width={length} />
  }
}
