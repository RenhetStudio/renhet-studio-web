<script lang="ts">
  import { enhance } from "$app/forms";
  import BlogShell from "$lib/components/BlogShell.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconPlus from "$lib/components/icons/IconPlus.svelte";
  import IconEdit from "$lib/components/icons/IconEdit.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconTrash from "$lib/components/icons/IconTrash.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  }
</script>

<svelte:head>
  <title>Blog Dashboard | Renhet Studio</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<BlogShell profile={data.profile}>
  <div
    class="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 pt-28 sm:pt-36 md:pt-40 pb-20 sm:pb-28"
  >
    <!-- Back to Blog -->
    <div class="mb-8">
      <a
        href="/blog"
        class="inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#8a98a5] transition-colors hover:text-[#4f5f70]"
      >
        <IconArrow direction="left" size={13} />
        <span>Return to stories</span>
      </a>
    </div>

    <!-- Editorial Header: Standardized monumental scale with Paperlogy-9Black and Slate Ink -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 text-left">
      <div>
        <p
          class="text-xs sm:text-[13px] font-black uppercase tracking-widest text-[#8a98a5]"
        >
          Author Workspace
        </p>
        <h1
          class="mt-2 text-[clamp(3.2rem,7.5vw,6.5rem)] font-black leading-[0.88] tracking-tight text-[#4f5f70]"
        >
          Blog Dashboard.
        </h1>
        <p class="mt-3 text-base sm:text-lg font-normal leading-relaxed text-[#627383]">
          Draft, schedule, publish, and moderate stories from one central place.
        </p>
      </div>

      <div class="shrink-0">
        <a
          href="/blog/dashboard/posts/new"
          class="inline-flex h-[48px] items-center gap-2 rounded-full bg-[#4f5f70] px-6 text-sm font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#344253] active:translate-y-0 cursor-pointer"
        >
          <IconPlus size={16} />
          <span>Write a new story</span>
        </a>
      </div>
    </header>

    <!-- Organic Divider -->
    <OrganicDivider
      orientation="horizontal"
      seed="dashboard-editorial-top"
      class="my-8 sm:my-10 lg:my-12"
    />

    <!-- Section 1: Stories Stream (No Cards Rule: structured by typography, hairlines & whitespace) -->
    <section class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-[#4f5f70]">
            Stories
          </h2>
          <span
            class="inline-flex shrink-0 whitespace-nowrap items-center rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-3 py-0.5 text-xs font-black text-[#4f5f70]"
          >
            {data.posts.length} {data.posts.length === 1 ? "story" : "stories"}
          </span>
        </div>
      </div>

      {#if data.posts.length === 0}
        <div class="py-12 text-left">
          <p class="text-base text-[#627383]">
            No active stories found. Start by writing the first draft.
          </p>
          <a
            href="/blog/dashboard/posts/new"
            class="inline-block mt-3 text-sm font-bold text-[#8fb8d8] underline underline-offset-4 hover:text-[#4f5f70] transition-colors"
          >
            Create first story
          </a>
        </div>
      {:else}
        <!-- Desktop Table Header -->
        <div
          class="hidden md:grid md:grid-cols-[minmax(0,1fr)_180px_130px_120px_auto] lg:grid-cols-[minmax(0,1fr)_200px_140px_130px_auto] gap-4 lg:gap-6 py-3 px-3 text-xs font-black uppercase tracking-wider text-[#8a98a5] border-b border-[#4f5f70]/15"
        >
          <div>Story</div>
          <div>Category</div>
          <div>Status</div>
          <div>Updated</div>
          <div class="text-right">Actions</div>
        </div>

        <!-- Stories List -->
        <div class="divide-y divide-[#4f5f70]/12">
          {#each data.posts as post (post.id)}
            <!-- Desktop Row -->
            <div
              class="hidden md:grid md:grid-cols-[minmax(0,1fr)_180px_130px_120px_auto] lg:grid-cols-[minmax(0,1fr)_200px_140px_130px_auto] gap-4 lg:gap-6 py-4.5 px-3 items-center transition-colors hover:bg-[#fffdf3]/60 rounded-xl -mx-3"
            >
              <div class="min-w-0 pr-4">
                <a
                  href={`/blog/dashboard/posts/${post.id}`}
                  class="font-black text-base lg:text-lg text-[#344253] hover:text-[#4f5f70] hover:underline decoration-2 decoration-[#8fb8d8] transition-colors line-clamp-2"
                >
                  {post.title}
                </a>
                <span class="block text-xs font-mono text-[#8a98a5] mt-0.5 truncate">
                  /{post.slug}
                </span>
              </div>

              <div>
                <span
                  class="inline-flex max-w-full items-center truncate rounded-full border border-[#4f5f70]/15 bg-[#fffdf3] px-3.5 py-1 text-xs font-black text-[#4f5f70]"
                  title={post.category}
                >
                  {post.category}
                </span>
              </div>

              <div>
                {#if post.status === "published"}
                  {#if post.published_at && new Date(post.published_at) > new Date()}
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#8fb8d8]/50 bg-[#eef5fa] px-3 py-1 text-xs font-black text-[#2d506b]"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-[#5a8bb0]" aria-hidden="true"></span>
                      <span>Scheduled</span>
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#6b8f71]/35 bg-[#f0f5f1] px-3 py-1 text-xs font-black text-[#2e5337]"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-[#4a7c59]" aria-hidden="true"></span>
                      <span>Published</span>
                    </span>
                  {/if}
                {:else}
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-[#d6d5ca] bg-[#f6f1e8] px-3 py-1 text-xs font-black text-[#5a6a7a]"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-[#9aa6b2]" aria-hidden="true"></span>
                    <span>Draft</span>
                  </span>
                {/if}
              </div>

              <div>
                <time class="text-xs font-bold text-[#8a98a5]">
                  {formatDate(post.updated_at)}
                </time>
              </div>

              <div class="flex items-center justify-end gap-2">
                <a
                  href={`/blog/dashboard/posts/${post.id}`}
                  class="inline-flex items-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-3.5 py-1.5 text-xs font-bold text-[#344253] transition-all hover:border-[#4f5f70] hover:bg-[#4f5f70] hover:text-[#fffdf3] hover:shadow-xs active:scale-[0.98] cursor-pointer"
                  title="Edit post in rich editor"
                >
                  <IconEdit size={11} strokeWidth={2.4} />
                  <span>Edit</span>
                </a>
                <a
                  href={`/blog/preview/${post.id}`}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1.5 rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] px-3.5 py-1.5 text-xs font-bold text-[#627383] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 hover:text-[#344253] cursor-pointer"
                  title="Open live preview in new tab"
                >
                  <IconExternal size={11} />
                  <span>Preview</span>
                </a>
                <form
                  method="POST"
                  action="?/delete"
                  use:enhance={({ cancel }) => {
                    if (!confirm(`Move "${post.title}" to trash? You can restore it anytime.`)) {
                      cancel();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    class="inline-flex items-center gap-1.5 rounded-full border border-[#8b4b50]/25 bg-transparent px-3 py-1.5 text-xs font-bold text-[#8b4b50] transition-all hover:border-[#8b4b50] hover:bg-[#8b4b50]/10 hover:text-[#70383b] cursor-pointer"
                    title="Move post to trash"
                  >
                    <IconTrash size={11} strokeWidth={2.4} />
                    <span>Delete</span>
                  </button>
                </form>
              </div>
            </div>

            <!-- Mobile Row (Clean cardless responsive stack) -->
            <div class="flex flex-col md:hidden py-4.5 space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full border border-[#4f5f70]/15 bg-[#fffdf3] px-2.5 py-0.5 text-[11px] font-black text-[#4f5f70]"
                  >
                    {post.category}
                  </span>
                  {#if post.status === "published"}
                    {#if post.published_at && new Date(post.published_at) > new Date()}
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full border border-[#8fb8d8]/50 bg-[#eef5fa] px-2.5 py-0.5 text-[11px] font-black text-[#2d506b]"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-[#5a8bb0]" aria-hidden="true"></span>
                        <span>Scheduled</span>
                      </span>
                    {:else}
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full border border-[#6b8f71]/35 bg-[#f0f5f1] px-2.5 py-0.5 text-[11px] font-black text-[#2e5337]"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-[#4a7c59]" aria-hidden="true"></span>
                        <span>Published</span>
                      </span>
                    {/if}
                  {:else}
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#d6d5ca] bg-[#f6f1e8] px-2.5 py-0.5 text-[11px] font-black text-[#5a6a7a]"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-[#9aa6b2]" aria-hidden="true"></span>
                      <span>Draft</span>
                    </span>
                  {/if}
                </div>
                <time class="text-xs font-bold text-[#8a98a5] shrink-0">
                  {formatDate(post.updated_at)}
                </time>
              </div>

              <a
                href={`/blog/dashboard/posts/${post.id}`}
                class="font-black text-lg text-[#344253] leading-snug hover:text-[#4f5f70] transition-colors"
              >
                {post.title}
              </a>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <span class="text-xs font-mono text-[#8a98a5] truncate">
                  /{post.slug}
                </span>
                <div class="flex items-center gap-2">
                  <a
                    href={`/blog/dashboard/posts/${post.id}`}
                    class="inline-flex items-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-3.5 py-1 text-xs font-bold text-[#344253] transition-all hover:bg-[#4f5f70] hover:text-[#fffdf3]"
                  >
                    <IconEdit size={11} strokeWidth={2.4} />
                    <span>Edit</span>
                  </a>
                  <a
                    href={`/blog/preview/${post.id}`}
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] px-3.5 py-1 text-xs font-bold text-[#627383] transition-all hover:border-[#8fb8d8] hover:text-[#344253]"
                  >
                    <IconExternal size={11} />
                    <span>Preview</span>
                  </a>
                  <form
                    method="POST"
                    action="?/delete"
                    use:enhance={({ cancel }) => {
                      if (!confirm(`Move "${post.title}" to trash? You can restore it anytime.`)) {
                        cancel();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#8b4b50]/25 bg-transparent px-3 py-1 text-xs font-bold text-[#8b4b50] transition-all hover:bg-[#8b4b50]/10 hover:text-[#70383b] cursor-pointer"
                    >
                      <IconTrash size={11} strokeWidth={2.4} />
                      <span>Delete</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Trash / Recoverable Stories framed by OrganicDivider -->
      {#if data.deletedPosts && data.deletedPosts.length > 0}
        <OrganicDivider
          orientation="horizontal"
          seed="dashboard-trash-divider"
          class="my-8 sm:my-10"
        />

        <div>
          <div class="flex items-center justify-between gap-4 mb-4">
            <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h3 class="text-xl font-black tracking-tight text-[#627383]">
                Trash
              </h3>
              <span
                class="inline-flex shrink-0 whitespace-nowrap items-center rounded-full border border-[#d6d5ca] bg-[#f6f1e8] px-2.5 py-0.5 text-xs font-black text-[#718191]"
              >
                {data.deletedPosts.length} {data.deletedPosts.length === 1 ? "story" : "stories"}
              </span>
            </div>
            <p class="text-xs text-[#8a98a5] hidden sm:block">
              Soft-deleted stories are kept safe here and hidden from readers.
            </p>
          </div>

          <div class="divide-y divide-[#4f5f70]/12">
            {#each data.deletedPosts as deletedPost (deletedPost.id)}
              <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <span class="line-through text-sm font-bold text-[#8a98a5] break-words">
                    {deletedPost.title}
                  </span>
                  <span class="block sm:inline sm:ml-2 text-xs font-mono text-[#8a98a5]/70">
                    /{deletedPost.slug}
                  </span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <form method="POST" action="?/restore" use:enhance>
                    <input type="hidden" name="id" value={deletedPost.id} />
                    <button
                      type="submit"
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-3.5 py-1 text-xs font-bold text-[#344253] transition-colors hover:bg-[#8fb8d8]/20 cursor-pointer"
                    >
                      Restore as draft
                    </button>
                  </form>
                  <form
                    method="POST"
                    action="?/destroy"
                    use:enhance={({ cancel }) => {
                      if (
                        !confirm(
                          `Permanently delete "${deletedPost.title}"? This cannot be undone.`
                        )
                      ) {
                        cancel();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={deletedPost.id} />
                    <button
                      type="submit"
                      class="inline-flex items-center gap-1.5 rounded-full border border-[#8b4b50]/30 bg-[#fffdf3] px-3.5 py-1 text-xs font-bold text-[#8b4b50] transition-colors hover:bg-[#8b4b50]/15 hover:text-[#70383b] cursor-pointer"
                    >
                      <IconTrash size={11} strokeWidth={2.4} />
                      <span>Delete permanently</span>
                    </button>
                  </form>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </section>

    <!-- Organic Divider separating Stories from Moderation -->
    <OrganicDivider
      orientation="horizontal"
      seed="dashboard-editorial-mod"
      class="my-10 sm:my-14 lg:my-16"
    />

    <!-- Section 2: Comment Moderation -->
    <section class="space-y-6" id="moderation">
      <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-[#4f5f70]">
          Comment Moderation
        </h2>
        <span
          class="inline-flex shrink-0 whitespace-nowrap items-center rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-3 py-0.5 text-xs font-black text-[#4f5f70]"
        >
          {data.comments.length} pending
        </span>
      </div>

      {#if data.comments.length === 0}
        <div class="py-8 text-left">
          <p class="text-base text-[#627383]">
            The moderation queue is clear. All submitted comments have been reviewed.
          </p>
        </div>
      {:else}
        <div class="divide-y divide-[#4f5f70]/15">
          {#each data.comments as comment (comment.id)}
            <div class="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div class="flex-1 max-w-2xl">
                <div class="flex items-center gap-3 mb-1.5">
                  <strong class="text-base font-black text-[#4f5f70]">
                    {comment.display_name}
                  </strong>
                  <time datetime={comment.created_at} class="text-xs font-bold text-[#8a98a5]">
                    {formatDate(comment.created_at)}
                  </time>
                </div>
                <p class="text-sm text-[#4f5f70]/90 leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>

              <div class="flex items-center gap-2.5 shrink-0 pt-1">
                <form method="POST" action="?/moderate" use:enhance>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button
                    type="submit"
                    class="inline-flex h-[38px] items-center justify-center rounded-full bg-[#4f5f70] px-5 text-xs font-black text-[#fffdf3] shadow-xs transition-all hover:bg-[#344253] cursor-pointer"
                  >
                    Approve
                  </button>
                </form>
                <form method="POST" action="?/moderate" use:enhance>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button
                    type="submit"
                    class="inline-flex h-[38px] items-center justify-center rounded-full border border-[#8b4b50]/35 bg-[#fffdf3] px-5 text-xs font-black text-[#8b4b50] transition-all hover:bg-[#8b4b50]/10 hover:text-[#70383b] cursor-pointer"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  </div>
</BlogShell>
