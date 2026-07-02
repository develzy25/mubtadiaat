import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.DEV 
      ? 'http://localhost:8787/api/auth' 
      : 'https://backend.eppds.workers.dev/api/auth'
});

export const { signIn, signUp, signOut, useSession } = authClient;
