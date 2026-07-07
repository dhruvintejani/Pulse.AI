import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  tone?: 'user' | 'assistant';
}

const remarkPlugins = [remarkGfm];

const MarkdownRenderer = ({ content, className, tone = 'assistant' }: MarkdownRendererProps) => {
  const mutedText = tone === 'user' ? 'text-white/85' : 'text-[#666]';
  const strongText = tone === 'user' ? 'text-white' : 'text-[#1F1F1F]';
  const accentText = tone === 'user' ? 'text-white' : 'text-[#E9A24C]';
  const inlineCode = tone === 'user' ? 'bg-white/15 text-white' : 'bg-black/5 text-[#D4853A]';
  const markerText = tone === 'user' ? 'marker:text-white' : 'marker:text-[#E9A24C]';

  const components = useMemo<Components>(() => ({
    p: ({ children }) => (
      <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2 last:mb-0">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className={cn('font-semibold', strongText)}>{children}</strong>
    ),
    em: ({ children }) => (
      <em className={cn('italic', mutedText)}>{children}</em>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn('font-medium underline underline-offset-2', accentText)}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className={cn('list-disc pl-5 my-2 space-y-1', markerText)}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={cn('list-decimal pl-5 my-2 space-y-1', markerText)}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-sm leading-relaxed whitespace-pre-wrap">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#E9A24C]/50 pl-3 my-2 text-sm leading-relaxed">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => <>{children}</>,
    code: ({ className: codeClassName, children }) => {
      const language = /language-([\w-]+)/.exec(codeClassName ?? '')?.[1];
      const code = String(children).replace(/\n$/, '');

      if (language) {
        return <CodeBlock code={code} language={language} />;
      }

      return (
        <code className={cn('px-1.5 py-0.5 rounded-md font-mono text-[0.92em]', inlineCode)}>
          {children}
        </code>
      );
    },
  }), [accentText, inlineCode, markerText, mutedText, strongText]);

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default memo(MarkdownRenderer);
