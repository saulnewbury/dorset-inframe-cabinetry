import { customError } from '@/lib/custom-error'
import { prisma } from '@/lib/database'
import { randomBytes, randomUUID, scrypt } from 'node:crypto'
import { createSession } from '@/lib/session'
import nodemailer from 'nodemailer'
import { smtpConfig } from '@/lib/smtp-config'

const required = ['name', 'email', 'password']
const saltBase = process.env.SALT_BASE

export async function POST(request) {
  try {
    // Check configuration
    if (!saltBase || !smtpConfig.host) throw new Error('Missing configuration')

    // Parse the request body
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key))) {
      throw new Error('Missing required fields')
    }
    const { name, email, password } = dto

    // Protect against illegal values for name and email, as we're going to use
    // them in nodemailer.
    if (!/^[\w\s\d]*$/.test(name) || !/^[\w\d.@]*$/.test(email))
      throw new Error('Bad data')

    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists.
      let user = await tx.user.findUnique({
        where: { email }
      })

      // Create a salt and hash the given password.
      const salt = user?.salt ?? randomBytes(16).toString('hex')
      let pwd = await new Promise((resolve, reject) => {
        scrypt(password, salt + saltBase, 64, (err, buf) => {
          if (err) reject(err)
          resolve(buf.toString('hex'))
        })
      })

      // If the user already exists, check if the password matches.
      if (user && user.password !== pwd)
        throw new Error('You are not authorised')

      // Else if the user does not exist, create a record now.
      if (!user) {
        const verifyId = randomUUID()
        user = await tx.user.create({
          data: { name, email, password: pwd, salt, verifyId }
        })
      }

      // Create a new session for the user.
      const { sessionId, expires } = await createSession(email, tx)

      // Return session data.
      return {
        sessionId,
        expires,
        verifyId: user.verifyId
      }
    })

    // If the email address is not yet verified, send a verification request.
    if (result.verifyId) {
      const transporter = nodemailer.createTransport(smtpConfig)
      const link = `${siteURL}/verify-account&id=${result.verifyId}`
      const mailOptions = {
        from: process.env.SMTP_ORIGIN,
        to: `${name}<${email}>`,
        subject: 'Verify email address',
        text: `Dear ${name},

      Welcome to Dorset Inframe Cabinetry and thank you for your interest.
      
      Please verify your email address at the following URL:
      ${link}`,
        html: `<p>Dear ${name},</p>
      <p><b>Welcome to Dorset Inframe Cabinetry</b> and thank you for your interest.</p>
      <p>Please verify your email address at the following URL:<br/>
      <a href="${link}">${link}</a></p>`
      }
      await transporter.sendMail(mailOptions)
    }

    return Response.json(result)
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
