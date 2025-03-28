import { prisma } from '@/lib/database'
import { scrypt } from 'node:crypto'
import { base, sendRequestToBusiness } from '../save/routeModule.js'

const required = ['email', 'password']

export async function POST(request) {
  try {
    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key)))
      throw new Error('Bad request')

    const { email, password } = dto

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

    // Prepare to send emails ...
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })

    // Find any models that have not yet been submitted and do that now.
    const models = await prisma.saved.findMany({
      where: { email, saved: null },
      select: { id: true }
    })
    if (models.length > 0) {
      await Promise.all(
        models.map((m) => sendRequestToBusiness(m.id, transport))
      )
    }

    // Send a success response.
    return Request.json({
      submitted: models.length
    })
  } catch (err) {
    console.log(err)
    const message = err instanceof Error ? err.message : 'Verify failed'
    return new Response(message, { status: 400 })
  }
}
