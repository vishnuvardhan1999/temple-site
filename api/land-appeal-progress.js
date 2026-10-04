import { landAppeal } from '../src/data/temple.js'

const ZEFFY_API_BASE_URL = 'https://api.zeffy.com/api/v1'
const MAX_CAMPAIGN_PAGES = 20

function sendJson(res, status, body, cacheControl = 'no-store') {
  res.setHeader('Cache-Control', cacheControl)
  return res.status(status).json(body)
}

function campaignSlug(value) {
  try {
    const parts = new URL(value).pathname.split('/').filter(Boolean)
    return decodeURIComponent(parts.at(-1) || '').toLowerCase()
  } catch {
    return ''
  }
}

async function fetchZeffy(path, apiKey) {
  const response = await fetch(`${ZEFFY_API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const reason = data.message || data.error?.message || data.code || 'Unknown Zeffy API error'
    throw new Error(`Zeffy API request failed (${response.status}): ${reason}`)
  }

  return data
}

async function findCampaign(apiKey, campaignId) {
  if (campaignId) {
    return fetchZeffy(`/campaigns/${encodeURIComponent(campaignId)}`, apiKey)
  }

  const expectedSlug = campaignSlug(landAppeal.url)
  let cursor = ''

  for (let page = 0; page < MAX_CAMPAIGN_PAGES; page += 1) {
    const query = new URLSearchParams({ limit: '100' })
    if (cursor) query.set('starting_after', cursor)

    const result = await fetchZeffy(`/campaigns?${query}`, apiKey)
    const campaign = result.data?.find(
      (item) => item.type === 'donation_form' && campaignSlug(item.url) === expectedSlug,
    )

    if (campaign) return campaign
    if (!result.has_more || !result.next_cursor) return null
    cursor = result.next_cursor
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { success: false, message: 'Method not allowed.' })
  }

  // Vite supplies zeffyEnv only in local development. Vercel uses the
  // server-side process environment in production.
  const runtimeEnv = req.zeffyEnv || process.env
  const apiKey = runtimeEnv.ZEFFY_API_KEY
  const campaignId = runtimeEnv.ZEFFY_CAMPAIGN_ID

  if (!apiKey) {
    return sendJson(res, 503, {
      success: false,
      message: 'Fundraising progress is not configured.',
    })
  }

  try {
    const campaign = await findCampaign(apiKey, campaignId)
    if (!campaign) {
      return sendJson(res, 404, {
        success: false,
        message: 'The Zeffy land appeal campaign could not be found.',
      })
    }

    const raisedInCents = Number(campaign.volume)
    const goalInCents = Number(campaign.goal_amount ?? campaign.target)

    if (!Number.isFinite(raisedInCents) || !Number.isFinite(goalInCents) || goalInCents <= 0) {
      throw new Error('Zeffy returned invalid fundraising progress values')
    }

    return sendJson(
      res,
      200,
      {
        success: true,
        raised: Math.max(0, raisedInCents) / 100,
        goal: goalInCents / 100,
        currency: String(campaign.currency || 'gbp').toUpperCase(),
        updatedAt: new Date(Number(campaign.updated) * 1000).toISOString(),
      },
      'public, s-maxage=300, stale-while-revalidate=600',
    )
  } catch (error) {
    console.error('Land appeal progress failed:', error instanceof Error ? error.message : error)
    return sendJson(res, 502, {
      success: false,
      message: 'Fundraising progress is temporarily unavailable.',
    })
  }
}
