'use client'
import { useState } from 'react'

import Dialog from '../Dialog'
import Sidebar from '../Sidebar'
import { useContext, useEffect } from 'react'
import { CanvasContext } from '@/context'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [content, setContent] = useState(undefined) // {name, title}

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
        handleContent={(option) => setContent(option)}
        open={open}
        showContent={showContent}
        content={content}
        handleOpen={(name) => {
          setOpen(name)
        }}
        handleShowContent={(name) => {
          setShowContent(name)
        }}
      />

      {/* <ContentBox /> */}
      {showContent && (
        <Dialog
          content={content}
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
