'use client'
import { useState } from 'react'
import { useContext, useEffect } from 'react'
import { CanvasContext } from '@/context'

// Components
import Dialog from '../Dialog'
import Sidebar from '../Sidebar'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [content, setContent] = useState(undefined) // {name, title}
  const [variant, setVariant] = useState(null)

  const ref = useContext(CanvasContext)

  useEffect(() => {
    ref.current?.showCanvas()

    return () => {
      ref.current?.hideCanvas()
    }
  }, [ref])

  return (
    <>
      <Sidebar
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
          fullWidth={content.fullWidth}
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
