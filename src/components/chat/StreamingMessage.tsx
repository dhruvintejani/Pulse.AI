import { memo, useEffect, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { cn } from '@/lib/utils';

interface StreamingMessageProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const StreamingMessage = ({ content, speed = 12, onComplete, className }: StreamingMessageProps) => {
  const [visibleContent, setVisibleContent] = useState('');

  useEffect(() => {
    setVisibleContent('');
    if (!content) return undefined;

    let index = 0;
    const interval = window.setInterval(() => {
      index += Math.max(1, Math.ceil(content.length / 120));
      setVisibleContent(content.slice(0, index));

      if (index >= content.length) {
        window.clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [content, onComplete, speed]);

  return (
    <div className={cn('relative', className)}>
      <MarkdownRenderer content={visibleContent} tone="assistant" className="text-[#1F1F1F]" />
      {visibleContent.length < content.length && (
        <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-[#E9A24C]" aria-hidden="true" />
      )}
    </div>
  );
};

export default memo(StreamingMessage);
