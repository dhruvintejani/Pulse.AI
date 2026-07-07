import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const renderInlineMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-[#1F1F1F]">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="px-1.5 py-0.5 rounded-md bg-black/5 text-[#D4853A] font-mono text-[0.92em]">{part.slice(1, -1)}</code>;
    }

    return <span key={index}>{part}</span>;
  });
};

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
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
                <span className="text-[#E9A24C] mr-2">•</span>
                {renderInlineMarkdown(trimmedLine.replace(/^[-*]\s+/, ''))}
              </p>
            );
          }

          return (
            <p key={`${index}-${lineIndex}`} className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderInlineMarkdown(line)}
            </p>
          );
        });
      })}
    </div>
  );
};

export default MarkdownRenderer;
