import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";

// All provider requests are intercepted. These credentials cannot send email.
process.env.RESEND_API_KEY = "test-contact-key";
process.env.CONTACT_FROM_EMAIL = "Renhet Studio <no-reply@renhetstudio.com>";
process.env.CONTACT_TO_EMAIL = "contact-inbox@example.com";
process.env.TURNSTILE_SITE_KEY = "test-site-key";
process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
after(() => server.close());
const { actions, load } = await server.ssrLoadModule("/src/routes/contact/+page.server.ts");
const { createOwnerEmail, createConfirmationEmail } = await server.ssrLoadModule("/src/lib/server/contact-email.ts");
const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });
const valid = { name: "Alex", email: "alex@example.com", message: "Hello from a contact form test.", "cf-turnstile-response": "test-token" };

function submit(overrides = {}, headers = {}) {
  return actions.default({
    request: new Request("https://www.renhetstudio.com/contact", { method: "POST", headers, body: new URLSearchParams({ ...valid, ...overrides }) }),
    url: new URL("https://www.renhetstudio.com/contact"),
    setHeaders: (headers) => assert.equal(headers["Cache-Control"], "private, no-store"),
  });
}

test("invalid fields and honeypot never reach providers", async () => {
  globalThis.fetch = () => { throw new Error("Unexpected provider request"); };
  const invalid = await submit({ name: "Alex\r\nInjected", email: "invalid", message: "short" });
  assert.equal(invalid.status, 400);
  assert.ok(invalid.data.errors.email);
  assert.ok(invalid.data.errors.name);
  assert.ok(invalid.data.errors.message);
  assert.equal((await submit({ website: "bot.example" })).status, "success");
  assert.equal((await submit({}, { "content-length": "25000" })).status, 413);
  assert.equal((await submit({ "cf-turnstile-response": "" })).status, 400);
});

test("Turnstile must validate success, hostname and action before Resend", async () => {
  for (const result of [
    { success: false },
    { success: true, hostname: "evil.example", action: "contact" },
    { success: true, hostname: "www.renhetstudio.com", action: "login" },
  ]) {
    globalThis.fetch = async (url) => {
      assert.match(String(url), /siteverify$/);
      return Response.json(result);
    };
    assert.equal((await submit()).status, 400);
  }
});

test("verified submission sends two branded emails with correct reply addresses", async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), ...options });
    return Response.json(String(url).includes("siteverify")
      ? { success: true, hostname: "www.renhetstudio.com", action: "contact" }
      : { data: [{ id: "owner" }, { id: "confirmation" }] });
  };
  assert.equal((await submit()).status, "success");
  assert.equal(requests.length, 2);
  const emails = JSON.parse(requests[1].body);
  assert.deepEqual(emails[0].to, ["contact-inbox@example.com"]);
  assert.equal(emails[0].reply_to, valid.email);
  assert.deepEqual(emails[1].to, [valid.email]);
  assert.equal(emails[1].reply_to, "hello@renhetstudio.com");
  for (const email of emails) {
    assert.match(email.html, /renhet-logo-white\.png/);
    assert.match(email.html, /#f6f1e8/);
    assert.ok(email.text);
  }
});

test("provider failures retain input and do not report success", async () => {
  globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
  const verificationFailure = await submit();
  assert.equal(verificationFailure.status, 503);
  assert.equal(verificationFailure.data.values.message, valid.message);
  globalThis.fetch = async (url) => String(url).includes("siteverify")
    ? Response.json({ success: true, hostname: "www.renhetstudio.com", action: "contact" })
    : new Response("Rejected", { status: 422 });
  assert.equal((await submit()).status, 503);
});

test("templates escape visitor HTML and preserve message line breaks", () => {
  const data = { name: '<img src=x onerror="alert(1)">', email: valid.email, message: "<script>alert(1)</script>\nSecond line & text" };
  const owner = createOwnerEmail(data);
  assert.ok(!owner.html.includes("<script>"));
  assert.match(owner.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>Second line &amp; text/);
  assert.match(createConfirmationEmail(data).html, /&lt;img/);
  const confirmation = createConfirmationEmail(data);
  assert.match(confirmation.html, /Please do not reply to this automated email/);
  assert.match(confirmation.text, /Please do not reply to this automated email/);
  assert.match(confirmation.html, /href="mailto:hello@renhetstudio.com"/);
});

test("page is private and exposes only the public Turnstile key", () => {
  let headers;
  const data = load({ setHeaders: (value) => { headers = value; } });
  assert.equal(headers["Cache-Control"], "private, no-store");
  assert.deepEqual(data, { contactAvailable: true, turnstileSiteKey: "test-site-key" });
});
