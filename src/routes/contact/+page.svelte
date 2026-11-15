<script lang="ts">
  import { enhance } from "$app/forms";
  import ContactVerification from "$lib/components/ContactVerification.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import SocialMeta from "$lib/components/SocialMeta.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  let submitting = $state(false);
  let verified = $state(false);
  let challengeVersion = $state(0);
  let messageLength = $state<number | null>(null);
</script>

<svelte:head><title>Contact | Renhet Studio</title></svelte:head>
<SocialMeta
  title="Contact | Renhet Studio"
  description="Write to Renhet Studio about our games, press, or collaborations. Send a note or email hello@renhetstudio.com."
  path="/contact"
/>

<main class="min-h-screen w-full bg-[#f6f1e8] text-[#4f5f70]">
  <SiteHeader />

  <section
    class="px-5 pt-28 pb-4 sm:px-8 sm:pt-36 md:pt-40 lg:px-10"
    aria-labelledby="contact-title"
  >
    <div class="mx-auto max-w-[1440px]">
      <h1
        id="contact-title"
        class="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-tight"
      >
        Contact.
      </h1>
      <OrganicDivider seed="contact-heading" class="mt-8 mb-0 sm:mt-12" />
    </div>
  </section>

  <section
    class="px-5 pt-6 pb-16 sm:px-8 sm:pt-10 sm:pb-24 lg:px-10"
    aria-labelledby="write-title"
  >
    <div
      class="mx-auto grid max-w-[1440px] items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20 xl:gap-32"
    >
      <div class="relative lg:sticky lg:top-28">
        <h2
          id="write-title"
          class="max-w-lg text-[clamp(2.6rem,5.5vw,5.5rem)] font-black leading-[0.94] tracking-tight"
        >
          A few words can<br />go a long way.
        </h2>
        <p
          class="mt-6 max-w-md text-lg font-bold leading-relaxed text-[#627383]"
        >
          We believe in the people and conversations behind what we make. Have
          something to say? We're all ears!
        </p>
        <div class="mt-9 sm:mt-12">
          <p class="text-sm font-bold text-[#627383]">
            More of an email person?
          </p>
          <a
            href="mailto:hello@renhetstudio.com"
            class="mt-2 inline-flex max-w-full items-center gap-2 text-[clamp(1rem,2vw,1.6rem)] font-black text-[#344253] underline decoration-[#8fb8d8] decoration-2 underline-offset-8 transition-colors hover:text-[#627383]"
          >
            <span class="break-all">hello@renhetstudio.com</span><IconArrow
              direction="up-right"
              size={18}
              class="shrink-0"
            />
          </a>
        </div>
        <p class="mt-9 text-sm font-bold leading-relaxed text-[#627383]">
          Want to make something that matters? <a
            href="/careers"
            class="font-black text-[#344253] underline underline-offset-4"
            >Explore our open roles.</a
          >
        </p>
      </div>

      <div class="min-w-0">
        {#if form?.status === "success"}
          <div class="py-6" role="status" tabindex="-1">
            <p class="text-sm font-bold text-[#627383]">Message sent</p>
            <h3
              class="mt-3 text-4xl font-black leading-tight tracking-tight text-[#344253] sm:text-5xl"
            >
              Your note is here.
            </h3>
            <p
              class="mt-5 max-w-lg text-lg font-bold leading-relaxed text-[#627383]"
            >
              {form.message}
            </p>
          </div>
        {:else}
          <form
            method="POST"
            aria-label="Contact Renhet Studio"
            aria-busy={submitting}
            use:enhance={({ cancel }) => {
              if (submitting || !verified) {
                cancel();
                return;
              }
              submitting = true;
              return async ({ update }) => {
                try {
                  await update({ reset: false });
                } finally {
                  submitting = false;
                  verified = false;
                  challengeVersion += 1;
                  messageLength = null;
                }
              };
            }}
          >
            <fieldset
              disabled={submitting || !data.contactAvailable}
              class="grid min-w-0 gap-7 disabled:opacity-70"
            >
              <legend class="sr-only">Your contact details and message</legend>
              <div class="grid gap-7 sm:grid-cols-2">
                <div>
                  <label for="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    name="name"
                    autocomplete="name"
                    required
                    maxlength="100"
                    placeholder="Your name"
                    value={form?.values?.name ?? ""}
                    aria-invalid={Boolean(form?.errors?.name)}
                    aria-describedby={form?.errors?.name
                      ? "name-error"
                      : undefined}
                  />
                  {#if form?.errors?.name}<p
                      id="name-error"
                      class="form-error mt-2 text-sm"
                    >
                      {form.errors.name[0]}
                    </p>{/if}
                </div>
                <div>
                  <label for="contact-email">Your email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    maxlength="254"
                    placeholder="you@example.com"
                    value={form?.values?.email ?? ""}
                    aria-invalid={Boolean(form?.errors?.email)}
                    aria-describedby={form?.errors?.email
                      ? "email-error"
                      : undefined}
                  />
                  {#if form?.errors?.email}<p
                      id="email-error"
                      class="form-error mt-2 text-sm"
                    >
                      {form.errors.email[0]}
                    </p>{/if}
                </div>
              </div>
              <div>
                <label for="contact-message">Your message</label>
                <div class="relative">
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minlength="10"
                    maxlength="3000"
                    rows="7"
                    placeholder="Tell us what you have in mind."
                    value={form?.values?.message ?? ""}
                    oninput={(event) =>
                      (messageLength = event.currentTarget.value.length)}
                    aria-invalid={Boolean(form?.errors?.message)}
                    aria-describedby={form?.errors?.message
                      ? "message-hint message-error"
                      : "message-hint"}></textarea>
                  <span
                    id="message-hint"
                    class="pointer-events-none absolute right-5 bottom-4 text-xs font-bold tabular-nums text-[#627383]"
                    >{messageLength ?? form?.values?.message?.length ?? 0} / 3,000<span
                      class="sr-only"
                    >
                      characters. Minimum 10 characters.</span
                    ></span
                  >
                </div>
                {#if form?.errors?.message}<p
                    id="message-error"
                    class="form-error mt-2 text-sm"
                  >
                    {form.errors.message[0]}
                  </p>{/if}
              </div>
              <div class="honeypot" aria-hidden="true">
                <label for="contact-website">Leave this field empty</label>
                <input
                  id="contact-website"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>
              {#if data.contactAvailable}
                {#key challengeVersion}
                  <ContactVerification
                    siteKey={data.turnstileSiteKey}
                    onverified={(value) => (verified = value)}
                  />
                {/key}
              {/if}
              <p class="text-sm font-bold leading-relaxed text-[#627383]">
                Your details are used to reply to your message. No mailing
                lists.
              </p>
              <button
                type="submit"
                disabled={!verified || submitting}
                class="inline-flex min-h-[52px] w-fit items-center justify-center gap-3 rounded-full bg-[#4f5f70] px-8 py-3 text-base font-black text-[#fffdf3] transition-colors hover:bg-[#344253] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending your note..." : "Send message"}<IconArrow
                  direction="right"
                  size={16}
                />
              </button>
            </fieldset>
            {#if form?.status === "error"}<p
                class="form-error mt-5 text-sm leading-relaxed"
                role="alert"
              >
                {form.message}
              </p>{/if}
            {#if !data.contactAvailable}<p
                class="mt-5 text-sm font-bold leading-relaxed text-[#627383]"
                role="status"
              >
                The form is temporarily unavailable. Email <a
                  href="mailto:hello@renhetstudio.com"
                  class="underline underline-offset-4">hello@renhetstudio.com</a
                > to get in touch.
              </p>{/if}
            <noscript
              ><p class="mt-5 text-sm font-bold">
                Enable JavaScript to complete the security check, or email <a
                  href="mailto:hello@renhetstudio.com">hello@renhetstudio.com</a
                >.
              </p></noscript
            >
          </form>
        {/if}
      </div>
    </div>
  </section>
  <SiteFooter />
</main>

<style>
  label {
    display: block;
    margin-bottom: 0.65rem;
    font-size: 0.9rem;
    font-weight: 800;
    color: #344253;
  }
  input,
  textarea {
    width: 100%;
    min-width: 0;
    border: 2px solid #d6d5ca;
    border-radius: 0.85rem;
    background: #fffdf3;
    padding: 0.9rem 1rem;
    color: #344253;
    font: inherit;
    font-weight: 600;
    transition: border-color 160ms;
  }
  textarea {
    display: block;
    resize: vertical;
    min-height: 12rem;
    padding-bottom: 2.75rem;
  }
  input::placeholder,
  textarea::placeholder {
    color: #627383;
    font-weight: 700;
  }
  input:focus-visible,
  textarea:focus-visible {
    border-color: #4f5f70;
    outline: 3px solid #8fb8d8;
    outline-offset: 3px;
  }
  [aria-invalid="true"] {
    border-color: #9a3e45;
  }
  .honeypot {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
