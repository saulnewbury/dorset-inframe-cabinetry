import { createPortal } from 'react-dom'
import SvgIcon from '@/components/SvgIcon'
import { useRef } from 'react'

export default function SummaryModal({ pdfReport, onClose }) {
  const frame = useRef(null)

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw]">
        <div className="flex justify-end gap-x-8 mb-4">
          <button onClick={onPrint}>
            <SvgIcon shape="printer" />
          </button>
          <button onClick={onClose}>
            <SvgIcon shape="close" />
          </button>
        </div>
        <iframe
          ref={frame}
          src={pdfReport}
          className="w-full h-[80vh] border border-darkGrey"
        />
      </div>
    </div>,
    document.body
  )

  function onPrint() {
    if (frame.current) {
      frame.current.contentWindow.print()
    }
  }
}
