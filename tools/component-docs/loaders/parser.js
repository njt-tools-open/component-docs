const MarkdownIt = require('markdown-it');
const babelParser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');

function parseTsxBlock(source) {
  const bodys = [];
  let index = 0;

  const md = new MarkdownIt({
    html: true,
    breaks: true,
    typographer: true,
    highlight(str, lang) {
      if (lang === 'tsx') {
        let ast = babelParser.parse(str, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        });
        traverse(ast, {
          enter(path) {
            // 提取引入
            if (path.isImportDeclaration()) {
              // ImportDeclarations.push(path.node);
            } else if (path.isExportDefaultDeclaration()) {
              path.node.type = 'VariableDeclaration';
              path.node.kind = 'const';

              const oldDeclaration = path.node.declaration;
              path.node.declarations = [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: `ExampleComponent${index}`,
                  },
                  init: oldDeclaration,
                },
              ];
            }
          },
        });
        bodys.push(...ast.program.body);
      }
      return '';
    },
  });
  md.render(source);

  return bodys;
}

module.exports = parseTsxBlock;
