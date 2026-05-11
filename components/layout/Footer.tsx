import Link from "next/link";

const footerLinks = [
  {
    title: "分类",
    links: [
      { href: "/tutorials/agent-platform", label: "Agent平台" },
      { href: "/tutorials/ai-models", label: "AI模型" },
      { href: "/tutorials/tool-ecosystem", label: "工具生态" },
    ],
  },
  {
    title: "资源",
    links: [
      { href: "/search", label: "搜索" },
      { href: "https://github.com/liuqiang1983/aidz-fun", label: "GitHub" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">🍌</span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                AIDZ.FUN
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              收录 AI Agent 平台、模型、Prompt、部署教程，帮助你快速建立可落地的 AI 工作流。
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} AIDZ.FUN. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
