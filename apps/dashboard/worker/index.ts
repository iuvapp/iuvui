import { createClerkClient } from "@clerk/backend";

interface Env {
  APP_ORIGIN?: string;
  CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
}

function json(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("cache-control", "no-store");

  return Response.json(body, {
    ...init,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "iuvui-dashboard" });
    }

    if (url.pathname === "/api/session") {
      if (!env.CLERK_PUBLISHABLE_KEY || !env.CLERK_SECRET_KEY) {
        return json(
          { error: "Clerk is not configured on the Worker." },
          { status: 503 },
        );
      }

      const clerk = createClerkClient({
        publishableKey: env.CLERK_PUBLISHABLE_KEY,
        secretKey: env.CLERK_SECRET_KEY,
      });
      const state = await clerk.authenticateRequest(request, {
        authorizedParties: [env.APP_ORIGIN ?? url.origin],
      });

      if (!state.isAuthenticated) {
        return json(
          { error: "Unauthorized" },
          { status: 401, headers: state.headers },
        );
      }

      const auth = state.toAuth();
      return json({
        authenticated: true,
        organizationId: auth.orgId,
        sessionId: auth.sessionId,
        userId: auth.userId,
      });
    }

    return json({ error: "Not found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
