import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { initDb } from './db/index';

import adminRoutes from './routes/admin.routes';
import mobileRoutes from './routes/mobile.routes';

const app = new Hono<{ Bindings: any }>();

app.use('*', async (c, next) => {
  initDb(c.env.DB);
  await next();
});

app.use('*', logger());
app.use('*', prettyJSON());

app.use('/api/*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-role'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/api/admin', adminRoutes);
app.route('/api/mobile', mobileRoutes);

import { getAuth } from './lib/auth.js';
import { eq } from 'drizzle-orm';
import * as schema from './db/schema.js';
import { drizzle } from 'drizzle-orm/d1';

app.post('/api/auth/mobile-login', async (c) => {
  console.log("MOBILE LOGIN REQUEST");
  const auth = getAuth(c.env, c.req.url);
  try {
    const body = await c.req.json();
    const db = drizzle(c.env.DB, { schema });
    
    // Find user's email based on the username
    const user = await db.select().from(schema.users).where(eq(schema.users.username, body.username)).get();
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const headers = new Headers(c.req.raw.headers);
    // Use the native signInEmail with the mapped email
    const res = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: body.password
      },
      headers: headers
    });
    return c.json({ user: res.user, session: { token: res.token } });
  } catch (err: any) {
    console.error("Login error:", err);
    return c.json({ error: err.message || "Invalid credentials" }, 401);
  }
});

app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  console.log("AUTH REQUEST:", c.req.url, c.req.method);
  const auth = getAuth(c.env, c.req.url);
  return auth.handler(c.req.raw);
});

// Export for Cloudflare Workers
export default {
  fetch(request: Request, env: any, ctx: ExecutionContext) {
    // Inject D1 connection into global state or pass via Hono context if needed
    // The current db.ts architecture uses a generic approach. Let's make sure it's valid.
    return app.fetch(request, env, ctx);
  }
};
