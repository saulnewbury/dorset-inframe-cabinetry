import { prisma } from '@/lib/database'
import { randomBytes, scrypt } from 'node:crypto'
import nodemailer from 'nodemailer'

const required = ['name', 'email', 'password', 'modelData']
export const base = '0ae024030d0993124904e3a5181a5e5d' // md5 'random.upstart.bus'
const siteURL = 'http://www.dorset-inframe.co.uk'

const EXPIRY_DAYS = 5

export async function POST(request) {
  try {
    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key)))
      throw new Error('Bad request')

    const { name, email, password, modelData } = dto

    // Protect against illegal values for name and email, as we're going to use
    // them in nodemailer.
    if (!/^[\w\s\d]*$/.test(name) || !/^[\w\d.@]*$/.test(email))
      throw new Error('Bad data')

    // Create the user - unverified at first.
    const salt = randomBytes(16).toString('hex')
    const pwd = await new Promise((resolve, reject) => {
      scrypt(password, salt + base, 64, (err, buf) => {
        if (err) reject(err)
        resolve(buf.toString('hex'))
      })
    })
    const {
      id: userId,
      isVerified,
      password: pwdb
    } = await prisma.user.upsert({
      where: { email },
      create: { email, password: pwd, salt, name },
      update: {},
      select: { id: true, isVerified: true, password: true }
    })

    // Check that the password given is the same as last saved.
    if (pwdb !== pwd) throw new Error('You are not authorised')

    // Next save the model against that user.
    const { id: requestId } = await prisma.saved.create({
      data: { email, modelData },
      select: { id: true }
    })

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

    // If the email is not yet verified, send message to ask user to verify.
    if (!isVerified) {
      if (!process.env.SMTP_HOST) console.log('SMTP not configured')
      else {
        await transport.sendMail({
          from: process.env.SMTP_ORIGIN,
          to: `${name}<${email}>`,
          subject: 'Verify email address',
          text: `Dear ${name},

        Welcome to Dorset Inframe Cabinetry and thank you for your interest.
        
        Please verify your email address at the following URL:
        ${siteURL}/verify/${id}
        
        Your model has been saved and will be kept on our server for ${EXPIRY_DAYS}
        but will then be deleted if your email address has not been verified.`,
          html: `<p>Dear ${name},</p>
        <p><b>Welcome to Dorset Inframe Cabinetry</b> and thank you for your interest.</p>
        <p>Please verify your email address at the following URL:<br/>
        <a href="${siteURL}/verify/${id}">${siteURL}/verify/${id}</a></p>
        <p>Your model has been saved and will be kept on our server for
        ${EXPIRY_DAYS} but will then be deleted if your email address has not
        been verified.</p>`
        })
      }

      // And purge any obsolete saves.
      const expired = new Date()
      expired.setDate(expired.getDate() - EXPIRY_DAYS)
      await prisma.saved.delete({
        where: { email, created: { lt: expired } }
      })
    }

    // Otherwise send the request on to the business.
    else {
      await sendRequestToBusiness(requestId, transport)
    }

    // Return success.
    return Response.json({
      id,
      isVerified
    })
  } catch (err) {
    console.log(err)
    const message = err instanceof Error ? err.message : 'Save failed'
    return new Response(message, { status: 400 })
  }
}

/**
 * Shared function (also used on email verification) to send a request for a
 * quote on to the business. Only a link is sent - details can be viewed on the
 * web site.
 * @param {string} id
 * @param {NodeMailerTransport} transport
 * @returns {Promise<void>}
 */
export async function sendRequestToBusiness(id, transport) {
  if (!process.env.SMTP_HOST) {
    console.log('SMTP not configured')
    return
  }

  await transport.sendMail({
    from: process.env.SMTP_ORIGIN,
    to: process.env.SMTP_MAILBOX,
    subject: 'New request: ' + id,
    text: `New request for quote:
    
    Go to ${siteURL}/model/view/${id} to view details.`,
    html: `<p><b>New request for quote:</b></p>
    <p>Go to ${siteURL}/model/view/${id} to view details.</p>`
  })

  // Now update the model entry in the database, to show it as 'sent'.
  await prisma.saved.update({
    where: { id },
    data: { submitted: new Date() }
  })
}
