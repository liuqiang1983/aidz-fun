"use client";

import { useState } from "react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export default function CodeBlock({ language = "text", code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("copy failed");
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg bg-zinc-900 text-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="text-xs text-zinc-500">{language}</span>
        <button
          onClick={handleCopy}
          className={`rounded px-2 py-1 text-xs transition ${
            copied ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          }`}
        >
          {copied ? "已复制 ✓" : "复制"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-zinc-200">{code}</code>
      </pre>
    </div>
  );
}
