import nodemailer from 'nodemailer'
import { smtpConfig } from '@/lib/smtp-config'
import crypto from 'node:crypto'

export async function POST(request) {
  try {
    // Check that email parameters are configured.
    if (!smtpConfig.host) {
      throw new Error('SMTP not configured')
    }
    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      throw new Error('Contact email is not configured')
    }

    // Get the data transfer object (JSON body) and verify that it contains
    // the required fields.
    const dto = await request.json()
    const { name, email, message, token, isRecaptcha } = dto

    if (!name || !email || !message) {
      throw new Error('Bad request: Missing required fields')
    }

    // Validate the email format.
    const emailPattern = /^[\w\d._%+-]+@[\w\d.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(email)) {
      throw new Error('Invalid email format')
    }

    // Validate the name length.
    if (name.length < 2 || name.length > 100) {
      throw new Error('Name must be between 2 and 100 characters')
    }

    // Check that the submission isn't spam.
    if (isRecaptcha) {
      const ret = await fetch(
        `https://recaptchaenterprise.googleapis.com/v1/projects/dorset-cabinetry-1749715508672/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: {
              token,
              siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
              expectedAction: 'contact'
            }
          })
        }
      )
      const recaptchaResponse = await ret.json()
      if (
        !recaptchaResponse.riskAnalysis ||
        recaptchaResponse.riskAnalysis.score < 0.5
      ) {
        throw new Error('Spam detected: reCAPTCHA validation failed')
      }
    } else {
      // If reCAPTCHA is not configured, we try a fallback check, using a random
      // token from the submitting JavaScript client.
      const [digits, checksum] = token.split('.')
      if (!checksum || digits.length !== 32) {
        throw new Error('Invalid token format')
      }
      const hash = crypto.createHash('md5')
      hash.update(digits)
      hash.update('contactCracker')
      const result = hash.digest('hex')
      if (result !== checksum) {
        console.log('Spam detected: Invalid token', token, result)
        throw new Error('Spam detected: Invalid token')
      }
    }

    // Send the request on to the business via a contact email.
    const mailOptions = {
      from: email,
      to: contactEmail,
      subject: `Contact Form Submission from ${name}`,
      text: message,
      replyTo: email
    }
    const transport = nodemailer.createTransport(smtpConfig)
    await transport.sendMail(mailOptions)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
