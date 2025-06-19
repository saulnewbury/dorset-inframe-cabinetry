'use client'
import { useContext, useEffect, useState } from 'react'
import { CanvasContext } from '@/context'
import { ModelContext } from '@/model/context'
import { useAppState } from '@/appState'

import Estimate from '@/components/Estimate'
import SvgIcon from '@/components/SvgIcon'

export default function Page() {
  const ref = useContext(CanvasContext)
  const { snapshots, removeSnapshot } = useAppState()
  const [model] = useContext(ModelContext)

  useEffect(() => {
    const t = ref.current
    t?.showCanvas()
    t?.shrinkCanvas()

    return () => {
      t?.hideCanvas()
      t?.restoreCanvas()
    }
  }, [ref])

  return (
    <div className="relative w-full">
      <div className="min-h-[100vh] w-[240px] max-w-[25vw] flex flex-col items-end justify-start gap-y-4 absolute top-[95px] right-[20px]">
        <Estimate isFloating={false} onShowSummary={createAndShowPDF} />
        {snapshots.length > 0 && (
          <p className="w-[240px] max-w-[25vw]">Snapshots:</p>
        )}
        {snapshots.map((snapshot, id) => (
          <div
            key={id}
            className=" bg-white p-4 border border-lightGrey relative"
          >
            <a href={snapshot} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={snapshot}
                alt={`Snapshot ${id + 1}`}
                className="w-full h-auto mb-2 object-contain"
              />
            </a>
            <button
              className="absolute top-2 right-2 focus:outline-none"
              onClick={() => removeSnapshot(snapshot)}
            >
              <SvgIcon
                shape="trash"
                classes="w-auto h-4 text-black hover:text-red "
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  async function createAndShowPDF(isPrint) {
    const frame = window.open('', '_blank')
    frame.document.title = 'Order Summary (PDF)'
    frame.document.body.innerHTML = `<h1>Order Summary</h1><p>Your PDF is being generated...</p>`

    // Get all snapshots as blobs
    const formData = new FormData()
    for (const snapshot of snapshots) {
      const blob = await fetch(snapshot).then((res) => res.blob())
      formData.append(
        'files',
        blob,
        `snapshot-${snapshots.indexOf(snapshot) + 1}.png`
      )
    }
    formData.set('model', JSON.stringify(model))

    // Create the PDF
    try {
      const response = await fetch('/api/create-pdf', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Network error: ' + response.statusText)
      }
      const body = await response.blob()
      const f = new File([body], 'order-summary.pdf', {
        type: body.type
      })
      const url = URL.createObjectURL(f)
      frame.location.href = url
      setTimeout(() => {
        frame.document.title = 'Order Summary (PDF)'
        URL.revokeObjectURL(url)
        if (isPrint) {
          frame.print()
        }
      }, 50)
    } catch (error) {
      console.error('Error creating PDF:', error)
      alert('Failed to create PDF. Please try again later.')
      frame.close()
    }
  }
}
