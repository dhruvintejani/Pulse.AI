import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  tone?: 'user' | 'assistant';
}

const MarkdownRenderer = ({ content, className, tone = 'assistant' }: MarkdownRendererProps) => {
  const mutedText = tone === 'user' ? 'text-white/85' : 'text-[#666]';
  const strongText = tone === 'user' ? 'text-white' : 'text-[#1F1F1F]';
  const accentText = tone === 'user' ? 'text-white' : 'text-[#E9A24C]';
  const inlineCode = tone === 'user' ? 'bg-white/15 text-white' : 'bg-black/5 text-[#D4853A]';

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
            <ul className="list-disc pl-5 my-2 space-y-1 marker:text-[#E9A24C]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 marker:text-[#E9A24C]">
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
          code: ({ className: codeClassName, children, ...props }) => {
            const language = /language-([\w-]+)/.exec(codeClassName ?? '')?.[1];
            const code = String(children).replace(/\n$/, '');

            if (language) {
              return <CodeBlock code={code} language={language} />;
            }

            return (
              <code
                {...props}
                className={cn('px-1.5 py-0.5 rounded-md font-mono text-[0.92em]', inlineCode)}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
