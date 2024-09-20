'use client'
import { useState, Fragment } from 'react'

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
          console.log(name)
          setOpen(name)
        }}
        handleShowContent={(name) => {
          setShowContent(name)
        }}
        handleContent={(option) => setContent(option)}
        open={open}
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
