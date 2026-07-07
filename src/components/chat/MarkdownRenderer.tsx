import CodeBlock from './CodeBlock';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  tone?: 'user' | 'assistant';
}

const renderInlineMarkdown = (text: string, tone: 'user' | 'assistant') => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className={cn('font-semibold', tone === 'user' ? 'text-white' : 'text-[#1F1F1F]')}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className={cn('px-1.5 py-0.5 rounded-md font-mono text-[0.92em]', tone === 'user' ? 'bg-white/15 text-white' : 'bg-black/5 text-[#D4853A]')}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

const MarkdownRenderer = ({ content, className, tone = 'assistant' }: MarkdownRendererProps) => {
  const blocks = content.split(/```([\w-]*)\n([\s\S]*?)```/g);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (index % 3 === 1) return null;

        if (index % 3 === 2) {
          const language = blocks[index - 1] || 'text';
          return <CodeBlock key={index} code={block.trimEnd()} language={language} />;
        }

        return block.split('\n').map((line, lineIndex) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return <br key={`${index}-${lineIndex}`} />;

          if (/^[-*]\s+/.test(trimmedLine)) {
            return (
              <p key={`${index}-${lineIndex}`} className="text-sm leading-relaxed whitespace-pre-wrap">
                <span className={cn('mr-2', tone === 'user' ? 'text-white' : 'text-[#E9A24C]')}>•</span>
                {renderInlineMarkdown(trimmedLine.replace(/^[-*]\s+/, ''), tone)}
              </p>
            );
          }

          return (
            <p key={`${index}-${lineIndex}`} className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderInlineMarkdown(line, tone)}
            </p>
          );
        });
      })}
    </div>
  );
};

export default MarkdownRenderer;
