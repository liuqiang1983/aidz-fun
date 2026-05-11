"use client";

import { useState } from "react";

interface PromptBlockProps {
  title?: string;
  content: string;
}

function fallbackCopyText(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  const selection = document.getSelection();
  const selected = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  if (selected && selection) {
    selection.removeAllRanges();
    selection.addRange(selected);
  }
}

export default function PromptBlock({ title, content }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        fallbackCopyText(content);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        fallbackCopyText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("copy failed", error);
      }
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
      {title && (
        <div className="border-b border-dashed border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          💡 {title}
        </div>
      )}
      <div className="relative p-4 pr-20">
        <pre className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">{content}</pre>
        <button
          onClick={handleCopy}
          className={`absolute right-4 top-4 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            copied ? "bg-green-500 text-white" : "bg-zinc-700 text-white hover:bg-zinc-600"
          }`}
        >
          {copied ? "已复制 ✓" : "复制"}
        </button>
      </div>
    </div>
  );
}
