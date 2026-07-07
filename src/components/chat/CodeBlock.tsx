import { memo, useCallback, useMemo, useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = 'text' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeLines = useMemo(() => code.split('\n'), [code]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="code-block overflow-hidden shadow-card my-2">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-[#E9A24C]" aria-hidden="true" />
          <span className="text-xs font-mono text-white/60">{language}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code'}
          className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1 rounded-md focus-ring"
        >
          {copied ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto no-scrollbar">
        <code className="text-sm font-mono text-[#E9A24C]/80 leading-relaxed">
          {codeLines.map((line, i) => (
            <div key={`${line}-${i}`} className="flex">
              <span className="text-white/20 select-none w-7 shrink-0 text-right mr-4 text-xs" aria-hidden="true">{i + 1}</span>
              <span className="text-green-300/80">{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default memo(CodeBlock);
