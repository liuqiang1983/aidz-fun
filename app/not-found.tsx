import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">页面不存在</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
      >
        返回首页
      </Link>
    </div>
  );
}
