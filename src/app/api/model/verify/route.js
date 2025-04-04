import { prisma } from '@/lib/database'
import { scrypt } from 'node:crypto'
import { base } from '../save/route.js'
import { customError } from '@/lib/custom-error'

const required = ['email', 'password', 'requestId']

export async function POST(request) {
  try {
    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key)))
      throw new Error('Bad request')

    const { email, password, requestId } = dto

    // Check that the user has supplied the correct password for the account.
    const {
      salt,
      password: pwdb,
      isVerified
    } = await prisma.user.findUniqueOrThrow({
      where: { email },
      select: { salt: true, password: true, isVerified: true }
    })
    const pwd = await new Promise((resolve, reject) => {
      scrypt(password, salt + base, 64, (err, buf) => {
        if (err) reject(err)
        resolve(buf.toString('hex'))
      })
    })
    if (pwd !== pwdb) throw new Error('You are not authorised')

    // If the user has not been verified already then update their record.
    if (!isVerified) {
      await prisma.user.update({
        where: { email },
        data: { isVerified: true }
      })
    }

    // Check that the given request is still pending submission.
    const model = await prisma.saved.findFirst({
      where: {
        id: requestId,
        user: { email }
      },
      select: { submitted: true }
    })

    // Send a success response.
    return Response.json({
      isVerified: true,
      canSubmit: model && !model.submitted
    })
  } catch (err) {
    console.log(err)
    return customError(err)
  }
}
