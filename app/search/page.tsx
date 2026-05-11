import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import { Input } from "@/components/ui/input";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export const metadata: Metadata = {
  title: "搜索教程",
  description: "搜索 AI Agent、模型、工具相关教程和 Prompt",
};

const categories = ["agent-platform", "ai-models", "tool-ecosystem"];

const categoryNames: Record<string, string> = {
  "agent-platform": "Agent平台",
  "ai-models": "AI模型",
  "tool-ecosystem": "工具生态",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const selectedCategory = params.category || "";

  const allPosts = getAllPosts();
  
  const filteredPosts = allPosts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }
    if (query) {
      const searchTerm = query.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            搜索教程
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            搜索 AI Agent、模型、工具相关教程和 Prompt
          </p>
        </header>

        {/* Search Form */}
        <form className="mb-8">
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              name="q"
              placeholder="搜索文章标题、描述或标签..."
              defaultValue={query}
              className="pl-12"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/search"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !selectedCategory
                ? "bg-primary text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            全部
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/search?category=${cat}${query ? `&q=${query}` : ""}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {categoryNames[cat] || cat}
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-zinc-500">
          {query || selectedCategory
            ? `找到 ${filteredPosts.length} 篇文章`
            : `共 ${filteredPosts.length} 篇文章`}
        </p>

        {/* Results Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-zinc-500">没有找到相关文章</p>
            <p className="mt-2 text-sm text-zinc-400">
              请尝试使用不同的关键词或浏览分类
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/tutorials/agent-platform"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                Agent平台
              </Link>
              <Link
                href="/tutorials/ai-models"
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                AI模型
              </Link>
              <Link
                href="/tutorials/tool-ecosystem"
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                工具生态
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
