import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import { getAuth } from '../lib/auth';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardService } from '../services/dashboard.service';

export const getSummary = async (c: Context) => {
  try {
    const auth = getAuth(
      {
        DB: c.env.DB,
        BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: c.env.BETTER_AUTH_URL,
      },
      c.req.url
    );

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session || !session.user) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const userId = session.user.id;
    const userName = session.user.name;

    const db = drizzle(c.env.DB, { schema });
    const repo = new DashboardRepository(db);
    const service = new DashboardService(repo);
    
    const monthStr = c.req.query('month');
    const summary = await service.getDashboardSummary(userId, monthStr);
    
    return c.json({
      success: true,
      data: {
        userName,
        ...summary
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
};
