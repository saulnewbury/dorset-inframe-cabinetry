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
  '#aca592',
  '#ad9b88',
  '#897f78',
  '#b35a3c',
  '#000000',
  '#ffffff'
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
