import { customError } from '@/lib/custom-error'
import { prisma } from '@/lib/database'
import { getSession } from '@/lib/session'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  try {
    // Check user session
    if (!sessionId) {
      throw new Error('Session ID is required')
    }
    const session = await getSession(sessionId, prisma)
    if (!session) {
      throw new Error('Session not found')
    }

    // Retrieve models for the user.
    const models = await prisma.saved.findMany({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        created: true,
        submitted: true
      },
      orderBy: {
        created: 'desc'
      }
    })

    return Response.json({ models })
  } catch (error) {
    console.error('Error fetching models:', error)
    return customError(error)
  }
}
