import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getRelatedPosts, extractToc, getStaticPostParams } from "@/lib/mdx";
import TOC from "@/components/article/TOC";
import RelatedArticles from "@/components/article/RelatedArticles";
import PromptBlock from "@/components/article/PromptBlock";
import CodeBlock from "@/components/article/CodeBlock";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Custom components for MDX
const components = {
  PromptBlock,
  CodeBlock,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = props.children?.toString() || "";
    const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-");
    return <h2 id={id} className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 scroll-mt-20" {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = props.children?.toString() || "";
    const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-");
    return <h3 id={id} className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 scroll-mt-20" {...props} />;
  },
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostBySlug(category, slug);
  
  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export async function generateStaticParams() {
  return getStaticPostParams();
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPostBySlug(category, slug);

  if (!post) {
    notFound();
  }

  const toc = extractToc(post.content);
  const relatedPosts = getRelatedPosts(post.meta, 6);

  const categoryNames: Record<string, string> = {
    "agent-platform": "Agent平台",
    "ai-models": "AI模型",
    "tool-ecosystem": "工具生态",
  };

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
            <li>
              <Link href={`/tutorials/${category}`} className="hover:text-primary">
                {categoryNames[category] || category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">{post.meta.title}</li>
          </ol>
        </nav>

        <div className="flex gap-12">
          {/* Main Content */}
          <article className="min-w-0 flex-1">
            {/* Header */}
            <header className="mb-8">
              <div className="mb-4 flex items-center gap-3 text-sm text-zinc-500">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {categoryNames[category] || category}
                </span>
                <span>{post.meta.date}</span>
                {post.meta.author && <span>by {post.meta.author}</span>}
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                {post.meta.title}
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {post.meta.description}
              </p>
              {post.meta.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.meta.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* MDX Content */}
            <div className="prose-aidz">
              <MDXRemote source={post.content} components={components} />
            </div>

            {/* Related Articles */}
            <RelatedArticles posts={relatedPosts} />
          </article>

          {/* Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <TOC items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
