import { join, resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parse } from '@babel/parser';
import template from '@babel/template';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { getConfig, isFolder } from './../../utils';
import { generateCodeFiles } from '../../utils/code-generator';

const types = require('@babel/types');

type Transform = (options: { filename: string; content: string }) => void;

const resourcesFolder = join(__dirname, '../../../resources');

const formatDeclaration = (str: string) => {
  return `Page${str
    .replace(/[^\w]/g, '')
    .replace(/^\w/, o => o.toUpperCase())}`;
};

// 生成目标文件
function generateTargetFile(filePath: string, context: string) {
  const folder = resolve('./.s25c');
  if (!isFolder(folder)) {
    mkdirSync(folder);
  }
  writeFileSync(join(folder, filePath), context, { encoding: 'utf8' });
}

// 转换 routes.tsx 文件
const transformRoutes: Transform = ({ filename, content }) => {
  const CONFIG = getConfig();
  let lastImportIndex = -1;

  let ast = parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  ast.program.body.forEach((node, index) => {
    if (node.type === 'ImportDeclaration') {
      lastImportIndex = index;
    }
  });

  // 收集路由
  const pages: Record<string, any>[] = [];

  CONFIG.routes.forEach(root => {
    let page: Record<string, any> = {
      ...root,
      name: root.name,
      path: root.path,
      children: [],
    };
    (root.children ?? []).forEach(route => {
      lastImportIndex += 1;
      const declarationName = formatDeclaration(route.name);
      const declaration = `import ${declarationName} from '../${route.page}'`;
      const declarationAst = template.ast(declaration);

      ast.program.body.splice(lastImportIndex, 0, declarationAst);

      page.children.push({
        name: route.name,
        path: route.path,
        component: declarationName,
      });
    });
    pages.push(page);
  });

  traverse(ast, {
    enter(path) {
      // 补充用户自定义 routes
      if (path.isVariableDeclarator() && path.node.id.name === 'routes') {
        const nodes: any = [];
        pages.forEach(page => {
          const node = types.objectExpression([
            types.objectProperty(
              types.identifier('name'),
              types.stringLiteral(page.name)
            ),
            types.objectProperty(
              types.identifier('path'),
              types.stringLiteral(page.path)
            ),
            types.objectProperty(
              types.identifier('children'),
              types.arrayExpression(
                page.children.map(item => {
                  return types.objectExpression([
                    types.objectProperty(
                      types.identifier('name'),
                      types.stringLiteral(item.name)
                    ),
                    types.objectProperty(
                      types.identifier('path'),
                      types.stringLiteral(item.path)
                    ),
                    types.objectProperty(
                      types.identifier('component'),
                      types.identifier(item.component)
                    ),
                  ]);
                })
              )
            ),
          ]);
          nodes.push(node);
        });
        path.node.init.elements.unshift(...nodes);
      }
    },
  });
  const output = generate(ast).code;
  generateTargetFile(filename, output);
};

const transformOnlyCopy: Transform = ({ filename, content }) => {
  generateTargetFile(filename, content);
};

const resources = [
  {
    filename: 'routes.tsx',
    transform: transformRoutes,
  },
  {
    filename: 'main.css',
    transform: transformOnlyCopy,
  },
  {
    filename: 'main.tsx',
    transform: transformOnlyCopy,
  },
  {
    filename: 'nav.tsx',
    transform: transformOnlyCopy,
  },
  {
    filename: 'routes.tsx',
    transform: transformOnlyCopy,
  },
  {
    filename: 'sidebar.tsx',
    transform: transformOnlyCopy,
  },
];

function make() {
  generateCodeFiles();
}

export default make;
