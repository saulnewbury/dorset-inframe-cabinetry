import { customError } from '@/lib/custom-error'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/database'

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url)
  const { modelId } = await params
  const sessionId = searchParams.get('sessionId')

  try {
    // Validate modelId and sessionId
    if (!modelId || !sessionId) {
      throw new Error('Model ID and Session ID are required')
    }

    // Check session exists and is current
    const session = await getSession(sessionId, prisma)
    if (!session) {
      throw new Error('Session not found or expired')
    }

    // Fetch the model data from the database
    const model = await prisma.saved.findUnique({
      where: { id: modelId, email: session.user.email },
      select: {
        modelData: true,
        created: true,
        submitted: true,
        timeframe: true,
        postcode: true
      }
    })

    if (!model) {
      throw new Error('Model not found')
    }

    return Response.json({ model })
  } catch (error) {
    console.error('Error fetching model:', error)
    return customError(error)
  }
}
