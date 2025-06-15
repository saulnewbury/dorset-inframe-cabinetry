import { prisma } from '@/lib/database'
import nodemailer from 'nodemailer'
import { siteURL } from '@/lib/siteURL'
import { customError } from '@/lib/custom-error'
import { smtpConfig } from '@/lib/smtp-config'

const required = ['sessionId', 'timeframe', 'postcode']

/**
 *
 */
export async function PATCH(request, { params }) {
  try {
    // Check that email parameters are configured.
    if (!smtpConfig.host) {
      throw new Error('SMTP not configured')
    }

    // Check required parameters.
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

    const { sessionId, timeframe, postcode } = dto

    const result = await prisma.$transaction(async (tx) => {
      // Check that the session is valid and get the user details.
      const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: { user: true }
      })
      if (!session || session.expires.getTime() > Date.now())
        throw new Error('Session not found')

      const { email, verifyId } = session.user

      // If the email address is not yet verified then we cannot submit the request.
      if (verifyId) {
        throw new Error('Email address not verified')
      }

      // Check that the model exists and belongs to this user.
      const model = await tx.saved.findUnique({
        where: { id },
        select: { email: true }
      })
      if (!model) throw new Error('Model not found')
      if (model.email !== email) throw new Error('You are not authorised')

      // Check that the model has not already been submitted.
      if (model.submitted) throw new Error('Model already submitted')

      // Create a new submission event in the database.
      const submission = await tx.submission.create({
        data: {
          modelId: id,
          modelData: model.modelData,
          userEmail: email
        },
        select: { id: true, created: true }
      })

      // Send email to the business, with a link to the saved model.
      const transport = nodemailer.createTransport(smtpConfig)
      const link = `${siteURL}/submission/view/${submission.id}`
      await transport.sendMail({
        from: process.env.SMTP_ORIGIN,
        to: process.env.SMTP_MAILBOX,
        subject: 'New request: ' + id,
        text: `New request for quote:
      
      Go to ${link} to view details.`,
        html: `<p><b>New request for quote:</b></p>
      <p>Go to <a href="${link}">${link}</a> to view details.</p>`
      })

      // Update the model entry in the database, to show it as 'sent'.
      const submitted = await prisma.saved.update({
        where: { id },
        data: { submitted: submission.created, timeframe, postcode },
        select: { submitted: true }
      })

      return { submitted }
    })

    // Return result.
    return Response.json(result)
  } catch (err) {
    console.error(err)
    return customError(err)
  }
}
