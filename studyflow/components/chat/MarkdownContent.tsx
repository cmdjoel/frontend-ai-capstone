import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = React.memo(function MarkdownContent({
  content,
}: MarkdownContentProps) {
  return (
    <div className="prose-clean text-sm leading-relaxed break-words space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-3 mb-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mt-2.5 mb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1 mb-2 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1 mb-2 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-normal">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-zinc-950 dark:text-zinc-50">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3 my-2 text-zinc-600 dark:text-zinc-400 italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-900 dark:text-zinc-100"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-2 rounded-lg bg-zinc-950 p-3 text-zinc-100 overflow-x-auto">
                <code className="font-mono text-xs block" {...props}>
                  {children}
                </code>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-2 w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-xs text-left">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1.5 font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1.5 border-t border-zinc-200 dark:border-zinc-800">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-3 border-zinc-200 dark:border-zinc-800" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
