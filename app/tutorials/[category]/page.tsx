import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByCategory, getAllCategories } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const categoryNames: Record<string, string> = {
  "agent-platform": "Agent平台",
  "ai-models": "AI模型",
  "tool-ecosystem": "工具生态",
};

const categoryDescriptions: Record<string, string> = {
  "agent-platform": "学习如何使用 Coze、Dify、LangChain 等 Agent 开发平台",
  "ai-models": "深入了解 GPT-4、Claude、Gemini 等大语言模型的使用技巧",
  "tool-ecosystem": "掌握 Cursor、Copilot 等 AI 辅助开发工具，提升编程效率",
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const name = categoryNames[category] || category;
  return {
    title: name,
    description: categoryDescriptions[category] || `${name} 相关教程`,
  };
}

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const name = categoryNames[category] || category;
  const description = categoryDescriptions[category] || `${name} 相关教程`;

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-zinc-500">
            <li>
              <Link href="/" className="hover:text-primary">
                首页
              </Link>
            </li>
            <li>/</li>
            <li className="text-zinc-900 dark:text-zinc-100">{name}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {name}
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">{description}</p>
        </header>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {getAllCategories().map((cat) => (
            <Link
              key={cat}
              href={`/tutorials/${cat}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                cat === category
                  ? "bg-primary text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {categoryNames[cat] || cat}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
