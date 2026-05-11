import Link from "next/link";
import { getFeaturedPosts, getLatestPosts } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";

const categories = [
  { slug: "agent-platform", name: "Agent平台", icon: "🤖", description: "Coze、Dify、LangChain 等平台教程" },
  { slug: "ai-models", name: "AI模型", icon: "🧠", description: "GPT-4、Claude、Gemini 等模型使用" },
  { slug: "tool-ecosystem", name: "工具生态", icon: "🛠️", description: "Cursor、Copilot 等效率工具" },
];

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const latestPosts = getLatestPosts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-950" />
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                AIDZ.FUN
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              收录 AI Agent 平台、模型、Prompt、部署教程，帮助你快速建立可落地的 AI 工作流
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                开始探索
              </Link>
              <Link
                href="/tutorials/agent-platform"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                浏览教程
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">探索分类</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/tutorials/${category.slug}`}
                className="group rounded-xl border border-zinc-200 p-6 transition hover:border-primary dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="text-3xl">{category.icon}</div>
                <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-primary dark:text-zinc-100">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">精选文章</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.slice(0, 6).map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">最新文章</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.slice(0, 9).map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">订阅更新</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                获取最新 AI 工具教程和使用技巧
              </p>
              <form className="mt-6 flex gap-3">
                <input
                  type="email"
                  placeholder="输入邮箱地址"
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                  订阅
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
