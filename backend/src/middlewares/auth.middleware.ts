import { Context, Next } from 'hono';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // try to get from cookie
    const cookie = c.req.header('cookie');
    if (cookie) {
      const match = cookie.match(/better-auth\.session_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) {
    return c.json({ success: false, message: 'Unauthorized: No token provided' }, 401);
  }

  try {
    const session = await db.select().from(schema.sessions).where(eq(schema.sessions.token, token)).get();
    
    if (!session) {
      return c.json({ success: false, message: 'Unauthorized: Invalid token' }, 401);
    }

    if (session.expiresAt < new Date()) {
       return c.json({ success: false, message: 'Unauthorized: Token expired' }, 401);
    }

    const user = await db.select().from(schema.users).where(eq(schema.users.id, session.userId)).get();
    if (!user) {
      return c.json({ success: false, message: 'Unauthorized: User not found' }, 401);
    }

    // Pass user to context
    c.set('userId', user.id);
    c.set('userRole', user.role);
    c.set('user', user);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ success: false, message: 'Internal server error during authentication' }, 500);
  }
};
