import type { Metadata } from "next";
import { BlogShell } from "@/components/blog/blog-shell";
import { ProfileForm } from "@/components/blog/profile-form";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/account");
  return (
    <BlogShell profile={profile}>
      <section className="account-page">
        <p className="dashboard-kicker">Account</p>
        <h1>Your public profile</h1>
        <p>This name appears beside approved comments.</p>
        <ProfileForm displayName={profile.display_name} />
      </section>
    </BlogShell>
  );
}
