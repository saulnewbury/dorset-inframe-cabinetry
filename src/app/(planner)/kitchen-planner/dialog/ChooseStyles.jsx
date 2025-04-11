'use client'

import { useContext, useRef, useEffect, useState } from 'react'
import { ModelContext } from '@/model/context'
import gsap from 'gsap'

import DialogInnerContainer from './DialogInnerContainer'
import SvgFloorPattern from '@/components/SvgFloorPattern'
import SvgIcon from '@/components/SvgIcon'
import Button from '@/components/Button'
import ColorPicker from './ColorPicker'

import { initialState } from '@/model/appModel'

export default function ChooseStyles() {
  const list = initialState.floor.patterns

  const [model, dispatch] = useContext(ModelContext)
  const containerRef = useRef()
  const patternElementsRef = useRef([])
  const floorConfig = useRef({})
  // Create a ref for the currently active color picker container
  const activePickerRef = useRef(null)

  // Styles
  const [wallColor, setWallColor] = useState(model.wall || '#BFBFBF')
  const [cabinetsColor, setCabinetsColor] = useState(model.color || '#F0F0F0')
  const [worktopColor, setWorktopColor] = useState(model.worktop || '#666666')
  const [patterns, setPatterns] = useState(model.floor?.patterns || list)
  const [patternId, setPatternId] = useState(model.floor?.id || 0)

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

  // Make sure correct pattern sits ontop of the stack
  useEffect(() => {
    const patternTiles = patternElementsRef.current
    patternTiles.forEach((p, idx) => {
      gsap.set(p, { zIndex: idx === patternId ? 50 : 10 })
    })
  })

  // Set initial positions and mark component as ready once all refs are loaded
  useEffect(() => {
    // console.log(`Refs loaded: ${refsLoaded}/${patterns.length}`)

    if (refsLoaded === patterns.length && !isReady) {
      // console.log('All pattern refs loaded, initializing positions')

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

  // Add click outside handler for the pattern slider
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
          animation('reverse')
        }
      }

      // Add event listener to document
      document.addEventListener('mousedown', handleClickOutside)

      // Return cleanup function
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [open]) // Re-run when open state changes

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

  // Change Color of all patterns
  function handleFloorColors(hex, evenOdd) {
    const newArray = patterns.map((p) => {
      console.log(p.svgProps.shape + ' ' + p.color)
      if (!p.parity) {
        return {
          ...p,
          color: [hex]
        }
      } else if (evenOdd === 'odd') {
        return {
          ...p,
          color: [hex, p.color[1]]
        }
      } else {
        return {
          ...p,
          color: [p.color[0], hex]
        }
      }
    })

    // console.log(newArray)
    selectFloorColors(newArray, patternId)
    setPatterns(newArray)
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
    const resetPatternId = 0

    // Update local state
    setCabinetsColor(resetCabinetsColor)
    setWorktopColor(resetWorktopColor)
    setWallColor(resetWallColor)
    setPatterns(list)
    setPatternId(resetPatternId)

    // Make a single dispatch with all reset values
    dispatch({
      id: 'setScheme',
      worktop: resetWorktopColor,
      wall: resetWallColor,
      color: resetCabinetsColor,
      floor: { patterns: list, id: resetPatternId }
    })
  }

  return (
    <DialogInnerContainer>
      {/* Cabinets color */}
      <div className='mb-6 relative'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Cabinets</p>
        <div
          className='rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'
          style={{ backgroundColor: cabinetsColor }}
          onClick={() => {
            if (open) return
            setPicker('cabinets')
          }}
        ></div>
        {picker === 'cabinets' && (
          <div
            ref={activePickerRef}
            className='bg-[#ffffff] z-[500] absolute -top-[16px] left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg'
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
          className='rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'
          style={{ backgroundColor: worktopColor }}
          onClick={() => {
            if (open) return
            setPicker('worktop')
          }}
        ></div>
        {picker === 'worktop' && (
          <div
            ref={activePickerRef}
            className='bg-[#ffffff] z-[500] absolute -top-[16px] left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg'
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
            className='bg-[#ffffff] z-[500] absolute -top-[16px] left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg'
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
        {list && picker === 'floor' && (
          <div
            ref={activePickerRef}
            className={`${
              patterns[patternId]?.parity ? '-top-[180px]' : '-top-[16px]'
            }
            bg-[#ffffff] z-[500] absolute left-[150px] shadow-xl h-[max-content] w-[250px] px-[15px] py-[15px] rounded-lg`}
          >
            <p className='text-gray-600 text-[.8rem] mb-5'>
              {patterns[patternId]?.parity ? 'Odd tiles' : 'Choose colour'}
            </p>
            <ColorPicker
              onClick={(hex) => {
                handleFloorColors(hex, 'odd')
              }}
            />
            {patterns[patternId]?.parity && (
              <>
                <br />
                <p className='text-gray-600 text-[.8rem] mb-5'>Even tiles</p>
                <ColorPicker
                  onClick={(hex) => {
                    handleFloorColors(hex, 'even')
                  }}
                />
              </>
            )}
          </div>
        )}

        {/* Slider */}
        {list && (
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
            {patterns.map((pattern, idx) => {
              // console.log(pattern)
              return (
                <div
                  key={idx}
                  style={{ zIndex: patterns.length * 2 - idx + 1 }}
                  className={`pattern absolute top-0 left-0 rounded-lg w-[120px] h-[66.67px] border-[0.5px] border-black cursor-pointer overflow-hidden mr-5`}
                  ref={addToPatternElementsRef}
                  onClick={() => {
                    if (!open) return
                    setOpen(false)
                    setPatternId(idx)
                    selectFloor(idx)
                    floorConfig.pattern = pattern.svgProps.shape
                  }}
                >
                  <div
                    style={{ backgroundColor: pattern.color[0] }}
                    className={`rounded-lg text-red-500 ${pattern.containerClasses}`}
                  >
                    <SvgFloorPattern
                      {...pattern.svgProps}
                      color={pattern.color[1] ? pattern.color[1] : ''}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
      floor: { patterns, id: patternId }
    })
  }

  function selectCabinetsColor(hex) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: wallColor,
      color: hex,
      floor: { patterns, id: patternId }
    })
  }

  function selectWallColor(hex) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: hex,
      color: cabinetsColor,
      floor: { patterns, id: patternId }
    })
  }

  function selectFloor(idx) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: wallColor,
      color: cabinetsColor,
      floor: { patterns, id: idx }
    })
  }

  function selectFloorColors(newArray, id) {
    dispatch({
      id: 'setScheme',
      worktop: worktopColor,
      wall: wallColor,
      color: cabinetsColor,
      floor: { patterns: newArray, id }
    })
  }
}
