const MarkdownIt = require('markdown-it');
const path = require('path');

const { generateModuleName, writeCacheFile } = require('./utils');

function parseTsxBlock(cacheFolder, source) {
  const files = {};
  let index = 0;

  const md = new MarkdownIt({
    html: true,
    breaks: true,
    typographer: true,
    highlight(str, lang) {
      if (lang === 'tsx') {
        const filename = `${generateModuleName(index)}`;
        files[filename] = str;
        index += 1;
      }
      return '';
    },
  });
  md.render(source);

  let declarations = '';
  let filepath = '';

  for (let key in files) {
    filepath = path.join(cacheFolder, `${key}.tsx`);
    writeCacheFile(filepath, files[key]);
    declarations += `\nimport ${key} from '${filepath}';`;
  }

  return {
    declarations,
  };
}

module.exports = parseTsxBlock;
