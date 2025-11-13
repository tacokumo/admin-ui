import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { projectService } from './services/ProjectService.js'

const app = new Hono()
app.use(cors({
    origin: 'https://localhost:8443',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Authorization'],
    maxAge: 86400,
    credentials: true,
}));
app.use(logger());

app.get('/', (c) => {
  return c.text('Admin API Mock Server')
})

// ヘルスチェックエンドポイント
app.get('/v1alpha1/health/liveness', (c) => {
  return c.json({ status: 'alive' })
})

app.get('/v1alpha1/health/readiness', (c) => {
  return c.json({ status: 'ready' })
})

// プロジェクトエンドポイント
app.get('/v1alpha1/projects', (c) => {
  const limit = parseInt(c.req.query('limit') || '10')
  const offset = parseInt(c.req.query('offset') || '0')

  const projects = projectService.getProjects(limit, offset)
  return c.json(projects)
})

app.post('/v1alpha1/projects', async (c) => {
  try {
    const body = await c.req.json()
    const project = projectService.createProject(body.name, body.bio)
    return c.json(project, 201)
  } catch (error) {
    return c.json({ error: 'Bad request' }, 400)
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
