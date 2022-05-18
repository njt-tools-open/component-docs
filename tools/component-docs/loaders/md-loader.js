const MarkdownIt = require('markdown-it');
// const anchor = require('markdown-it-anchor');
// const container = require('markdown-it-container');
// const toc = require('markdown-it-toc-done-right');
// const matter = require('gray-matter');
const { parse } = require('@babel/parser');
const { default: generate } = require('@babel/generator');
const parseTsxBlock = require('./parser');

module.exports = function mdLoader(source) {
  // 初始化markdown-it
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    typographer: true,
    highlight(str, lang) {
      const template = `
      <HighlightCode
        lang={\`${lang}\`}
        code={\`${str}\`}
      >
      </HighlightCode>
    `;
      return template;
    },
  });

  md.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n';
  };

  let mdToHtml = md
    .render(source)
    .replace(/<hr>/g, '<hr />')
    .replace(/<br>/g, '<br />')
    .replace(/class=/g, 'className=');

  let index = 0;
  mdToHtml = mdToHtml.replace(/<pre><code className="language-tsx">/, () => {
    let code = `
      <ExampleComponent${index} />
      <pre><code className="language-tsx">
      `;
    index += 1;
    return code;
  });

  const bodys = parseTsxBlock(source);
  const mainAST = parse(
    `
  import HighlightCode from '@njt-tools-open/docs-utils/lib/highlight-code';
  import CodeExample from '@njt-tools-open/docs-utils/lib/code-example';

   function Md () {
     return <div className='b-md-container markdown-body c-html-render'>${mdToHtml}</div>;
   }

   export default Md;
 `,
    {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    }
  );
  const ast = {
    type: 'Program',
    body: [...bodys, ...mainAST.program.body],
  };
  return generate(ast).code;
};
