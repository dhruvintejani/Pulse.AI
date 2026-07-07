import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = 'text' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block overflow-hidden shadow-card my-2">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-[#E9A24C]" />
          <span className="text-xs font-mono text-white/60">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto no-scrollbar">
        <code className="text-sm font-mono text-[#E9A24C]/80 leading-relaxed">
          {code.split('\n').map((line, i) => (
            <div key={`${line}-${i}`} className="flex">
              <span className="text-white/20 select-none w-7 shrink-0 text-right mr-4 text-xs">{i + 1}</span>
              <span className="text-green-300/80">{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
