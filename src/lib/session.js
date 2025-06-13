/**
 * Creates a new session record for the given user.
 * @param {string} email
 * @param {PrismaClient} tx
 */
export async function createSession(email, tx) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
  const session = await tx.session.create({
    data: {
      user: { connect: { email } },
      expires
    },
    select: { id: true }
  })

  // And delete any expired sessions.
  await tx.session.deleteMany({
    where: {
      expires: { lt: new Date() }
    }
  })

  return {
    sessionId: session.id,
    expires
  }
}

/**
 * Gets the session for the given session ID.
 * @param {string} sessionId
 * @param {PrismaClient} tx
 */

export async function getSession(sessionId, tx) {
  const session = await tx.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  })

  if (!session) {
    return null
  }

  // Check if the session has expired.
  if (session.expires < new Date()) {
    await tx.session.delete({ where: { id: sessionId } })
    return null
  }

  return session
}
