import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [usernameClient()],
    baseURL: 'https://mubtadiat-db.eppds.workers.dev/api/auth',
    fetchOptions: {
        onRequest: (context) => {
            const token = localStorage.getItem("better-auth.session_token");
            if (token) {
                if (!context.headers) {
                    context.headers = new Headers();
                }
                if (context.headers instanceof Headers) {
                    context.headers.set("Authorization", `Bearer ${token}`);
                } else {
                    (context.headers as any)["Authorization"] = `Bearer ${token}`;
                }
            }
            return context;
        },
        onResponse: async (context) => {
            try {
                const url = context.response.url;
                if (url.includes('/sign-in/email') || url.includes('/sign-up/email') || url.includes('/sign-in/username') || url.includes('/sign-up/username')) {
                    const clonedResponse = context.response.clone();
                    const body = await clonedResponse.json();
                    if (body && body.token) {
                        localStorage.setItem("better-auth.session_token", body.token);
                    }
                } else if (url.includes('/sign-out')) {
                    localStorage.removeItem("better-auth.session_token");
                    localStorage.removeItem("FORCE_PASSWORD_CHANGE");
                }
            } catch (e) {
                console.error("Error parsing auth token response:", e);
            }
            return context;
        }
    }
});

export const { signIn, signUp, signOut, useSession } = authClient;
