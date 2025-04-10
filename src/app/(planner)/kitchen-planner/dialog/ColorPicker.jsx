import { useState } from 'react'

import Circle from '@uiw/react-color-circle'

const colors = [
  '#cfcfd6',
  '#b7beca',
  '#a4a9bc',
  '#9a9aa7',
  '#818181',
  '#63676e',
  '#393437',
  '#c2bdbd',
  '#d1c8b6',
  '#d1b27c',
  '#c1df8e',
  '#aacd7b',
  '#6b6b44',
  '#42421f',
  '#aca592',
  '#897f78',
  '#f3d2c1',
  '#dfb299',
  '#bf8d7e',
  '#b35a3c',
  '#764639',
  '#322d30',
  '#F0F0F0'
]
const ColorPicker = ({ onClick }) => {
  const [hex, setHex] = useState('#F44E3B')
  return (
    <Circle
      colors={colors}
      color={hex}
      pointProps={{
        style: {
          marginRight: 8
        }
      }}
      onChange={(color) => {
        onClick(color.hex)
        setHex(color.hex)
      }}
    />
  )
}

export default ColorPicker

// not these
// '#ad9b88',
