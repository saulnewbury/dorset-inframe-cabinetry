import Button from '@/components/Button'

export default function ModelSavedDialog({
  show,
  result,
  onClose = () => {},
  onSubmit = () => {}
}) {
  return (
    show && (
      <div className="bg-[#0000003f] h-[100vh] w-[100vw] absolute z-[500] flex justify-center items-center">
        <div className="w-[600px] bg-[white] text-xl p-12 relative ">
          {result.error ? (
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
    )
  )
}
