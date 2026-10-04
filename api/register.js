import { createSign } from 'node:crypto'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const MAX_BODY_BYTES = 20_000
const GDPR_CONSENT_TEXT =
  'Yes, I explicitly consent to the Watford Vel Murugan Trust storing and processing my personal details to manage my connection with the temple in accordance with the privacy statement above.'
const YES_UPDATES_PREFERENCE = 'Yes, I would like to receive updates.'
const NO_UPDATES_PREFERENCE =
  'No, I only wish to register my data and do not want updates.'
const UPDATES_PREFERENCES = new Set([YES_UPDATES_PREFERENCE, NO_UPDATES_PREFERENCE])
const COMMUNICATION_OPTIONS = new Set([
  'Email',
  'WhatsApp / Text Message',
])

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
  if (!response.ok) {
    const reason = data.error_description || data.error || 'Unknown Google authentication error'
    throw new Error(`Google authentication failed (${response.status}): ${reason}`)
  }

  if (!data.access_token) {
    throw new Error('Google authentication returned no access token')
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

function quoteSheetName(sheetName) {
  return `'${sheetName.replaceAll("'", "''")}'`
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

function validateRegistration(body) {
  const updatesPreference = cleanText(body.updatesPreference, 100)
  let communicationPreferences = Array.isArray(body.communicationPreferences)
    ? body.communicationPreferences
        .map((value) => cleanText(value, 100))
        .filter((value) => COMMUNICATION_OPTIONS.has(value))
    : []

  communicationPreferences = [...new Set(communicationPreferences)]
  if (updatesPreference !== YES_UPDATES_PREFERENCE) {
    communicationPreferences = []
  }

  const registration = {
    fullName: cleanText(body.fullName, 150),
    email: cleanText(body.email, 254).toLowerCase(),
    postcode: cleanText(body.postcode, 20).toUpperCase(),
    phone: cleanText(body.phone, 40),
    address: cleanText(body.address, 500),
    comments: cleanText(body.comments, 2_000),
    gdprConsent: body.gdprConsent === true,
    updatesPreference,
    communicationPreferences,
    website: cleanText(body.website, 200),
  }

  if (registration.website) {
    return { bot: true, registration }
  }

  if (!registration.fullName || !registration.email || !registration.postcode || !registration.phone) {
    return { error: 'Full name, email, postcode and phone number are required.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)) {
    return { error: 'Please enter a valid email address.' }
  }

  if (!registration.gdprConsent) {
    return { error: 'You must provide UK GDPR consent to register.' }
  }

  if (
    registration.updatesPreference &&
    !UPDATES_PREFERENCES.has(registration.updatesPreference)
  ) {
    return { error: 'Please choose whether you would like to receive temple updates.' }
  }

  if (
    registration.updatesPreference === YES_UPDATES_PREFERENCE &&
    registration.communicationPreferences.length === 0
  ) {
    return { error: 'Please select at least one way to receive temple updates.' }
  }

  return { registration }
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

  const validation = validateRegistration(body)
  if (validation.error) {
    return sendJson(res, 400, { success: false, message: validation.error })
  }

  // Silently accept honeypot submissions without writing them to the sheet.
  if (validation.bot) {
    return sendJson(res, 200, { success: true })
  }

  // Vite supplies registrationEnv only in local development. Vercel uses the
  // server-side process environment in production.
  const runtimeEnv = req.registrationEnv || process.env
  const clientEmail = runtimeEnv.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = runtimeEnv.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const spreadsheetId = runtimeEnv.GOOGLE_SPREADSHEET_ID
  const sheetName = runtimeEnv.GOOGLE_SHEET_NAME || 'Form Responses 1'
  
  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error('Registration API is missing Google Sheets environment variables')
    return sendJson(res, 503, {
      success: false,
      message: 'Registration is temporarily unavailable. Please try again later.',
    })
  }

  const {
    fullName,
    email,
    address,
    postcode,
    phone,
    comments,
    gdprConsent,
    updatesPreference,
    communicationPreferences,
  } = validation.registration
  const range = `${quoteSheetName(sheetName)}!A:J`

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
        values: [
          [
            formatTimestamp(),
            fullName,
            email,
            address,
            phone,
            comments,
            postcode,
            gdprConsent ? GDPR_CONSENT_TEXT : '',
            updatesPreference,
            communicationPreferences.join(', '),
          ],
        ],
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const reason = data.error?.message || 'Unknown Google Sheets error'
      throw new Error(`Google Sheets append failed (${response.status}): ${reason}`)
    }

    return sendJson(res, 200, { success: true })
  } catch (error) {
    console.error('Registration append failed:', error instanceof Error ? error.message : error)
    return sendJson(res, 502, {
      success: false,
      message: 'Your registration could not be saved. Please try again.',
    })
  }
}
