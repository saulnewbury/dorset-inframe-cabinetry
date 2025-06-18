import { customError } from '@/lib/custom-error'
import { prisma } from '@/lib/database'

export async function POST(request) {
  try {
    // Get the session id from the request body.
    const dto = await request.json()
    if (!dto.sessionId) throw new Error('Bad request')

    // Delete the session from the database.
    const deleted = await prisma.session.deleteMany({
      where: {
        id: dto.sessionId
      }
    })
    if (!deleted.count) throw new Error('Bad request')

    // Return a success message.
    return Response.json({ message: 'Logged out' })
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
