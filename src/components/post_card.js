// Helper function to extract initials from a full name
function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function UpvoteIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
    </svg>
  );
}

function DownvoteIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75h6.75m-6.75 3h4.5M21 12a8.25 8.25 0 0 1-9.23 8.19 8.2 8.2 0 0 1-3.52-1.36L3 20.25l1.42-4.74A8.25 8.25 0 1 1 21 12Z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export default function PostCard({post}) {
  // Simple calculation for relative time (e.g., "2 days ago") based on createdAt
  const getRelativeTime = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    return rtf.format(daysDifference, 'day');
  };

  return (
    <article className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="flex items-center gap-3 px-5 pt-5">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-600 text-sm font-bold text-white uppercase"
        >
          {getInitials(post.author.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-zinc-950 dark:text-zinc-50">
            {post.author.name}
          </h2>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            @{post.author.username} · {getRelativeTime(post.createdAt)}
          </p>
        </div>

        <button
          type="button"
          aria-label="More post options"
          className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <MoreIcon />
        </button>
      </header>

      <div 
        className="space-y-3 px-5 py-5 leading-7 text-zinc-700 dark:text-zinc-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="flex items-center gap-2 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            className="flex items-center gap-2 rounded-l-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
          >
            <UpvoteIcon />
            <span>{post.upvotes}</span>
          </button>
          
          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700" />
          
          <button
            type="button"
            className="flex items-center gap-2 rounded-r-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <DownvoteIcon />
            <span>{post.downvotes}</span>
          </button>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
        >
          <CommentIcon />
          <span>{post.comments} comments</span>
        </button>
      </footer>
    </article>
  );
}
