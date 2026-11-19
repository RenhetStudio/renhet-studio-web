import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";

process.env.PUBLIC_SUPABASE_URL = "https://newsletter-test.supabase.co";
process.env.PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.PUBLIC_ENABLE_COMMENTS = "true";
const originalFetch = globalThis.fetch;
let calls = [];
globalThis.fetch = async (input, options) => {
  calls.push({ url: String(input), ...options });
  return new Response(null, { status: 204 });
};
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
after(async () => { globalThis.fetch = originalFetch; await server.close(); });
const { POST } = await server.ssrLoadModule("/src/routes/api/newsletter/+server.ts");
const { load: loadAccount, actions: accountActions } = await server.ssrLoadModule("/src/routes/account/+page.server.ts");

function submit(body, options = {}) {
  return POST({
    request: new Request("https://www.renhetstudio.com/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "https://www.renhetstudio.com", ...options.headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    url: new URL("https://www.renhetstudio.com/api/newsletter"),
  });
}

test("loading the endpoint performs no database request", () => {
  assert.equal(calls.length, 0);
});

test("invalid email, malformed JSON, oversized and cross-origin requests never reach the database", async () => {
  for (const [body, options, status] of [
    [{ email: "invalid" }, {}, 400],
    [null, {}, 400],
    ["{", {}, 400],
    [{ email: "a".repeat(1025) }, {}, 413],
    [{ email: "alex@example.com" }, { headers: { origin: "https://other.example" } }, 403],
    [{ email: "alex@example.com" }, { headers: { "Content-Type": "text/plain" } }, 415],
  ]) {
    assert.equal((await submit(body, options)).status, status);
  }
  assert.equal(calls.length, 0);
});

test("honeypot confirms without storing anything", async () => {
  assert.equal((await submit({ email: "bot@example.com", website: "spam.example" })).status, 200);
  assert.equal(calls.length, 0);
});

test("explicit submissions normalize email and use only the insert-only RPC", async () => {
  const first = await submit({ email: " Alex@Example.COM " });
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("Cache-Control"), "private, no-store");
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/rest\/v1\/rpc\/subscribe_newsletter$/);
  assert.equal(calls[0].method, "POST");
  assert.deepEqual(JSON.parse(calls[0].body), { subscriber_email: "alex@example.com" });
  const duplicate = await submit({ email: "alex@example.com" });
  assert.deepEqual(await duplicate.json(), await first.json());
});

test("database failures never produce a successful confirmation", async () => {
  calls = [];
  globalThis.fetch = async () => Response.json({ code: "42883", message: "Missing RPC" }, { status: 404 });
  const result = await submit({ email: "alex@example.com" });
  assert.equal(result.status, 503);
  assert.match((await result.json()).message, /couldn't subscribe/);
});

function accountFixture({ user = { id: "reader-id" }, newsletterError = null, verified = true } = {}) {
  let subscribed = true;
  const requests = [];
  const locals = {
    supabase: {
      auth: { getUser: async () => ({ data: { user } }) },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: { id: user.id, display_name: "Reader", role: "reader" } }),
          }),
        }),
      }),
      rpc: (name, args) => ({
        abortSignal: async () => {
          requests.push({ name, args });
          if (newsletterError || !verified) return { data: null, error: newsletterError };
          subscribed = args.subscribe ?? subscribed;
          return { data: { email: "reader@example.invalid", subscribed }, error: null };
        },
      }),
    },
  };

  return {
    requests,
    load: (setHeaders) => loadAccount({ locals, setHeaders }),
    submit: (preference) => accountActions.default({
      locals,
      request: new Request("https://www.renhetstudio.com/account", {
        method: "POST",
        body: new URLSearchParams({ newsletterPreference: preference }),
      }),
    }),
  };
}

test("account settings use private reads and set an explicit preference for the session email", async () => {
  const account = accountFixture();
  const page = await account.load((headers) => {
    assert.equal(headers["Cache-Control"], "private, no-store");
  });
  assert.deepEqual(page.newsletter, { status: "ready", email: "reader@example.invalid", subscribed: true });
  assert.equal((await account.submit("unsubscribe")).newsletter.subscribed, false);
  assert.equal((await account.submit("subscribe")).newsletter.subscribed, true);
  assert.deepEqual(account.requests, [
    { name: "manage_my_newsletter_subscription", args: {} },
    { name: "manage_my_newsletter_subscription", args: { subscribe: false } },
    { name: "manage_my_newsletter_subscription", args: { subscribe: true } },
  ]);
});

test("account changes need an authenticated profile, a valid preference and a confirmed email", async () => {
  const signedOut = accountFixture({ user: null });
  assert.equal((await signedOut.submit("unsubscribe")).status, 403);
  assert.deepEqual(signedOut.requests, []);

  const invalid = accountFixture();
  assert.equal((await invalid.submit("toggle")).status, 400);
  assert.deepEqual(invalid.requests, []);

  const unverified = accountFixture({ verified: false });
  assert.equal((await unverified.load(() => {})).newsletter.status, "unverified");
  assert.equal((await unverified.submit("subscribe")).status, 403);
});

test("an unavailable newsletter RPC keeps the profile usable and reports a failed update", async () => {
  const account = accountFixture({ newsletterError: { code: "PGRST202" } });
  const page = await account.load(() => {});
  assert.equal(page.profile.display_name, "Reader");
  assert.equal(page.newsletter.status, "unavailable");
  const failure = await account.submit("unsubscribe");
  assert.equal(failure.status, 503);
  assert.equal(failure.data.newsletter.ok, false);
});
