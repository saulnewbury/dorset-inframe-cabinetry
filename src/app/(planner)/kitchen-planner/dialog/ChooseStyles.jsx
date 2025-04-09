'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import DialogInnerContainer from './DialogInnerContainer'
import SvgIcon from '@/components/SvgIcon'

import ColorPicker from './ColorPicker'

const patterns = [
  {
    shape: 'checkers',
    classes: 'fill-[black]',
    factor: 1.1,
    height: 66.67,
    width: 120,
    containerClasses: 'hover:scale-[1.1]'
  },
  {
    shape: 'diagonal',
    classes: 'fill-[black]',
    factor: 1.1,
    height: 66.67,
    width: 117,
    containerClasses: 'mt-[0.8px] -ml-[5px] scale-[1.05] hover:scale-[1.1]'
  },
  {
    shape: 'grid',
    classes: 'fill-[black]',
    factor: 1,
    height: 66.67,
    width: 108,
    containerClasses:
      'mt-[0.27rem] ml-[0.4rem] scale-[1.2] hover:scale-[1.5] hover:mt-[0.66rem] hover:ml-[0.52rem]'
  },
  {
    shape: 'horizontal-lines',
    classes: 'fill-[black]',
    factor: 1,
    height: 66.67,
    width: 108,
    containerClasses:
      'mt-[0.9rem] ml-[0.4rem] scale-[1.2] hover:scale-[1.5] hover:mt-[0.66rem]'
  },
  {
    shape: 'vertical-lines',
    classes: 'fill-[black]',
    factor: 1,
    height: 66.67,
    width: 108,
    containerClasses:
      'mt-[0.25rem] ml-[.99rem] scale-[1.15] hover:scale-[1.5] hover:ml-[2.25rem]'
  }
]

// floorConfig
// pattern: 'checkers' | diagonal squares | horizontal lines | vertical lines | grid | stars | none
// colors: [hex1, hex2] (for checkers & diagonal squares)
//
//

export default function ChooseStyles({
  floor = { pattern: 'checkers', colors: { even: '#000000', odd: '#ffffff' } }
}) {
  const containerRef = useRef()
  const patternsRef = useRef([])
  const floorConfig = useRef({})
  const [tileId, setTileId] = useState(0)
  const [open, setOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [picker, setPicker] = useState(null)

  // Debug state to track ref loading
  const [refsLoaded, setRefsLoaded] = useState(0)

  // Reset refs and set up cleanup
  useEffect(() => {
    patternsRef.current = []

    return () => {
      // Clean up animations
      gsap.killTweensOf(patternsRef.current)
    }
  }, [])

  // Set initial positions and mark component as ready once all refs are loaded
  useEffect(() => {
    console.log(`Refs loaded: ${refsLoaded}/${patterns.length}`)

    if (refsLoaded === patterns.length && !isReady) {
      console.log('All pattern refs loaded, initializing positions')

      // Ensure we have valid elements before proceeding
      if (patternsRef.current.every((el) => el instanceof Element)) {
        console.log('All refs are valid DOM elements')

        // Set initial positions and make ready
        patternsRef.current.forEach((tile) => {
          gsap.set(tile, { translateX: 0 })
        })

        setIsReady(true)
      } else {
        console.error(
          'Some refs are not valid DOM elements',
          patternsRef.current
        )
      }
    }
  }, [refsLoaded, isReady])

  useEffect(() => {
    if (open) return
    animation('reverse')
  }, [tileId])

  // Add elements to ref
  const addToPatternElementsRef = (el) => {
    if (el && !patternsRef.current.includes(el)) {
      patternsRef.current.push(el)

      // Update ref count for debugging
      setRefsLoaded((prevCount) => prevCount + 1)
    }
  }

  function animation(direction) {
    console.log(`Animation triggered: ${direction}`, {
      isReady,
      refCount: patternsRef.current.length,
      open
    })

    // Don't proceed if component isn't ready
    if (!isReady) {
      console.log('Component not ready yet, skipping animation')
      return
    }

    const patternTiles = patternsRef.current
    if (patternTiles.length === 0) {
      console.error('No pattern tiles found in ref')
      return
    }

    // Calculate the distance
    const firstTile = patternTiles[0]
    if (!firstTile || !firstTile.offsetWidth) {
      console.error('Cannot get tile dimensions', firstTile)
      return
    }

    const distance = firstTile.offsetWidth + 20
    console.log(`Animation distance: ${distance}px`)

    // Update z-index
    patternTiles.forEach((p, idx) => {
      gsap.set(p, { zIndex: idx === tileId ? 50 : 10 })
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
            ease: 'power2.out',
            onStart: () =>
              console.log(`Starting forward animation for tile ${idx}`),
            onComplete: () =>
              console.log(`Completed forward animation for tile ${idx}`)
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
            ease: 'power2.out',
            onStart: () =>
              console.log(`Starting reverse animation for tile ${idx}`),
            onComplete: () =>
              console.log(`Completed reverse animation for tile ${idx}`)
          },
          '<0.05'
        )
      })
    }
  }

  const handleChevronClick = () => {
    console.log('Chevron clicked', { open, isReady, refsLoaded })

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

  function handleColor(hex, type, parity) {
    if (type === 1) {
      floorConfig.color = hex
      // send off the object!
    } else {
      if (!floorConfig.colors) {
        // empty array
        floorConfig.colors = []
        floorConfig.colors.push(hex)
      } else if (parity === 'even') {
        // has an 'odd' color already so 'even' color needs to be inserted at the beginning
        if (floorConfig.colors.length === 2) {
          // if array contains 'even' already, then replace
          floorConfig.colors.splice(0, 1, hex)
          // send off the object!
        } else {
          // if array doesn't contain 'even' yet, then insert
          floorConfig.colors.unShift(hex)
          // send off the object!
        }
      } else if (parity === 'odd') {
        // has an 'even' color already so 'odd' color needs to be inserted at the beginning
        if (floorConfig.colors.length === 2) {
          // if array contains 'odd' already, then replace
          floorConfig.colors.splice(1, 1, hex)
          // send off the object!
        } else {
          // if array doesn't contain 'odd' yet, then insert
          floorConfig.colors.push(hex)
          // send off the object!
        }
      }
    }
  }

  return (
    <DialogInnerContainer>
      {/* Overlay */}
      {picker && (
        <div
          className='absolute z-[50] left-0 top-0 w-[100vh] h-[100vw]'
          onClick={() => {
            setPicker(null)
          }}
        ></div>
      )}
      {/* Cabinets color */}
      <div className='mb-6'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Cabinets</p>
        <div className='bg-[#F0F0F0] rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'></div>
      </div>
      {/* Worktop color */}
      <div className='mb-6'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Worktop</p>
        <div className='bg-[#666666] rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'></div>
      </div>
      {/* Walls color */}
      <div className='mb-6'>
        <p className='text-gray-400 text-[.8rem] mb-3'>Walls</p>
        <div className='bg-[#BFBFBF] rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer'></div>
      </div>
      {/* Floor */}
      <div className='mb-6 relative'>
        <div className='mb-3 flex items-center gap-[4.5rem] cursor-pointer'>
          <p className='text-gray-400 text-[.8rem]'>Floor</p>
          <span
            className='w-5 h-5 flex justify-center items-center rounded-full hover:scale-[1.3]'
            onClick={handleChevronClick}
          >
            <SvgIcon shape='chevron-right' />
          </span>
        </div>
        {/* Floor Colors */}
        {picker === 'floor' && (
          <div className='bg-[#eeeeee] z-[500] absolute -top-[90px] left-[150px] shadow-xl h-[max-content] w-[282px] px-[15px] py-[15px] rounded-lg'>
            <p className='text-gray-600 text-[.8rem] mb-5'>Even tiles</p>
            <ColorPicker
              onClick={(hex) => {
                handleColor(hex, 2, 'even')
              }}
            />
            <br />
            <p className='text-gray-600 text-[.8rem] mb-5'>Odd tiles</p>
            <ColorPicker
              onClick={(hex) => {
                handleColor(hex, 2, 'odd')
              }}
            />
          </div>
        )}

        {/* Slider */}
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
              className={`pattern absolute top-0 left-0 bg-[#BFBFBF] rounded-lg w-[120px] aspect-[9/5] border-[0.5px] border-black cursor-pointer overflow-hidden mr-5`}
              ref={addToPatternElementsRef}
              onClick={() => {
                if (!open) return
                setOpen(false)
                setTileId(idx)
                floorConfig.pattern = pattern.shape
              }}
            >
              <div
                className={`bg-[#BFBFBF] rounded-lg w-[120px] aspect-[9/5] text-red-100 ${pattern.containerClasses}`}
              >
                <SvgIcon {...pattern} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogInnerContainer>
  )
}
