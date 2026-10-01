<script lang="ts">
  import { enhance } from "$app/forms";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import type { PageProps } from "./$types";
  let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Careers | Renhet Studio</title><meta name="description" content="Join Renhet Studio and help us build friendly, detailed game worlds." /><link rel="canonical" href="https://www.renhetstudio.com/careers" /></svelte:head>

<main class="careers-site">
  <SiteHeader />
  <header class="careers-hero"><div class="careers-hero-copy"><h1>Make warm worlds with a tiny, international crew.</h1><p>We care about thoughtful craft, kind collaboration, and games full of personality. If that sounds like your kind of place, say hello.</p></div></header>
  <section id="openings" class="careers-openings">
    <div class="careers-section-heading"><div><h2>Find your place.</h2></div><p>Roles appear here as soon as they are published. No perfect match? The open application is always open.</p></div>
    <div class="careers-roles">
      <article class="careers-open-card"><div><h3>Open application</h3><p>Show us what you make. Artists, developers, designers, audio people, producers, and delightful specialists are all welcome.</p></div><a href="?role=open-application#apply">Introduce yourself <span>↗</span></a></article>
      {#await data.positions}
        <p class="careers-roles-status" role="status">Loading open roles…</p>
      {:then positions}
      {#each positions as position, index}
        <details class="careers-role">
          <summary><span class="careers-role-number">{String(index + 1).padStart(2, "0")}</span><span class="careers-role-title"><strong>{position.title}</strong><small>{position.department}</small></span><span class="careers-role-meta">{position.location} · {position.type}</span><span class="careers-role-toggle" aria-hidden="true">+</span></summary>
          <div class="careers-role-body"><p class="careers-role-summary">{position.summary}</p>
            {#if position.responsibilities.length}<div><h4>What you'll do</h4><ul>{#each position.responsibilities as item}<li>{item}</li>{/each}</ul></div>{/if}
            {#if position.requirements.length}<div><h4>What you bring</h4><ul>{#each position.requirements as item}<li>{item}</li>{/each}</ul></div>{/if}
            {#if position.niceToHave.length}<div><h4>Lovely extras</h4><ul>{#each position.niceToHave as item}<li>{item}</li>{/each}</ul></div>{/if}
            <a class="careers-role-apply" href={`?role=${position.slug}#apply`}>Apply for this role</a>
          </div>
        </details>
      {/each}
      {/await}
    </div>
  </section>
  <section id="apply" class="careers-apply-section">
    <div class="careers-apply-intro"><h2>Tell us what you would love to make.</h2></div>
    {#if form?.status === "success"}
      <div class="careers-success" role="status"><p class="careers-eyebrow">Sent successfully</p><h3>We have your application.</h3><p>{form.message}</p></div>
    {:else}
      <form method="POST" use:enhance class="careers-form">
        <div class="careers-form-grid">
          <label class="careers-field careers-field-wide"><span>Applying for</span>{#await data.positions}<select name="positionId" required><option value="open-application">Open application</option></select>{:then positions}<select name="positionId" value={positions.some((position) => position.slug === data.requestedRole) ? data.requestedRole : "open-application"} required><option value="open-application">Open application</option>{#each positions as position}<option value={position.slug}>{position.title}</option>{/each}</select>{/await}{#if form?.errors?.positionId}<span class="careers-field-error">{form.errors.positionId[0]}</span>{/if}</label>
          <label class="careers-field"><span>Name</span><input name="name" autocomplete="name" required maxlength="120" />{#if form?.errors?.name}<span class="careers-field-error">{form.errors.name[0]}</span>{/if}</label>
          <label class="careers-field"><span>Email</span><input name="email" type="email" autocomplete="email" required maxlength="254" />{#if form?.errors?.email}<span class="careers-field-error">{form.errors.email[0]}</span>{/if}</label>
          <label class="careers-field careers-field-wide"><span>Location / time zone</span><input name="location" autocomplete="address-level2" required maxlength="120" placeholder="Berlin, CET" /></label>
          <label class="careers-field"><span>Portfolio URL</span><input name="portfolioUrl" type="url" inputmode="url" maxlength="500" placeholder="https://" />{#if form?.errors?.portfolioUrl}<span class="careers-field-error">{form.errors.portfolioUrl[0]}</span>{/if}</label>
          <label class="careers-field"><span>CV / résumé URL</span><input name="resumeUrl" type="url" inputmode="url" maxlength="500" placeholder="https://" /></label>
          <label class="careers-field careers-field-wide"><span>LinkedIn URL <small>Optional</small></span><input name="linkedinUrl" type="url" inputmode="url" maxlength="500" placeholder="https://" /></label>
          <label class="careers-field careers-field-wide"><span>Tell us about yourself</span><textarea name="message" required minlength="20" maxlength="5000" rows="7" placeholder="What do you love making, and why would Renhet be a good fit?"></textarea>{#if form?.errors?.message}<span class="careers-field-error">{form.errors.message[0]}</span>{/if}</label>
        </div>
        <label class="careers-consent"><input name="consent" type="checkbox" required /><span>I agree that Renhet Studio may store and review my information for recruitment.</span></label>
        <label class="careers-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
        {#if form?.message}<p class="careers-form-status" role="alert">{form.message}</p>{/if}
        <button class="careers-submit" type="submit">Send application</button>
      </form>
    {/if}
  </section>
  <SiteFooter />
</main>
