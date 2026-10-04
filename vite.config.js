import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import landAppealProgressHandler from './api/land-appeal-progress.js'
import registerHandler from './api/register.js'
import consentHandler from './api/consent.js'

const SERVER_ENV_KEYS = [
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_SPREADSHEET_ID',
  'GOOGLE_SHEET_NAME',
  'ZEFFY_API_KEY',
  'ZEFFY_CAMPAIGN_ID',
]

function loadServerEnv(mode) {
  // loadEnv gives existing process variables precedence over .env files. Vite
  // can restart its config in the same process, so temporarily remove values
  // injected by an earlier run and prefer the current .env.local contents.
  const inheritedEnv = {}
  for (const key of SERVER_ENV_KEYS) {
    inheritedEnv[key] = process.env[key]
    delete process.env[key]
  }

  const fileEnv = loadEnv(mode, process.cwd(), '')

  for (const key of SERVER_ENV_KEYS) {
    if (inheritedEnv[key] === undefined) delete process.env[key]
    else process.env[key] = inheritedEnv[key]
  }

  return Object.fromEntries(
    SERVER_ENV_KEYS.map((key) => [key, fileEnv[key] || inheritedEnv[key] || '']),
  )
}

function addVercelResponseHelpers(res) {
  res.status = function status(statusCode) {
    this.statusCode = statusCode
    return this
  }
  res.json = function json(payload) {
    if (!this.headersSent) this.setHeader('Content-Type', 'application/json; charset=utf-8')
    this.end(JSON.stringify(payload))
    return this
  }
}

function serverApiDevPlugin(serverEnv) {
  return {
    name: 'server-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/land-appeal-progress', async (req, res, next) => {
        addVercelResponseHelpers(res)

        try {
          req.zeffyEnv = serverEnv
          await landAppealProgressHandler(req, res)
        } catch (error) {
          next(error)
        }
      })

      server.middlewares.use('/api/consent', async (req, res, next) => {
        addVercelResponseHelpers(res)

        try {
          req.registrationEnv = serverEnv

          if (req.method === 'POST' && Number(req.headers['content-length'] || 0) <= 20_000) {
            const chunks = []
            for await (const chunk of req) chunks.push(chunk)
            req.body = Buffer.concat(chunks).toString('utf8')
          }

          await consentHandler(req, res)
        } catch (error) {
          next(error)
        }
      })

      server.middlewares.use('/api/register', async (req, res, next) => {
        // Vercel supplies these response helpers in production. Add compatible
        // versions when the endpoint runs inside Vite's development server.
        addVercelResponseHelpers(res)

        try {
          req.registrationEnv = serverEnv

          if (req.method === 'POST' && Number(req.headers['content-length'] || 0) <= 20_000) {
            const chunks = []
            for await (const chunk of req) chunks.push(chunk)
            req.body = Buffer.concat(chunks).toString('utf8')
          }

          await registerHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite normally exposes only VITE_-prefixed values. Load the server-only
  // registration settings for the development middleware without exposing
  // them to the browser bundle.
  const serverEnv = loadServerEnv(mode)

  return {
    plugins: [vue(), serverApiDevPlugin(serverEnv)],
  }
})
