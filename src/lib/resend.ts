import { Resend } from 'resend'

// Lazy-initialize so missing key doesn't crash at module load
let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key || !key.startsWith('re_')) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    _resend = new Resend(key)
  }
  return _resend
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  react?: React.ReactElement
  from?: string
}

export async function sendEmail(opts: SendEmailOptions) {
  try {
    const resend = getResend()
    return await resend.emails.send({
      from: opts.from ?? process.env.RESEND_FROM ?? 'orders@surgimart.com',
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      react: opts.react,
    })
  } catch (err) {
    console.error('[Resend] Failed to send email:', err)
    return null
  }
}

export { getResend as resend }
