import Window3D from './Window3D'
import Door3D from './Door3D'

import { useExpState } from './expContext'

export default function Feature({ type, width, height }) {
  const is3D = useExpState((state) => state.is3D)
  const [feature, open, facing] = type.split(':')

  console.log(is3D)
  switch (feature) {
    case 'door':
      return is3D ? <Door3D width={width} /> : null
    // <Door open={open} facing={facing} at={anchor} length={length} />
    case 'window':
      return is3D ? <Window3D width={width} height={height} /> : null
    // <Window width={length} />
  }
}
