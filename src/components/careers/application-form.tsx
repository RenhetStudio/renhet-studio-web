"use client";

import { useActionState } from "react";
import type { CareerPosition } from "@/lib/careers/types";
import { submitApplication } from "@/app/careers/actions";
import { initialApplicationState } from "@/app/careers/application-state";

type ApplicationFormProps = {
  positions: CareerPosition[];
  initialPosition: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="careers-field-error">{errors[0]}</span>;
}

export function ApplicationForm({ positions, initialPosition }: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialApplicationState,
  );

  if (state.status === "success") {
    return (
      <div className="careers-success" role="status">
        <p className="careers-eyebrow">Sent successfully</p>
        <h3>We have your application.</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="careers-form">
      <div className="careers-form-grid">
        <label className="careers-field careers-field-wide">
          <span>Applying for</span>
          <select name="positionId" defaultValue={initialPosition} required>
            <option value="open-application">Open application</option>
            {positions.map((position) => (
              <option key={position.slug} value={position.slug}>
                {position.title}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.positionId} />
        </label>

        <label className="careers-field">
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={120} />
          <FieldError errors={state.errors?.name} />
        </label>

        <label className="careers-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
          <FieldError errors={state.errors?.email} />
        </label>

        <label className="careers-field careers-field-wide">
          <span>Location / time zone</span>
          <input
            name="location"
            autoComplete="address-level2"
            required
            maxLength={120}
            placeholder="Berlin, CET"
          />
          <FieldError errors={state.errors?.location} />
        </label>

        <label className="careers-field">
          <span>Portfolio URL</span>
          <input name="portfolioUrl" type="url" inputMode="url" maxLength={500} placeholder="https://" />
          <FieldError errors={state.errors?.portfolioUrl} />
        </label>

        <label className="careers-field">
          <span>CV / résumé URL</span>
          <input name="resumeUrl" type="url" inputMode="url" maxLength={500} placeholder="https://" />
          <FieldError errors={state.errors?.resumeUrl} />
        </label>

        <label className="careers-field careers-field-wide">
          <span>LinkedIn URL <small>Optional</small></span>
          <input name="linkedinUrl" type="url" inputMode="url" maxLength={500} placeholder="https://" />
          <FieldError errors={state.errors?.linkedinUrl} />
        </label>

        <label className="careers-field careers-field-wide">
          <span>Tell us about yourself</span>
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={5000}
            rows={7}
            placeholder="What do you love making, and why would Renhet be a good fit?"
          />
          <FieldError errors={state.errors?.message} />
        </label>
      </div>

      <label className="careers-consent">
        <input name="consent" type="checkbox" required />
        <span>I agree that Renhet Studio may store and review my information for recruitment.</span>
      </label>
      <FieldError errors={state.errors?.consent} />

      <label className="careers-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {state.message && (
        <p className="careers-form-status" role="alert">
          {state.message}
        </p>
      )}

      <button className="careers-submit" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
