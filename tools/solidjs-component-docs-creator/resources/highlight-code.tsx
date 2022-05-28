import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('bash', bash);

type HighlightCodeProps = {
  lang: 'javascript' | 'typescript' | 'html' | 'sh';
  code: string;
};

function HighlightCode(props: HighlightCodeProps) {
  try {
    const { lang, code } = props;

    const highlightedCode = hljs.highlight(code, {
      language: lang ?? 'sh',
      ignoreIllegals: true,
    }).value;
    return <div innerHTML={highlightedCode} />;
  } catch (_error) {
    return null;
  }
}

export default HighlightCode;
