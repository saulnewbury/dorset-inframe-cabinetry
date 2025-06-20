'use client'
import { useState } from 'react'

export default function UnitCard({ id, title, width, onClick }) {
  const [isHover, setHover] = useState(false)
  const style = id.replace(':', '-')
  const images = [
    `/units/${style}/${style}-${width}-front.webp`,
    `/units/${style}/${style}-${width}-side.webp`
  ]
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className="flex flex-col items-center"
    >
      <div
        className="w-full aspect-square overflow-hidden"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isHover ? images[1] : images[0]}
          alt=""
          className="w-full h-full  object-center object-cover"
          style={{ clipPath: 'inset(2px)' }}
        />
      </div>
      <div className="text-center">
        <p>{title}</p>
        <p className="text-sm">w: {width}mm</p>
      </div>
    </button>
  )
}
