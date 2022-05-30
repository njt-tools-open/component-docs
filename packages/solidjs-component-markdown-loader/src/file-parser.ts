import MarkdownIt from 'markdown-it';
import * as path from 'path';

const { generateModuleName, writeCacheFile } = require('./utils');

function parseTsxBlock(cacheFolder: string, source: string): string {
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

  for (const key in files) {
    if ({}.hasOwnProperty.call(files, key)) {
      filepath = path.join(cacheFolder, key);
      writeCacheFile(`${filepath}.tsx`, files[key]);
      declarations += `\nimport ${key} from '${filepath}';`;
    }
  }

  return declarations;
}

export default parseTsxBlock;
