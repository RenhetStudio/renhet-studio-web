const dismissedKey = "renhet-newsletter-invitation-dismissed";
const subscribedKey = "renhet_newsletter_subscribed";

export const newsletterPreferences = $state({ dismissed: false, subscribed: false });

export function restoreNewsletterPreferences() {
  try {
    newsletterPreferences.dismissed ||= sessionStorage.getItem(dismissedKey) === "1";
    newsletterPreferences.subscribed ||= localStorage.getItem(subscribedKey) === "1";
  } catch {
    // The in-memory preferences still apply when browser storage is unavailable.
  }
}

export function dismissNewsletterInvitation() {
  newsletterPreferences.dismissed = true;
  try {
    sessionStorage.setItem(dismissedKey, "1");
  } catch {
    // Keep the dismissal for the current visit.
  }
}

export function recordNewsletterSubscription() {
  newsletterPreferences.subscribed = true;
  try {
    localStorage.setItem(subscribedKey, "1");
  } catch {
    // Keep the confirmation for the current visit.
  }
}
