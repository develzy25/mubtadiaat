import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import adminRoutes from './routes/admin.routes';
const app = new Hono();
app.use('*', logger());
app.use('*', prettyJSON());
app.use('/api/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.route('/api/admin', adminRoutes);
// Export for Cloudflare Workers
export default {
    fetch(request, env, ctx) {
        // Inject D1 connection into global state or pass via Hono context if needed
        // The current db.ts architecture uses a generic approach. Let's make sure it's valid.
        return app.fetch(request, env, ctx);
    }
};
