import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import { bearer } from 'better-auth/plugins';
import { username } from 'better-auth/plugins';

// This function returns the betterAuth instance configured with the D1 database binding
export const getAuth = (
  env: { DB: D1Database; BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string },
  requestUrl?: string,
  requestOrigin?: string
) => {
  const db = drizzle(env.DB, { schema });

  // Dynamically set baseURL if requestUrl is provided to support localhost and deployed dev url simultaneously
  let finalBaseURL = env.BETTER_AUTH_URL;
  if (requestUrl) {
    const urlObj = new URL(requestUrl);
    // baseURL must point to the base auth endpoint (e.g. https://domain.com/api/auth)
    finalBaseURL = `${urlObj.origin}/api/auth`;
  }
  
  const origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8081',
    'https://mubtadiaat.pages.dev'
  ];

  if (requestUrl) {
    try {
      const urlObj = new URL(requestUrl);
      const origin = urlObj.origin;
      if (!origins.includes(origin)) {
        origins.push(origin);
      }
    } catch (_) {}
  }
  
  // Dynamically trust any preview branch from Cloudflare Pages
  if (requestOrigin && requestOrigin.endsWith('.pages.dev') && !origins.includes(requestOrigin)) {
    origins.push(requestOrigin);
  }

  console.log("BETTER_AUTH config baseURL:", finalBaseURL, "trustedOrigins:", origins);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite', // using d1 sqlite
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "number",
          required: false,
          defaultValue: 4
        }
      }
    },
    plugins: [
      bearer(),
      username(),
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: true
      }
    },
    trustedOrigins: origins,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: finalBaseURL,
  });
};
