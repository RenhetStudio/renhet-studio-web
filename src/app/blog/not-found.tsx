import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="blog-site blog-empty" style={{ minHeight: "100vh", display: "grid", placeContent: "center" }}>
      <h1>Story not found.</h1>
      <p>It may still be a draft, scheduled for later, or no longer available.</p>
      <Link href="/blog">Return to all stories</Link>
    </main>
  );
}
