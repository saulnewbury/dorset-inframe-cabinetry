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
