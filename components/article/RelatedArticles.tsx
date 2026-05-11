import ArticleCard from "./ArticleCard";
import { PostMeta } from "@/lib/mdx";

interface RelatedArticlesProps {
  posts: PostMeta[];
}

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (!posts.length) return null;

  return (
    <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">相关推荐</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
