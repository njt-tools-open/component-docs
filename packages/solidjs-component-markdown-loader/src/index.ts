import * as path from 'path';
import MarkdownIt from 'markdown-it';

import parseTsxBlock from './file-parser';
import { RuleFence } from './rule-fence';
import { generateModuleName, isFolder, mkdir } from './utils';

const cacheFolder = path.resolve('.s25c/markdown-files');

const createMdFolder = resourcePath =>
  resourcePath
    .replace(process.cwd(), '')
    .replace(/[/]/g, '-')
    .replace(/\.md$/, '');

function markdwonLoader(content) {
  if (!isFolder(cacheFolder)) {
    mkdir(cacheFolder);
  }
  const mdCacheFolder = path.join(
    cacheFolder,
    // @ts-ignore
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

  md.renderer.rules.fence = RuleFence;

  md.renderer.rules.table_open = () => '<table class="table table-striped">\n';

  let mdToHtml = md
    .render(content)
    .replace(/<hr>/g, '<hr />')
    .replace(/<br>/g, '<br />')
    .replace(/class=/g, 'className=');

  let moduleIndex = 0;
  mdToHtml = mdToHtml.replace(/<HighlightCodeFold/g, () => {
    const code = `
      <div
        style={{
          padding: '16px',
          border: '1px solid #ccc',
          'margin-bottom': '10px',
          'border-radius': '4px'
        }}>
        <${generateModuleName(moduleIndex)} />
      </div>
      <HighlightCodeFold
      `;
    moduleIndex += 1;
    return code;
  });

  const declarations = parseTsxBlock(mdCacheFolder, content);

  const output = `
  import HighlightCode from '${path.resolve('.s25c/highlight-code.tsx')}';
  import HighlightCodeFold from '${path.resolve(
    '.s25c/highlight-code-fold.tsx'
  )}';
  ${declarations}

   function MarkdownComponent () {
     return <div className='b-md-container markdown-body c-html-render'>${mdToHtml}</div>;
   }

   export default MarkdownComponent;
 `;
  return output;
}

module.exports = markdwonLoader;
