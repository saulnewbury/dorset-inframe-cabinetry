import { prisma } from '@/lib/database'
import nodemailer from 'nodemailer'

import { siteURL } from '@/lib/siteURL'
import { customError } from '@/lib/custom-error'

const required = ['timeframe', 'postcode']

/**
 *
 */
export async function PATCH(request, { params }) {
  try {
    const { modelId: id } = await params
    if (!id) throw new Error('Bad request')

    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const keys = Object.keys(dto)
    if (required.some((key) => !keys.includes(key))) {
      console.log(keys)
      throw new Error('Bad request')
    }

    const { timeframe, postcode } = dto

    // Check that email parameters are configured.
    if (!process.env.SMTP_HOST) {
      throw new Error('SMTP not configured')
    }

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

    const link = `${siteURL}/model/view/${id}`
    await transport.sendMail({
      from: process.env.SMTP_ORIGIN,
      to: process.env.SMTP_MAILBOX,
      subject: 'New request: ' + id,
      text: `New request for quote:
      
      Go to ${link} to view details.`,
      html: `<p><b>New request for quote:</b></p>
      <p>Go to <a href="${link}">${link}</a> to view details.</p>`
    })

    // Now update the model entry in the database, to show it as 'sent'.
    const submitted = await prisma.saved.update({
      where: { id },
      data: { submitted: new Date(), timeframe, postcode },
      select: { submitted: true }
    })

    // Return result.
    return Response.json({ submitted })
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
