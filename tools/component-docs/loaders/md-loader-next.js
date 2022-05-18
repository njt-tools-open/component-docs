const path = require('path');
const MarkdownIt = require('markdown-it');

const parseTsxBlock = require('./file-parser');
const { generateModuleName, isFolder, mkdir } = require('./utils');

const cacheFolder = path.resolve('.md-cache');

const createMdFolder = resourcePath => {
  return resourcePath
    .replace(process.cwd(), '')
    .replace(/[\/]/g, '-')
    .replace(/\.md$/, '');
};

module.exports = function mdLoader(source) {
  if (!isFolder(cacheFolder)) {
    mkdir(cacheFolder);
  }
  const mdCacheFolder = path.join(
    cacheFolder,
    createMdFolder(this.resourcePath)
  );
  if (!isFolder(mdCacheFolder)) {
    mkdir(mdCacheFolder);
  }
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
  mdToHtml = mdToHtml.replace(/<pre><code className="language-tsx">/g, () => {
    let code = `
      <${generateModuleName(index)} />
      <pre><code className="language-tsx">
      `;
    index += 1;
    return code;
  });

  const { declarations } = parseTsxBlock(mdCacheFolder, source);

  return `
  import HighlightCode from '@njt-tools-open/docs-utils/lib/highlight-code';
  ${declarations}

   function Md () {
     return <div className='b-md-container markdown-body c-html-render'>${mdToHtml}</div>;
   }

   export default Md;
 `;
};
