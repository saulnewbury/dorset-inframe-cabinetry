import { customError } from '@/lib/custom-error'
import { randomBytes, scrypt } from 'node:crypto'
import { prisma } from '@/lib/database'
import nodemailer from 'nodemailer'
import { smtpConfig } from '@/lib/smtp-config'

const required = ['resetId', 'password']
const saltBase = process.env.SALT_BASE

export async function POST(request) {
  try {
    // Check that email parameters are configured.
    if (!smtpConfig.host) {
      throw new Error('SMTP not configured')
    }

    // Extract fields from the request body.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key))) {
      throw new Error('Missing required fields')
    }
    const { resetId, password } = dto

    let user
    const result = await prisma.$transaction(async (tx) => {
      // Check if the password reset token is valid.
      user = await tx.user.findUnique({
        where: {
          resetToken: resetId
        }
      })
      if (!user) throw new Error('Invalid token')

      // Hash the new password.
      const salt = randomBytes(16).toString('hex')
      let pwd = await new Promise((resolve, reject) => {
        scrypt(password, salt + saltBase, 64, (err, buf) => {
          if (err) reject(err)
          resolve(buf.toString('hex'))
        })
      })

      // Update the user with the new password and remove the reset token.
      await tx.user.update({
        where: {
          email: user.email
        },
        data: {
          password: pwd,
          salt,
          resetToken: null
        }
      })

      return { message: 'Password changed.' }
    })

    // Send the user a confirmation email.
    const transport = nodemailer.createTransport(smtpConfig)
    const mailOptions = {
      from: process.env.SMTP_ORIGIN,
      to: user.email,
      subject: 'Password changed',
      text: 'Your password has been changed successfully. If you did not do this, please contact us immediately.',
      html: '<p>Your password has been changed successfully. If you did not do this, please contact us immediately.</p>'
    }
    await transport.sendMail(mailOptions)

    // Return the result.
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return customError(error)
  }
}
