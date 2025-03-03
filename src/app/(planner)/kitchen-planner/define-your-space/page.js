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
        handleContent={(option) => setContent(option)}
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
          fullWidth={content.fullWidth ? true : false}
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
