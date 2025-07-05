'use client'

import { useCallback, useContext, useRef, useEffect, useState } from 'react'
import { ModelContext } from '@/model/context'
import gsap from 'gsap'

import DialogInnerContainer from './DialogInnerContainer'
import SvgFloorPattern from '@/components/SvgFloorPattern'
import SvgIcon from '@/components/SvgIcon'
import Button from '@/components/Button'
import ColorPicker from './ColorPicker'

import { initialState } from '@/model/appModel'
import { floorPatterns } from '@/model/floorPatterns'

export default function ChooseStyles() {
  const [model, dispatch] = useContext(ModelContext)
  const containerRef = useRef()
  const patternElementsRef = useRef([])
  // Create a ref for the currently active color picker container
  const activePickerRef = useRef(null)

  // Styles
  const [wallColor, setWallColor] = useState(model.wall || '#BFBFBF')
  const [cabinetsColor, setCabinetsColor] = useState(model.color || '#F0F0F0')
  const [worktopColor, setWorktopColor] = useState(model.worktop || '#666666')
  const [floor, setFloor] = useState(model.floor)

  const patternId = floorPatterns.findIndex((p) => p.id === floor.id) ?? 0

  const [open, setOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [picker, setPicker] = useState(null)
  const [resetModal, setResetModal] = useState(false)

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

  // Make sure correct floor sits ontop of the stack
  useEffect(() => {
    const patternTiles = patternElementsRef.current
    patternTiles.forEach((p, idx) => {
      gsap.set(p, { zIndex: idx === patternId ? 50 : 10 })
    })
  })

  // Set initial positions and mark component as ready once all refs are loaded
  useEffect(() => {
    // console.log(`Refs loaded: ${refsLoaded}/${floorPatterns.length}`)

    if (refsLoaded === floorPatterns.length && !isReady) {
      // console.log('All floor refs loaded, initializing positions')

      // Ensure we have valid elements before proceeding
      if (patternElementsRef.current.every((el) => el instanceof Element)) {
        // console.log('All refs are valid DOM elements')

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

  const animationCB = useCallback(animation, [isReady, patternId])

  useEffect(() => {
    if (open) return
    animationCB('reverse')
  }, [open, animationCB])

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

  // Add click outside handler for the floor slider
  useEffect(() => {
    // Only add listener if the slider is open
    if (open) {
      const handleClickOutside = (event) => {
        // Ignore clicks on the chevron to prevent conflict with handleChevronClick
        const chevronElement = document.querySelector('.chevron-icon')
        if (chevronElement && chevronElement.contains(event.target)) {
          return
        }

        // Check if the click is outside the slider container
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          // Close the slider
          setOpen(false)
          animationCB('reverse')
        }
      }

      // Add event listener to document
      document.addEventListener('mousedown', handleClickOutside)

      // Return cleanup function
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [open, animationCB]) // Re-run when open state changes

  // Add elements to ref
  const addToPatternElementsRef = (el) => {
    if (el && !patternElementsRef.current.includes(el)) {
      patternElementsRef.current.push(el)

      // Update ref count for debugging
      setRefsLoaded((prevCount) => prevCount + 1)
    }
  }

  // Spread floorPatterns animation
  function animation(direction) {
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
    const height = firstTile.offsetHeight + 20

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
        if (idx <= 3) {
          tl.to(
            tile,
            {
              translateX: distance * idx,
              duration: 0.4,
              ease: 'power2.out'
            },
            '<0.05' // First starts immediately, rest are staggered
          )
        } else {
          tl.to(
            tile,
            {
              translateX: distance * (idx - 4),
              translateY: height,
              duration: 0.4,
              ease: 'power2.out'
            },
            '<0.05' // First starts immediately, rest are staggered
          )
        }
      })
    } else if (direction === 'reverse') {
      // Stack tiles
      patternTiles.forEach((tile, idx) => {
        tl.to(
          tile,
          {
            translateX: 0,
            translateY: 0,
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
      // console.log('Component not ready for animation yet')
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

  function handleFloorPattern(idx) {
    const newPattern = { ...floor, id: floorPatterns[idx].id }
    setFloor(newPattern)
    selectFloor(newPattern)
  }

  // Change Color of all floorPatterns
  function handleFloorColors(hex, evenOdd) {
    const newPattern = { ...floor }
    if (evenOdd === 'odd') {
      newPattern.colorA = hex
    } else {
      newPattern.colorB = hex
    }

    setFloor(newPattern)
    selectFloor(newPattern)
  }

  function handleCabinetsColor(hex) {
    setCabinetsColor(hex)
    selectCabinetsColor(hex)
  }

  function handleWorktopColor(hex) {
    setWorktopColor(hex)
    selectWorktopColor(hex)
  }

  function handleWallColor(hex) {
    setWallColor(hex)
    selectWallColor(hex)
  }

  function resetColors() {
    // Define the reset values
    const resetCabinetsColor = '#F0F0F0'
    const resetWorktopColor = '#666666'
    const resetWallColor = '#BFBFBF'
    const resetPattern = {
      id: 'checkers',
      colorA: '#EEEEEE',
      colorB: '#000000'
    }

    // Update local state
    setCabinetsColor(resetCabinetsColor)
    setWorktopColor(resetWorktopColor)
    setWallColor(resetWallColor)
    setFloor(resetPattern)

    // Make a single dispatch with all reset values
    dispatch({
      id: 'setScheme',
      worktop: resetWorktopColor,
      wall: resetWallColor,
      color: resetCabinetsColor,
      floor: resetPattern
    })
  }

  return (
    <DialogInnerContainer>
      {/* Cabinets color */}
      <div className='mb-6 relative'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Cabinets</p>
        <div
          className='relative rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer [&>div]:opacity-0 [&>div]:hover:opacity-100'
          style={{ backgroundColor: cabinetsColor }}
          onClick={() => {
            if (open) return
            setPicker('cabinets')
          }}
        >
          <div
            style={{ color: cabinetsColor }}
            className='absolute bottom-1 mix-blend-exclusion pl-2 text-sm'
          >
            {cabinetsColor}
          </div>
        </div>
        {picker === 'cabinets' && (
          <div
            ref={activePickerRef}
            className='bg-[#dddddd] z-[500] absolute -top-[16px] left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Choose a colour</p>
            <ColorPicker
              selectedColor={cabinetsColor}
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
          className='relative rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer [&>div]:opacity-0 [&>div]:hover:opacity-100'
          style={{ backgroundColor: worktopColor }}
          onClick={() => {
            if (open) return
            setPicker('worktop')
          }}
        >
          <div
            style={{ color: worktopColor }}
            className='absolute bottom-1 mix-blend-exclusion pl-2 text-sm'
          >
            {worktopColor}
          </div>
        </div>
        {picker === 'worktop' && (
          <div
            ref={activePickerRef}
            className='bg-[#dddddd] z-[500] absolute -top-[16px] left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Choose a colour</p>
            <ColorPicker
              selectedColor={worktopColor}
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
          className='relative rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer [&>div]:opacity-0 [&>div]:hover:opacity-100'
          style={{ backgroundColor: wallColor }}
          onClick={() => {
            if (open) return
            setPicker('wall')
          }}
        >
          <div
            style={{ color: wallColor }}
            className='absolute bottom-1 mix-blend-exclusion pl-2 text-sm'
          >
            {wallColor}
          </div>
        </div>
        {picker === 'wall' && (
          <div
            ref={activePickerRef}
            className='bg-[#dddddd] z-[500] absolute -top-[16px] left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg'
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>Choose a colour</p>
            <ColorPicker
              selectedColor={wallColor}
              onClick={(hex) => {
                handleWallColor(hex)
              }}
            />
          </div>
        )}
      </div>

      {/* Floor */}
      <div className='mb-6 relative min-h-[120px]'>
        <div className='mb-3 flex items-center gap-[4.5rem] cursor-pointer'>
          <p className='text-gray-400 text-[.8rem]'>Floor</p>
          <span
            className={`w-5 h-5 flex justify-center items-center rounded-full scale-[1.3] transition chevron-icon ${
              open ? 'rotate-[90deg]' : 'rotate-[0deg]'
            }`}
            onClick={handleChevronClick}
          >
            <SvgIcon shape='chevron-right' />
          </span>
        </div>
        {/* Floor Colors (if there is no mainColor present only show one picker) */}
        {picker === 'floor' && (
          <div
            ref={activePickerRef}
            className={`${
              floorPatterns[patternId]?.parity ? '-top-[270px]' : '-top-[16px]'
            }
            bg-[#dddddd] z-[500] absolute left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg`}
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>
              {floorPatterns[patternId]?.parity ? 'Odd tiles' : 'Choose colour'}
            </p>
            <ColorPicker
              selectedColor={floor.colorA}
              onClick={(hex) => {
                handleFloorColors(hex, 'odd')
              }}
            />
            {floorPatterns[patternId]?.parity && (
              <>
                <br />
                <p className='text-gray-600 text-[.8rem] mb-5'>Even tiles</p>
                <ColorPicker
                  selectedColor={floor.colorB}
                  onClick={(hex) => {
                    handleFloorColors(hex, 'even')
                  }}
                />
              </>
            )}
          </div>
        )}

        {/* Slider */}
        <div
          className='absolute top-[2rem] left-0'
          ref={containerRef}
          onClick={(e) => {
            // Prevent this click from triggering the outside click handler
            e.stopPropagation()
            if (open) return
            setPicker('floor')
          }}
        >
          {floorPatterns.map((pattern, idx) => {
            // console.log(pattern)
            return (
              <div
                key={idx}
                style={{ zIndex: floorPatterns.length * 2 - idx + 1 }}
                className={`floor absolute top-0 left-0 rounded-lg w-[120px] h-[66.67px] border-[0.5px] border-black cursor-pointer overflow-hidden mr-5`}
                ref={addToPatternElementsRef}
                onClick={() => {
                  if (!open) return
                  setOpen(false)
                  handleFloorPattern(idx)
                }}
              >
                <div
                  style={{ backgroundColor: floor.colorA }}
                  className={`rounded-lg text-red-500 ${floor.containerClasses}  flex items-center justify-center scale-[1.25]`}
                >
                  <SvgFloorPattern
                    {...pattern.svgProps}
                    color={floor.colorB ? floor.colorB : ''}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reset colors modal */}
      <button
        className='text-sm text-[#555555] hover:underline'
        onClick={() => {
          setResetModal(true)
        }}
      >
        Reset colors &nbsp;
        <span>
          <SvgIcon shape='chevron-right' classes='scale-[1.3]' />
        </span>
      </button>
      {/* Modal*/}
      {resetModal && (
        <>
          <div className='w-full h-full bg-black absolute top-0 left-0 z-[60] opacity-10'></div>
          <div className='h-[200px] w-[35vw] shadow-xl absolute z-[900] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center items-center bg-white'>
            <div>
              <p className='text-center mb-6'>Are you sure?</p>
              <div className='flex justify-center items-center gap-3'>
                <Button
                  primary
                  onClick={() => {
                    setResetModal(false)
                  }}
                >
                  Keep selection
                </Button>
                <Button
                  onClick={() => {
                    setResetModal(false)
                    resetColors()
                  }}
                >
                  Reset colours
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </DialogInnerContainer>
  )

  function selectWorktopColor(hex) {
    dispatch({
      id: 'setScheme',
      worktop: hex,
      wall: wallColor,
      color: cabinetsColor,
      floor: floor
    })
  }

  function selectCabinetsColor(hex) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: wallColor,
      color: hex,
      floor: floor
    })
  }

  function selectWallColor(hex) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: hex,
      color: cabinetsColor,
      floor: floor
    })
  }

  function selectFloor(newPattern) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: wallColor,
      color: cabinetsColor,
      floor: newPattern
    })
  }
}
