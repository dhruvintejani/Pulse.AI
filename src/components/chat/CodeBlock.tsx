import { memo, useCallback, useMemo, useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const keywordPattern = /\b(const|let|var|function|return|if|else|for|while|import|export|from|type|interface|class|extends|async|await|try|catch|new|true|false|null|undefined)\b/g;
const stringPattern = /(['"`])(?:(?!\1).|\\.)*\1/g;
const commentPattern = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const numberPattern = /\b\d+(?:\.\d+)?\b/g;

const highlightLine = (line: string) => {
  const tokens: Array<{ text: string; className: string }> = [];
  const matches: Array<{ start: number; end: number; className: string }> = [];

  const collect = (pattern: RegExp, className: string) => {
    for (const match of line.matchAll(pattern)) {
      if (match.index === undefined) continue;
      matches.push({ start: match.index, end: match.index + match[0].length, className });
    }
  };

  collect(commentPattern, 'text-[#8B949E] italic');
  collect(stringPattern, 'text-emerald-300');
  collect(keywordPattern, 'text-sky-300');
  collect(numberPattern, 'text-amber-200');

  const ordered = matches
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .filter((match, index, all) => !all.some((other, otherIndex) => otherIndex < index && match.start >= other.start && match.end <= other.end));

  let cursor = 0;
  ordered.forEach((match) => {
    if (match.start > cursor) {
      tokens.push({ text: line.slice(cursor, match.start), className: 'text-green-300/80' });
    }
    tokens.push({ text: line.slice(match.start, match.end), className: match.className });
    cursor = match.end;
  });

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), className: 'text-green-300/80' });
  }

  return tokens.length ? tokens : [{ text: line || ' ', className: 'text-green-300/80' }];
};

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
        <code className="text-sm font-mono leading-relaxed">
          {codeLines.map((line, i) => (
            <div key={`${line}-${i}`} className="flex">
              <span className="text-white/20 select-none w-7 shrink-0 text-right mr-4 text-xs" aria-hidden="true">{i + 1}</span>
              <span>
                {highlightLine(line).map((token, tokenIndex) => (
                  <span key={`${token.text}-${tokenIndex}`} className={token.className}>{token.text}</span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default memo(CodeBlock);
