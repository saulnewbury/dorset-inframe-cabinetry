import { prisma } from '@/lib/database'

import Footer from '@/components/Footer'
import Button from '@/components/Button'

// Images
import kitchen from '@/lib/images/kitchen1.jpg'

export default async function VerifyAccount({ searchParams }) {
  const { id: verifyId } = await searchParams
  let verified = false
  console.log('Verifying account with ID:', verifyId)

  try {
    if (!verifyId) {
      throw new Error('Missing verification ID')
    }

    const user = await prisma.user.findUnique({
      where: { verifyId }
    })

    if (!user) {
      throw new Error('Invalid verification ID')
    }

    // Update the user's verified status
    await prisma.user.update({
      where: { email: user.email },
      data: { verifyId: null }
    })

    verified = true
  } catch (error) {
    console.error('Error verifying account:', error)
  }

  return (
    <>
      <div className="gutter [&_p]:my-4 my-12">
        <h1 className="text-2xl font-bold mt-8">
          {verified ? 'Account Verified!' : 'Verification Failed'}
        </h1>
        <p>
          {verified
            ? 'Your account has been successfully verified. You can now submit a saved model to receive a quote.'
            : 'There was an issue verifying your account. Please try again or contact us for support.'}
        </p>
        <p>
          <Button primary href="/">
            Return to home page
          </Button>
        </p>
      </div>
      <Footer classes="bg-[#606D8E] text-white pb-[120px]" />
    </>
  )
}
