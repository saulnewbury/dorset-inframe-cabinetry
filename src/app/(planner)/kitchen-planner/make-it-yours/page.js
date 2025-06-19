'use client'
import { useState } from 'react'
import { useContext, useEffect } from 'react'
import { CanvasContext } from '@/context'

// Components
import Dialog from '../Dialog'
import Sidebar from '../Sidebar'

// Data
import { makeItYours } from '@/lib/data/sidebar'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [content, setContent] = useState(undefined) // {name, title}
  const [variant, setVariant] = useState(null)

  const ref = useContext(CanvasContext)

  useEffect(() => {
    const t = ref.current
    t?.showCanvas()

    return () => {
      t?.hideCanvas()
    }
  }, [ref])

  return (
    <>
      <Sidebar
        menu={makeItYours}
        open={open}
        showContent={showContent}
        content={content}
        handleContent={(option, variant = null) => {
          setContent(option)
          setVariant(variant)
        }}
        handleShowContent={(name) => {
          setShowContent(name)
        }}
        handleOpen={(name) => {
          setOpen(name)
        }}
      />

      {/* <ContentBox /> */}
      {showContent && (
        <Dialog
          width={content.dialogWidth}
          content={content}
          variant={variant}
          Body={content.component}
          closeContentBox={() => {
            setShowContent('')
            setOpen('')
          }}
        />
      )}
    </>
  )
}
