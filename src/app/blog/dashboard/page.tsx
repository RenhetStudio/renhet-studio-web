import type { Metadata } from "next";
import Link from "next/link";
import { BlogShell } from "@/components/blog/blog-shell";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { getAllPostsForDashboard, getPendingComments } from "@/lib/blog/data";
import { moderateCommentAction } from "@/lib/blog/actions";
import { requireAuthor } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog dashboard", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const profile = await requireAuthor();
  const [posts, comments] = await Promise.all([getAllPostsForDashboard(), getPendingComments()]);

  return (
    <BlogShell profile={profile}>
      <section className="dashboard-page">
        <header className="dashboard-header">
          <div><p className="dashboard-kicker">Publishing</p><h1>Blog dashboard</h1><p>Draft, schedule, publish, and moderate from one place.</p></div>
          <Link href="/blog/dashboard/posts/new">Write a new story</Link>
        </header>

        <section className="dashboard-section">
          <div className="dashboard-section-heading"><h2>Stories</h2><span>{posts.length} total</span></div>
          {posts.length === 0 ? <p className="dashboard-empty">No posts yet. Create the first story.</p> : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead><tr><th>Story</th><th>Category</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>{posts.map((post) => (
                  <tr key={post.id}>
                    <td><Link href={`/blog/dashboard/posts/${post.id}`}>{post.title}</Link><small>/{post.slug}</small></td>
                    <td>{post.category}</td>
                    <td><span className={`status-badge status-${post.status}`}>{post.status}{post.status === "published" && post.published_at && new Date(post.published_at) > new Date() ? " · scheduled" : ""}</span></td>
                    <td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.updated_at))}</td>
                    <td><div className="dashboard-actions"><Link href={`/blog/dashboard/posts/${post.id}`}>Edit</Link><a href={`/blog/preview/${post.id}`} target="_blank" rel="noreferrer">Preview</a><DeletePostButton id={post.id} title={post.title} /></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-section" id="moderation">
          <div className="dashboard-section-heading"><h2>Comment moderation</h2><span>{comments.length} pending</span></div>
          {comments.length === 0 ? <p className="dashboard-empty">The moderation queue is clear.</p> : (
            <ul className="moderation-list">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <div><strong>{comment.display_name}</strong><time dateTime={comment.created_at}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.created_at))}</time></div>
                  <p>{comment.body}</p>
                  <div className="moderation-actions">
                    <form action={moderateCommentAction}><input type="hidden" name="id" value={comment.id} /><input type="hidden" name="status" value="approved" /><button type="submit">Approve</button></form>
                    <form action={moderateCommentAction}><input type="hidden" name="id" value={comment.id} /><input type="hidden" name="status" value="rejected" /><button className="danger-button" type="submit">Reject</button></form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </BlogShell>
  );
}
