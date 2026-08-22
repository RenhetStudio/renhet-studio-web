import type { Metadata } from "next";
import { ApplicationForm } from "@/components/careers/application-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublishedPositions } from "@/lib/careers/google-sheets";
import type { CareerPosition } from "@/lib/careers/types";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Renhet Studio and help us build friendly, detailed game worlds.",
  alternates: { canonical: "/careers" },
  openGraph: { url: "/careers" },
};

export const revalidate = 300;

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string | string[] }>;
}) {
  let positions: CareerPosition[] = [];

  try {
    positions = await getPublishedPositions();
  } catch (error) {
    console.error("Career positions could not be loaded", error);
  }

  const requestedRole = (await searchParams).role;
  const role = typeof requestedRole === "string" ? requestedRole : "open-application";
  const initialPosition = positions.some((position) => position.slug === role)
    ? role
    : "open-application";

  return (
    <main className="careers-site">
      <SiteHeader />

      <header className="careers-hero">
        <div className="careers-hero-copy">
          {/* <p className="careers-eyebrow">Work with Renhet</p> */}
          <h1>Make warm worlds with a tiny, international crew.</h1>
          <p>
            We care about thoughtful craft, kind collaboration, and games full of personality.
            If that sounds like your kind of place, say hello.
          </p>
        </div>
      </header>

      <section id="openings" className="careers-openings">
        <div className="careers-section-heading">
          <div>
            {/* <p className="careers-eyebrow">Current opportunities</p> */}
            <h2>Find your place.</h2>
          </div>
          <p>
            Roles appear here as soon as they are published. No perfect match? The open
            application is always open.
          </p>
        </div>

        <div className="careers-roles">
          <article className="careers-open-card">
            <div>
              {/* <span className="careers-role-number">Always open</span> */}
              <h3>Open application</h3>
              <p>
                Show us what you make. Artists, developers, designers, audio people, producers,
                and delightful specialists are all welcome.
              </p>
            </div>
            <a href="?role=open-application#apply">Introduce yourself <span>↗</span></a>
          </article>

          {positions.map((position, index) => (
            <details className="careers-role" key={position.slug}>
              <summary>
                <span className="careers-role-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="careers-role-title">
                  <strong>{position.title}</strong>
                  <small>{position.department}</small>
                </span>
                <span className="careers-role-meta">{position.location} · {position.type}</span>
                <span className="careers-role-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="careers-role-body">
                <p className="careers-role-summary">{position.summary}</p>
                {position.responsibilities.length > 0 && (
                  <div>
                    <h4>What you&apos;ll do</h4>
                    <ul>{position.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                {position.requirements.length > 0 && (
                  <div>
                    <h4>What you bring</h4>
                    <ul>{position.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                {position.niceToHave.length > 0 && (
                  <div>
                    <h4>Lovely extras</h4>
                    <ul>{position.niceToHave.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                <a className="careers-role-apply" href={`?role=${position.slug}#apply`}>
                  Apply for this role
                </a>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section id="apply" className="careers-apply-section">
        <div className="careers-apply-intro">
          {/* <p className="careers-eyebrow">Start a conversation</p> */}
          <h2>Tell us what you would love to make.</h2>
          {/* <p>
            Share links to your work and a short note. A public or access-enabled link works best
            for CVs and portfolios.
          </p> */}
        </div>
        <ApplicationForm positions={positions} initialPosition={initialPosition} />
      </section>

      <SiteFooter />
    </main>
  );
}
