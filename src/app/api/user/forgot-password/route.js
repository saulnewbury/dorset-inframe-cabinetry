import { randomUUID } from 'crypto'
import { prisma } from '@/lib/database'
import { customError } from '@/lib/custom-error'
import nodemailer from 'nodemailer'
import { siteURL } from '@/lib/siteURL'
import { smtpConfig } from '@/lib/smtp-config'

export async function POST(request) {
  try {
    // Check configuration
    if (!smtpConfig.host) throw new Error('Missing configuration')

    // Get the request body
    const body = await request.json()
    if (!body.email) throw new Error('Email is required')

    const token = await prisma.$transaction(async (tx) => {
      // Check whether the user has already requested a password reset. If so,
      // don't send another email.
      const user = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      })
      if (!user) throw new Error('User not found')
      if (user.resetToken) return null

      // Generate a new token and save it to the database.
      const resetToken = randomUUID()
      await tx.user.update({
        where: {
          email: body.email
        },
        data: {
          resetToken
        }
      })
      return resetToken
    })

    // If a new token was created, send the user an email with the reset link.
    if (token) {
      const transport = nodemailer.createTransport(smtpConfig)
      const link = `${siteURL}/reset-password/${token}`
      const mailOptions = {
        from: process.env.SMTP_ORIGIN,
        to: body.email,
        subject: 'Password Reset',
        text: `A password reset has been requested. If you did not do this, please contact us immediately, otherwise click here to reset your password: ${link}`,
        html: `<p>A password reset has been requested. If you did not do this, please contact us immediately, otherwise click <a href="${link}">here</a> to reset your password.</p>`
      }
      await transport.sendMail(mailOptions)
    }

    // Return response.
    return Response.json({ message: 'Please check your mailbox.' })
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
