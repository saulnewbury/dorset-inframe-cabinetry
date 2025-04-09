import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './BlockSpreader.css' // We'll define styles separately

const BlockSpreader = ({ numBlocks = 5 }) => {
  const containerRef = useRef(null)
  const blocksRef = useRef([])
  const timelineRef = useRef(null)

  // Set up GSAP timeline on component mount
  useEffect(() => {
    // Clear the refs array if component re-renders
    blocksRef.current = []

    // Create the GSAP timeline and store it in ref for later use
    timelineRef.current = gsap.timeline({ paused: true })

    return () => {
      // Clean up timeline when component unmounts
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [numBlocks])

  // Add a block to the refs array
  const addToBlocksRef = (el) => {
    if (el && !blocksRef.current.includes(el)) {
      blocksRef.current.push(el)
    }
  }

  const spreadBlocks = () => {
    const container = containerRef.current
    const blocks = blocksRef.current

    if (!container || blocks.length === 0) return

    // Get container dimensions
    const containerWidth = container.offsetWidth
    const blockWidth = blocks[0].offsetWidth

    // Calculate spacing between blocks
    const spacing = (containerWidth - blockWidth) / (blocks.length - 1)

    // Reset the timeline
    timelineRef.current.clear()

    // Add animations for each block
    blocks.forEach((block, index) => {
      // Calculate target position
      const xPos = index * spacing - containerWidth / 2 + blockWidth / 2

      // Add to timeline
      timelineRef.current.to(
        block,
        {
          x: xPos,
          duration: 1,
          ease: 'power2.out'
        },
        index === 0 ? 0 : '<0.1'
      ) // Slight stagger, but first one starts immediately
    })

    // Play the timeline
    timelineRef.current.play(0)
  }

  const resetBlocks = () => {
    const blocks = blocksRef.current

    if (blocks.length === 0) return

    // Reset the timeline
    timelineRef.current.clear()

    // Create reset animation
    timelineRef.current.to(blocks, {
      x: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.05
    })

    // Play the timeline
    timelineRef.current.play(0)
  }

  // Generate blocks based on numBlocks prop
  const renderBlocks = () => {
    const blockElements = []
    const colors = [
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d8',
      '#7158e2',
      '#ff9f43',
      '#6ab04c',
      '#eb4d4b',
      '#22a6b3',
      '#be2edd',
      '#f9ca24'
    ]

    for (let i = 0; i < numBlocks; i++) {
      const color = colors[i % colors.length]
      blockElements.push(
        <div
          key={i}
          ref={addToBlocksRef}
          className='block'
          style={{
            backgroundColor: color,
            zIndex: numBlocks - i
          }}
        >
          {i + 1}
        </div>
      )
    }

    return blockElements
  }

  return (
    <div className='block-spreader'>
      <div className='container' ref={containerRef}>
        {renderBlocks()}
      </div>

      <div className='controls'>
        <button onClick={spreadBlocks}>Spread Blocks</button>
        <button onClick={resetBlocks}>Reset Blocks</button>
      </div>
    </div>
  )
}

export default BlockSpreader
