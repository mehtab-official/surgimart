import 'server-only'
import { Resend } from 'resend'

// Lazy singleton — only creates the real client when first used
let _client: Resend | null = null

function getClient(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY
    // Use a dummy key so the Resend constructor doesn't throw —
    // actual calls will fail gracefully and be caught at call sites
    _client = new Resend(key && key.startsWith('re_') ? key : 're_placeholder_000')
  }
  return _client
}

// Export a Proxy so `resend.emails.send(...)` works everywhere
// but the Resend instance is not created at module load time
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// Helper for convenience (optional)
export async function sendEmail(opts: {
  to: string | string[]
  subject: string
  html?: string
  from?: string
}) {
  try {
    return await getClient().emails.send({
      from: opts.from ?? process.env.RESEND_FROM ?? 'orders@surgimart.com',
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    })
  } catch (err) {
    console.error('[Resend] Failed to send email:', err)
    return null
  }
}
