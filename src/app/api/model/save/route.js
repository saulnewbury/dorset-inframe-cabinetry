import { prisma } from '@/lib/database'
import { randomBytes, scrypt } from 'node:crypto'
import nodemailer from 'nodemailer'

import { siteURL } from '@/lib/siteURL'
import { customError } from '@/lib/custom-error'

const required = ['sessionId', 'modelData']

const EXPIRY_DAYS = 5

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
}

export async function POST(request) {
  try {
    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key))) {
      console.log(keys)
      throw new Error('Bad request')
    }

    const { sessionId, modelData } = dto

    const result = await prisma.$transaction(async (tx) => {
      // Check that the session is valid and get the user details.
      const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
      })
      if (!session || session.expires.getTime() < Date.now())
        throw new Error('Session not found')

      const { email, verifyId } = session.user

      // If the model has already been saved, verify that it belongs to this user.
      if (modelData.id) {
        const model = await tx.saved.findUnique({
          where: { id: modelData.id },
          select: { email: true }
        })
        if (!model) delete modelData.id
        else if (model.email !== email)
          throw new Error('You are not authorised')
      }

      // Next save the model against that user.
      const { id: modelId, created } = await (modelData.id
        ? tx.saved.update({
            where: { id: modelData.id },
            data: { modelData: JSON.stringify(modelData), created: new Date() },
            select: { id: true, created: true }
          })
        : tx.saved.create({
            data: { email, modelData: JSON.stringify(modelData) },
            select: { id: true, created: true }
          }))

      // If the email address is not yet verified, purge any obsolete saves.
      if (verifyId) {
        const expired = new Date()
        expired.setDate(expired.getDate() - EXPIRY_DAYS)
        await prisma.saved.deleteMany({
          where: { email, created: { lt: expired } }
        })
      }

      return { id: modelId, created, isVerified: !verifyId }
    })

    // Return success.
    return Response.json(result)
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
