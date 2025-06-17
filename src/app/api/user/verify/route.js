import { prisma } from '@/lib/database'
import { customError } from '@/lib/custom-error'

export async function POST(request) {
  const { sessionId } = await request.json()
  try {
    if (!sessionId) throw new Error('Session ID is required')

    const result = await prisma.$transaction(async (tx) => {
      let session = await tx.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
      })

      if (session && session.expires < new Date()) {
        // Session has expired, delete it
        await tx.session.delete({ where: { id: sessionId } })
        session = null
      }

      if (!session) throw new Error('Session not found or expired')

      return {
        sessionId: session.id,
        email: session.user.email,
        expires: session.expires
      }
    })

    return Response.json(result)
  } catch (error) {
    // console.error('Error verifying session:', error)
    return customError(error)
  }
}
