// server/src/utils/mailer.ts
import nodemailer from 'nodemailer'

const getTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  }

  // Fallback / mock transporter that logs to console
  return null
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://127.0.0.1:8082'}/verify-email?token=${token}`
  const subject = 'Verify Your Email Address'
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2>Welcome to BrandArx!</h2>
      <p>Thank you for signing up. Please click the button below to verify your email address and activate your account:</p>
      <div style="margin: 24px 0;">
        <a href="${verifyUrl}" style="background-color: #6D53E4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p>This verification link will expire in 24 hours.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b;">If you did not request this email, you can safely ignore it.</p>
    </div>
  `

  const transporter = getTransporter()
  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BrandArx Auth" <noreply@brandarx.com>',
      to: email,
      subject,
      html,
    })
  } else {
    console.log('\n--- [SMTP MOCK] Verification Email Sent ---')
    console.log(`To: ${email}`)
    console.log(`Verify Link: ${verifyUrl}`)
    console.log('-------------------------------------------\n')
  }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://127.0.0.1:8082'}/reset-password?token=${token}`
  const subject = 'Reset Your Password'
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Please click the button below to complete the reset process:</p>
      <div style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #6D53E4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>This reset link will expire in 1 hour.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b;">If you did not request this reset, you can safely ignore this email.</p>
    </div>
  `

  const transporter = getTransporter()
  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BrandArx Auth" <noreply@brandarx.com>',
      to: email,
      subject,
      html,
    })
  } else {
    console.log('\n--- [SMTP MOCK] Password Reset Email Sent ---')
    console.log(`To: ${email}`)
    console.log(`Reset Link: ${resetUrl}`)
    console.log('---------------------------------------------\n')
  }
}
