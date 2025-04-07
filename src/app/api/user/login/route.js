import { customError } from '@/lib/custom-error'
import { prisma } from '@/lib/database'
import { scrypt } from 'node:crypto'
import { createSession } from '@/lib/session'

const saltBase = process.env.SALT_BASE

const required = ['email', 'password']

export async function POST(request) {
  try {
    // Check configuration
    if (!saltBase) throw new Error('Missing configuration')

    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key)))
      throw new Error('Bad request')

    const { email, password } = dto

    const result = await prisma.$transaction(async (tx) => {
      // Check that the user exists.
      const user = await prisma.user.findUnique({
        where: { email }
      })
      if (!user) throw new Error('User not found')

      const { password: pwdb, salt } = user

      // Check that the password is correct.
      const pwd = await new Promise((resolve, reject) => {
        scrypt(password, salt + saltBase, 64, (err, buf) => {
          if (err) reject(err)
          resolve(buf.toString('hex'))
        })
      })

      if (pwd !== pwdb) throw new Error('User not found')
      // Create a new session for the user.
      const { sessionId, expires } = await createSession(email, tx)

      // Return session data.
      return {
        sessionId,
        expires
      }
    })

    // Send response.
    return Response.json(result)
  } catch (err) {
    console.log(err)
    return customError(err)
  }
}
