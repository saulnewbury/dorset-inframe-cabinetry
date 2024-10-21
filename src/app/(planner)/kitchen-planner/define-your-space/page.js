'use client'
import { useState } from 'react'

import Content from '../Content'
import Sidebar from '../Sidebar'
import { useContext, useEffect } from 'react'
import { CanvasContext } from '@/app/context'

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
        <Content
          content={content}
          closeContentBox={() => {
            setShowContent('')
            setOpen('')
          }}
        />
      )}
    </>
  )
}
