import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Button from '@/components/Button'

export default function ModelSavedDialog({
  isOpen,
  result,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const dialog = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      dialog.current.autofocus = true
      dialog.current.showModal()
    } else dialog.current?.close()
  }, [isOpen])

  return (
    mounted &&
    createPortal(
      <dialog onCancel={onClose} ref={dialog}>
        <div className="bg-[#0000003f] h-[100vh] w-[100vw] fixed top-0 left-0 z-[500] flex justify-center items-center">
          <div className="w-[600px] bg-[white] text-xl p-12 relative ">
            {result?.error ? (
              <>
                <p>Model save failed: {result.error}</p>
                <p className="mt-6 flex justify-end gap-8">
                  <Button primary onClick={onClose}>
                    Close
                  </Button>
                </p>
              </>
            ) : (
              <>
                <p>Your model has been saved successfully.</p>
                <p className="mt-6 flex justify-end gap-8">
                  <Button onClick={onClose}>Close</Button>
                  <Button primary onClick={onSubmit}>
                    Submit for review
                  </Button>
                </p>
              </>
            )}
          </div>
        </div>
      </dialog>,
      document.body
    )
  )
}
