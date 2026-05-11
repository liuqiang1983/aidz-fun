import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  category: string;
  slug: string;
  tags: string[];
  cover?: string;
  featured?: boolean;
  hot?: boolean;
  author?: string;
}

const POSTS_PATH = path.join(process.cwd(), "content/posts");

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkDir(fullPath);
    if (entry.isFile() && fullPath.endsWith(".mdx")) return [fullPath];
    return [];
  });
}

export function getAllPosts(): PostMeta[] {
  const files = walkDir(POSTS_PATH);
  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const relativePath = path.relative(POSTS_PATH, filePath);
    const parts = relativePath.split(path.sep);
    const category = parts[0];
    const filename = parts[parts.length - 1];
    const slug = filename.replace(/\.mdx$/, "");
    return {
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      category: data.category ?? category,
      slug,
      tags: data.tags ?? [],
      cover: data.cover ?? "",
      featured: data.featured ?? false,
      hot: data.hot ?? false,
      author: data.author ?? "AIDZ.FUN",
    } satisfies PostMeta;
  });
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts() {
  return getAllPosts().filter((post) => post.featured);
}

export function getLatestPosts() {
  return getAllPosts();
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostBySlug(category: string, slug: string) {
  const filePath = path.join(POSTS_PATH, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);
  return {
    meta: {
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      category: data.category ?? category,
      slug,
      tags: data.tags ?? [],
      cover: data.cover ?? "",
      featured: data.featured ?? false,
      hot: data.hot ?? false,
      author: data.author ?? "AIDZ.FUN",
    } satisfies PostMeta,
    content,
  };
}

export function getAllCategories() {
  return Array.from(new Set(getAllPosts().map((post) => post.category)));
}

export function getRelatedPosts(current: PostMeta, limit = 6) {
  return getAllPosts()
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const sameCategory = post.category === current.category ? 2 : 0;
      const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
      return { ...post, score: sameCategory + sharedTags };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-");
    toc.push({ id, text, level });
  }
  return toc;
}

export function getStaticCategoryParams() {
  return getAllCategories().map((category) => ({ category }));
}

export function getStaticPostParams() {
  return getAllPosts().map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}
