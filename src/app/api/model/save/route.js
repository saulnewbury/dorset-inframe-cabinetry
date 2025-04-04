import { prisma } from '@/lib/database'
import { randomBytes, scrypt } from 'node:crypto'
import nodemailer from 'nodemailer'

import { siteURL } from '@/lib/siteURL'
import { customError } from '@/lib/custom-error'

const required = ['name', 'email', 'password', 'modelData']
export const base = '0ae024030d0993124904e3a5181a5e5d' // md5 'random.upstart.bus'

const EXPIRY_DAYS = 5

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

    const { name, email, password, modelData } = dto

    // Protect against illegal values for name and email, as we're going to use
    // them in nodemailer.
    if (!/^[\w\s\d]*$/.test(name) || !/^[\w\d.@]*$/.test(email))
      throw new Error('Bad data')

    const result = await prisma.$transaction(async (tx) => {
      // If the model has already been saved, verify that it belongs to this user.
      if (modelData.id) {
        const model = await tx.saved.findUnique({
          where: { id: modelData.id },
          select: { email: true }
        })
        if (!model) delete modelData.id
        else if (email !== model.email)
          throw new Error('You are not authorised')
      }

      // Check if user already exists.
      const {
        salt: saltdb,
        password: pwdb,
        isVerified
      } = await tx.user.findUnique({
        where: { email },
        select: { salt: true, password: true, isVerified: true }
      })

      // Create the user - unverified at first.
      const salt = saltdb || randomBytes(16).toString('hex')
      let pwd = await new Promise((resolve, reject) => {
        scrypt(password, salt + base, 64, (err, buf) => {
          if (err) reject(err)
          resolve(buf.toString('hex'))
        })
      })

      // If user doesn't yet exist, create the record now.
      if (!saltdb) {
        await tx.user.create({
          data: { email, password: pwd, salt, name }
        })
      }

      // Else check that the password given is the same as last saved.
      else if (pwdb !== pwd) throw new Error('You are not authorised')

      // Next save the model against that user.
      const { id: modelId, created } = await (modelData.id
        ? tx.saved.update({
            where: { id: modelData.id },
            data: { modelData: JSON.stringify(modelData) },
            select: { id: true, created: true }
          })
        : tx.saved.create({
            data: { email, modelData: JSON.stringify(modelData) },
            select: { id: true, created: true }
          }))

      return { id: modelId, created, isVerified }
    })

    // Prepare to send emails ...
    const transport = nodemailer.createTransport({
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
    })

    // If the email is not yet verified, send message to ask user to verify.
    if (!result.isVerified) {
      if (!process.env.SMTP_HOST) console.log('SMTP not configured')
      else {
        const link = `${siteURL}/kitchen-planner/define-your-space/verifyId=${result.id}`
        await transport.sendMail({
          from: process.env.SMTP_ORIGIN,
          to: `${name}<${email}>`,
          subject: 'Verify email address',
          text: `Dear ${name},

        Welcome to Dorset Inframe Cabinetry and thank you for your interest.
        
        Please verify your email address at the following URL:
        ${link}
        
        Your model has been saved and will be kept on our server for ${EXPIRY_DAYS}
        days but will then be deleted if your email address has not been verified.`,
          html: `<p>Dear ${name},</p>
        <p><b>Welcome to Dorset Inframe Cabinetry</b> and thank you for your interest.</p>
        <p>Please verify your email address at the following URL:<br/>
        <a href="${link}">${link}</a></p>
        <p>Your model has been saved and will be kept on our server for
        ${EXPIRY_DAYS} days but will then be deleted if your email address has not
        been verified.</p>`
        })
      }

      // And purge any obsolete saves.
      const expired = new Date()
      expired.setDate(expired.getDate() - EXPIRY_DAYS)
      await prisma.saved.deleteMany({
        where: { email, created: { lt: expired } }
      })
    }

    // Return success.
    return Response.json(result)
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
