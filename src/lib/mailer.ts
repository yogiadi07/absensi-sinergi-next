import nodemailer from 'nodemailer'

// Create a singleton transporter using Gmail SMTP
// Requires environment variables:
// - GMAIL_USER: your Gmail address
// - GMAIL_CLIENT_ID: from Google Cloud
// - GMAIL_CLIENT_SECRET: from Google Cloud
// - GMAIL_REFRESH_TOKEN: from Google Cloud
// - MAIL_FROM_NAME: optional display name

let transporter: nodemailer.Transporter | null = null

export function getMailer() {
  if (transporter) return transporter
  const user = process.env.GMAIL_USER
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN
  
  if (!user || !clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Gmail OAuth2 credentials in environment')
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
      type: 'OAuth2',
      user: user,
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken
    },
    tls: {
      rejectUnauthorized: false
    },
    pool: true,
    maxConnections: 10, // Increased from 5
    maxMessages: 200, // Increased from 100
    rateDelta: 500, // Reduced from 1000ms
    rateLimit: 10 // Increased from 5 emails per second
  })
  return transporter
}

export async function sendEmail(params: {
  to: string
  subject: string
  html?: string
  text?: string
  attachments?: { filename: string; content: Buffer; contentType?: string; cid?: string; contentDisposition?: 'attachment' | 'inline' }[]
}) {
  const fromName = process.env.MAIL_FROM_NAME || 'Absensi Sinergi'
  const from = `${fromName} <${process.env.GMAIL_USER}>`
  const mailer = getMailer()
  
  // Anti-spam headers
  const headers = {
    'X-Priority': '3',
    'X-Mailer': 'Absensi Sinergi System',
    'X-MSMail-Priority': 'Normal',
    'X-MimeOLE': 'Produced By Absensi Sinergi',
    'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
    'Precedence': 'bulk',
    'X-Auto-Response-Suppress': 'All',
    'X-Original-To': params.to,
    'X-Delivered-To': params.to
  }

  const info = await mailer.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text || params.html?.replace(/<[^>]*>/g, ''), // Auto-generate text from HTML
    attachments: params.attachments,
    headers
  })
  return info
}
