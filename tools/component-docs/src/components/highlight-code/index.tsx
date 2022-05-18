import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);

type HighlightCodeProps = {
  lang: 'javascript' | 'typescript';
  code: string;
};

function HighlightCode(props: HighlightCodeProps) {
  const { lang, code } = props;
  const highlightedCode = hljs.highlight(code, { language: lang }).value;
  return <p>{highlightedCode}</p>;
}

export default HighlightCode;
