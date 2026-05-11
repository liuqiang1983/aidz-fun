import Link from "next/link";
import { PostMeta } from "@/lib/mdx";

interface ArticleCardProps {
  post: PostMeta;
  view?: "grid" | "list";
}

export default function ArticleCard({ post, view = "grid" }: ArticleCardProps) {
  const href = `/tutorials/${post.category}/${post.slug}`;

  if (view === "list") {
    return (
      <Link
        href={href}
        className="flex gap-4 rounded-xl border border-zinc-200 p-4 transition hover:border-primary dark:border-zinc-800"
      >
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2 text-sm text-primary">
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs dark:bg-blue-900/30">{post.category}</span>
            <span className="text-zinc-400">{post.date}</span>
          </div>
          <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{post.description}</p>
          {!!post.tags?.length && (
            <div className="mt-2 flex gap-2 text-xs text-zinc-500">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-zinc-200 transition hover:border-primary dark:border-zinc-800"
    >
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
        <span className="text-4xl">📄</span>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-primary">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs dark:bg-blue-900/30">{post.category}</span>
          <span className="text-zinc-400">{post.date}</span>
        </div>
        <h3 className="mb-2 line-clamp-2 font-semibold text-zinc-900 group-hover:text-primary dark:text-zinc-100">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{post.description}</p>
        {!!post.tags?.length && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
