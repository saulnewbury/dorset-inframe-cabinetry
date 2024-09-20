'use client'
import { useState } from 'react'

import ContentBox from '../ContentBox'
import Sidebar from '../SideBar'

export default function page() {
  const [open, setOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [content, setContent] = useState(undefined)

  return (
    <>
      <Sidebar
        handleOpen={(name) => {
          setOpen(name)
        }}
        handleShowContent={(name) => {
          setShowContent(name)
        }}
        handleContent={(option) => setContent(option)}
        open={open}
        showContent={showContent}
        content={content}
      />

      {/* <ContentBox /> */}
      {showContent && (
        <ContentBox
          closeContentBox={() => {
            setShowContent('')
            setOpen('')
          }}
          content={content}
        />
      )}
    </>
  )
}
