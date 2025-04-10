'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import DialogInnerContainer from './DialogInnerContainer'
import SvgFloorPattern from '@/components/SvgFloorPattern'
import SvgIcon from '@/components/SvgIcon'

import ColorPicker from './ColorPicker'

const list = [
  {
    svgProps: {
      shape: 'checkers',
      factor: 1.1,
      height: 66.67,
      width: 120
    },
    containerClasses: 'hover:scale-[1.1]',
    bg: { backgroundColor: '#ffffff' },
    mainColor: '#000000',
    parity: true
  },
  {
    svgProps: {
      shape: 'diagonal',
      factor: 1.1,
      height: 66.67,
      width: 117
    },
    containerClasses: 'mt-[0.8px] -ml-[5px] scale-[1.05] hover:scale-[1.1]',
    bg: { backgroundColor: '#ffffff' },
    mainColor: '#000000',
    parity: true
  },
  {
    svgProps: {
      shape: 'grid',
      factor: 1,
      height: 66.67,
      width: 108
    },
    containerClasses:
      'mt-[0.27rem] ml-[0.4rem] scale-[1.2] hover:scale-[1.5] hover:mt-[0.66rem] hover:ml-[0.52rem]',
    bg: { backgroundColor: '#ffffff' }
  },
  {
    svgProps: {
      shape: 'horizontal-lines',
      factor: 1,
      height: 62,
      width: 107,
      bg: { backgroundColor: '#ffffff' }
    },

    containerClasses:
      'mt-[2.115px] ml-[0.4rem] scale-[1.2] hover:scale-[1.5] hover:mt-[0.66rem]'
  },
  {
    svgProps: {
      shape: 'vertical-lines',
      factor: 1,
      height: 66.67,
      width: 108
    },
    containerClasses:
      'mt-[0.25rem] ml-[4px] scale-[1.15] hover:scale-[1.5] hover:ml-[6px] ',
    bg: { backgroundColor: '#ffffff' }
  }
]

export default function ChooseStyles() {
  const containerRef = useRef()
  const patternElementsRef = useRef([])
  // Create a ref for the currently active color picker container
  const activePickerRef = useRef(null)

  const [wallColor, setWallColor] = useState('#BFBFBF')
  const [cabinetsColor, setCabinetsColor] = useState('#F0F0F0')
  const [worktopColor, setWorktopColor] = useState('#666666')
  const [patterns, setPatterns] = useState(list)
  const [patternId, setPatternId] = useState(0)
  const [open, setOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [picker, setPicker] = useState(null)

  // Debug state to track ref loading
  const [refsLoaded, setRefsLoaded] = useState(0)

  // Reset refs and set up cleanup
  useEffect(() => {
    patternElementsRef.current = []

    return () => {
      // Clean up animations
      gsap.killTweensOf(patternElementsRef.current)
    }
  }, [])

  // Set initial positions and mark component as ready once all refs are loaded
  useEffect(() => {
    console.log(`Refs loaded: ${refsLoaded}/${patterns.length}`)

    if (refsLoaded === patterns.length && !isReady) {
      console.log('All pattern refs loaded, initializing positions')

      // Ensure we have valid elements before proceeding
      if (patternElementsRef.current.every((el) => el instanceof Element)) {
        console.log('All refs are valid DOM elements')

        // Set initial positions and make ready
        patternElementsRef.current.forEach((tile) => {
          gsap.set(tile, { translateX: 0 })
        })

        setIsReady(true)
      } else {
        console.error(
          'Some refs are not valid DOM elements',
          patternElementsRef.current
        )
      }
    }
  }, [refsLoaded, isReady])

  useEffect(() => {
    if (open) return
    animation('reverse')
  }, [open])

  // Add click outside handler for color pickers
  useEffect(() => {
    // Only add listener if a picker is open
    if (picker !== null) {
      const handleClickOutside = (event) => {
        // If the active picker container exists and the click is outside of it
        if (
          activePickerRef.current &&
          !activePickerRef.current.contains(event.target)
        ) {
          // Close the picker
          setPicker(null)
        }
      }

      // Add event listener to document
      document.addEventListener('mousedown', handleClickOutside)

      // Return cleanup function
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [picker]) // Re-run when picker state changes

  // Add elements to ref
  const addToPatternElementsRef = (el) => {
    if (el && !patternElementsRef.current.includes(el)) {
      patternElementsRef.current.push(el)

      // Update ref count for debugging
      setRefsLoaded((prevCount) => prevCount + 1)
    }
  }

  // Spread patterns animation
  function animation(direction) {
    console.log(`Animation triggered: ${direction}`, {
      isReady,
      refCount: patternElementsRef.current.length,
      open
    })

    // Don't proceed if component isn't ready
    if (!isReady) {
      return
    }

    const patternTiles = patternElementsRef.current
    if (patternTiles.length === 0) {
      return
    }

    // Calculate the distance
    const firstTile = patternTiles[0]
    if (!firstTile || !firstTile.offsetWidth) {
      return
    }

    const distance = firstTile.offsetWidth + 20

    // Update z-index
    patternTiles.forEach((p, idx) => {
      gsap.set(p, { zIndex: idx === patternId ? 50 : 10 })
    })

    // Kill any ongoing animations
    gsap.killTweensOf(patternTiles)

    // Create fresh timeline
    const tl = gsap.timeline()

    if (direction === 'forward') {
      // Spread tiles
      patternTiles.forEach((tile, idx) => {
        tl.to(
          tile,
          {
            translateX: distance * idx,
            duration: 0.4,
            ease: 'power2.out'
          },
          '<0.05' // First starts immediately, rest are staggered
        )
      })
    } else if (direction === 'reverse') {
      // Stack tiles
      patternTiles.forEach((tile, idx) => {
        tl.to(
          tile,
          {
            translateX: 0,
            duration: 0.4,
            ease: 'power2.out'
          },
          '<0.05'
        )
      })
    }
  }

  const handleChevronClick = () => {
    if (!isReady) {
      console.log('Component not ready for animation yet')
      return
    }

    if (!open) {
      animation('forward')
      setOpen(true)
    } else {
      animation('reverse')
      setOpen(false)
    }
  }

  function handleFloorColors(hex, parity = undefined) {
    const newArray = patterns.map((p, i) => {
      if (!parity || parity === 'odd') {
        console.log('Wooooyeaah ODD ' + hex)
        return {
          ...p,
          bg: { backgroundColor: hex }
        }
      } else {
        console.log('Ooooh EVEN ' + hex)
        return {
          ...p,
          mainColor: hex // Change dark color
        }
      }
    })
    setPatterns(newArray)
  }

  function handleCabinetsColor(hex) {
    setCabinetsColor(hex)
  }

  function handleWorktopColor(hex) {
    setWorktopColor(hex)
  }

  function handleWallColor(hex) {
    setWallColor(hex)
  }

  return (
    <DialogInnerContainer>
      {/* Cabinets color */}
      <div className='mb-6 relative'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Cabinets</p>
        <div
          className='bg-[#F0F0F0] rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'
          style={{ backgroundColor: cabinetsColor }}
          onClick={() => {
            if (open) return
            setPicker('cabinets')
          }}
        ></div>
        {picker === 'cabinets' && (
          <div
            ref={activePickerRef}
            className='bg-[#eeeeee] z-[500] absolute top-0 left-[150px] shadow-xl h-[max-content] w-[282px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Choose a colour</p>
            <ColorPicker
              onClick={(hex) => {
                handleCabinetsColor(hex)
              }}
            />
          </div>
        )}
      </div>
      {/* Worktop color */}
      <div className='mb-6 relative'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Worktop</p>
        <div
          className='bg-[#666666] rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'
          style={{ backgroundColor: worktopColor }}
          onClick={() => {
            if (open) return
            setPicker('worktop')
          }}
        ></div>
        {picker === 'worktop' && (
          <div
            ref={activePickerRef}
            className='bg-[#eeeeee] z-[500] absolute top-0 left-[150px] shadow-xl h-[max-content] w-[282px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Choose a colour</p>
            <ColorPicker
              onClick={(hex) => {
                handleWorktopColor(hex)
              }}
            />
          </div>
        )}
      </div>
      {/* Walls color */}
      <div className='mb-6 relative'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Walls</p>
        <div
          className='rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'
          style={{ backgroundColor: wallColor }}
          onClick={() => {
            if (open) return
            setPicker('wall')
          }}
        ></div>
        {picker === 'wall' && (
          <div
            ref={activePickerRef}
            className='bg-[#eeeeee] z-[500] absolute top-0 left-[150px] shadow-xl h-[max-content] w-[282px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Choose a colour</p>
            <ColorPicker
              onClick={(hex) => {
                handleWallColor(hex)
              }}
            />
          </div>
        )}
      </div>

      {/* Floor */}
      <div className='mb-6 relative'>
        <div className='mb-3 flex items-center gap-[4.5rem] cursor-pointer'>
          <p className='text-gray-400 text-[.8rem]'>Floor</p>
          <span
            className={`w-5 h-5 flex justify-center items-center rounded-full scale-[1.3] transition ${
              open ? 'rotate-[90deg]' : 'rotate-[0deg]'
            }`}
            onClick={handleChevronClick}
          >
            <SvgIcon shape='chevron-right' />
          </span>
        </div>
        {/* Floor Colors */}
        {picker === 'floor' && (
          <div
            ref={activePickerRef}
            className='bg-[#eeeeee] z-[500] absolute -top-[90px] left-[150px] shadow-xl h-[max-content] w-[282px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Odd tiles</p>
            <ColorPicker
              onClick={(hex) => {
                handleFloorColors(hex, 'odd')
              }}
            />
            <br />
            <p className='text-gray-600 text-[.8rem] mb-5'>Even tiles</p>
            <ColorPicker
              onClick={(hex) => {
                handleFloorColors(hex, 'even')
              }}
            />
          </div>
        )}

        {/* Floor Patterns */}
        <div
          className='absolute top-[2rem] left-0'
          ref={containerRef}
          onClick={() => {
            if (open) return
            setPicker('floor')
          }}
        >
          {patterns.map((pattern, idx) => (
            <div
              key={idx}
              style={{ zIndex: patterns.length * 2 - idx + 1 }}
              className={`pattern absolute top-0 left-0 rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer overflow-hidden mr-5`}
              ref={addToPatternElementsRef}
              onClick={() => {
                if (!open) return
                setOpen(false)
                setPatternId(idx)
              }}
            >
              <div
                style={{ backgroundColor: '#ffffff', ...pattern.bg }}
                className={`rounded-lg w-[120px] aspect-[9/5] text-red-500 ${pattern.containerClasses}`}
              >
                <SvgFloorPattern
                  {...pattern.svgProps}
                  mainColor={pattern.mainColor}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogInnerContainer>
  )
}
