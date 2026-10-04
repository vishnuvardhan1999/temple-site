import { createSign } from 'node:crypto'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const MAX_BODY_BYTES = 20_000
const CONSENT_SHEET = 'Consent'
const CONSENT_GIVEN = 'Consent given'

function sendJson(res, status, body) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

function base64Url(value) {
  return Buffer.from(value).toString('base64url')
}

function createServiceAccountJwt(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  )
  const unsignedToken = `${header}.${claims}`
  const signer = createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()

  return `${unsignedToken}.${signer.sign(privateKey, 'base64url')}`
}

async function getGoogleAccessToken(clientEmail, privateKey) {
  const assertion = createServiceAccountJwt(clientEmail, privateKey)
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.access_token) {
    const reason = data.error_description || data.error || 'Unknown Google authentication error'
    throw new Error(`Google authentication failed (${response.status}): ${reason}`)
  }

  return data.access_token
}

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') return JSON.parse(req.body)
  return req.body
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function formatTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(date)
    .reduce((result, part) => ({ ...result, [part.type]: part.value }), {})

  return `${parts.month}/${parts.day}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`
}

function validateConsent(body) {
  const consent = {
    name: cleanText(body.name, 150),
    phone: cleanText(body.phone, 40),
    email: cleanText(body.email, 254).toLowerCase(),
    website: cleanText(body.website, 200),
  }

  if (consent.website) {
    return { bot: true, consent }
  }

  if (!consent.name || !consent.phone || !consent.email) {
    return { error: 'Name, phone number and email are required.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consent.email)) {
    return { error: 'Please enter a valid email address.' }
  }

  if (body.agreed !== true) {
    return { error: 'Please tick I agree.' }
  }

  return { consent }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { success: false, message: 'Method not allowed.' })
  }

  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return sendJson(res, 413, { success: false, message: 'Request is too large.' })
  }

  let body
  try {
    body = parseBody(req)
  } catch {
    return sendJson(res, 400, { success: false, message: 'Invalid request body.' })
  }

  const validation = validateConsent(body)
  if (validation.error) {
    return sendJson(res, 400, { success: false, message: validation.error })
  }

  if (validation.bot) {
    return sendJson(res, 200, { success: true })
  }

  const runtimeEnv = req.registrationEnv || process.env
  const clientEmail = runtimeEnv.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = runtimeEnv.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const spreadsheetId = runtimeEnv.GOOGLE_SPREADSHEET_ID

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error('Consent API is missing Google Sheets environment variables')
    return sendJson(res, 503, {
      success: false,
      message: 'Consent is temporarily unavailable. Please try again later.',
    })
  }

  const range = `'${CONSENT_SHEET}'!A:E`

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey)
    const appendUrl =
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}` +
      `/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values: [[formatTimestamp(), validation.consent.name, validation.consent.phone, validation.consent.email, CONSENT_GIVEN]],
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const reason = data.error?.message || 'Unknown Google Sheets error'
      throw new Error(`Google Sheets append failed (${response.status}): ${reason}`)
    }

    return sendJson(res, 200, { success: true })
  } catch (error) {
    console.error('Consent append failed:', error instanceof Error ? error.message : error)
    return sendJson(res, 502, {
      success: false,
      message: 'Your consent could not be saved. Please try again.',
    })
  }
}
