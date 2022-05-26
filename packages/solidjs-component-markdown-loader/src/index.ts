import * as path from 'path';
import { readFileSync } from 'fs';
import MarkdownIt from 'markdown-it';

import parseTsxBlock from './file-parser';
import { generateModuleName, isFolder, mkdir } from './utils';

const cacheFolder = path.resolve('.s25c/markdown-files');

const createMdFolder = resourcePath => {
  return resourcePath
    .replace(process.cwd(), '')
    .replace(/[\/]/g, '-')
    .replace(/\.md$/, '');
};

function markdwonLoader(content) {
  if (!isFolder(cacheFolder)) {
    mkdir(cacheFolder);
  }
  // @ts-ignore
  const mdCacheFolder = path.join(cacheFolder, createMdFolder(this.resourcePath));
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
    .render(content)
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

  const { declarations } = parseTsxBlock(mdCacheFolder, content);

  const output = `
  import HighlightCode from '${path.resolve('.s25c/highlight-code.tsx')}';
  ${declarations}

   function Md () {
     return <div className='b-md-container markdown-body c-html-render'>${mdToHtml}</div>;
   }

   export default Md;
 `;
  return output;
}

module.exports = markdwonLoader;
