import { useState, useEffect } from 'react'
import Circle from '@uiw/react-color-circle'

const colors = [
  '#E4E6F0',
  '#D1D4E6',
  '#A4A9BC',
  '#717689',
  '#424556',
  '#2C2E3C',
  '#FFEADF',
  '#ECAF98',
  '#C97858',
  '#B35A3C',
  '#6D371F',
  '#2D1810',
  '#F7FBEF',
  '#E9F5D9',
  '#CEEAAE',
  '#A0BC74',
  '#647743',
  '#2D3519',
  '#FBF6EA',
  '#E8D9BB',
  '#D1B27C',
  '#907B53',
  '#52452E',
  '#352C1C',
  '#EBEBEB',
  '#C4C4C4',
  '#9C9C9C',
  '#757575',
  '#4D4D4D',
  '#252525',
  '#000000',
  '#FFFFFF'
]

const ColorPicker = ({ onClick, selectedColor, initialColor = '#F44E3B' }) => {
  // Use internal state that syncs with external props
  const [currentColor, setCurrentColor] = useState(
    selectedColor || initialColor
  )

  // Update internal state when selectedColor prop changes
  useEffect(() => {
    if (selectedColor && selectedColor !== currentColor) {
      setCurrentColor(selectedColor)
    }
  }, [selectedColor])

  return (
    <Circle
      colors={colors}
      color={currentColor} // Use the internal state that syncs with props
      pointProps={{
        style: {
          marginRight: 8
        }
      }}
      onChange={(color) => {
        setCurrentColor(color.hex) // Update internal state
        onClick(color.hex) // Call the onClick handler with the selected color
      }}
    />
  )
}

export default ColorPicker
