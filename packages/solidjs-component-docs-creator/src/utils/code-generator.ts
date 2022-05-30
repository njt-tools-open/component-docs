import { join, resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parse } from '@babel/parser';
import template from '@babel/template';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { getConfig, isFolder } from './index';

const types = require('@babel/types');

type Transform = (options: { filename: string; content: string }) => void;

const resourcesFolder = join(__dirname, '../../resources');

const createObjectProperty = (key: string, value: any) =>
  types.objectProperty(types.identifier(key), value);

const formatDeclaration = (str: string) =>
  `Page${str.replace(/[^\w]/g, '').replace(/^\w/, o => o.toUpperCase())}`;

/** 生成目标文件 */
function generateTargetFile(filePath: string, context: string) {
  const folder = resolve('./.s25c');
  if (!isFolder(folder)) {
    mkdirSync(folder);
  }
  writeFileSync(join(folder, filePath), context, { encoding: 'utf8' });
}

/** 转换 routes.tsx 文件 */
const transformRoutesFile: Transform = ({ filename, content }) => {
  const CONFIG = getConfig();
  let lastImportIndex = -1;

  const ast = parse(content, {
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
    const page: Record<string, any> = {
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
            createObjectProperty('name', types.stringLiteral(page.name)),
            createObjectProperty('path', types.stringLiteral(page.path)),
            createObjectProperty(
              'children',
              types.arrayExpression(
                page.children.map(item =>
                  types.objectExpression([
                    createObjectProperty(
                      'name',
                      types.stringLiteral(item.name)
                    ),
                    createObjectProperty(
                      'path',
                      types.stringLiteral(item.path)
                    ),
                    createObjectProperty(
                      'component',
                      types.identifier(item.component)
                    ),
                  ])
                )
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

/** 仅复制 */
const transformOnlyCopy: Transform = ({ filename, content }) => {
  generateTargetFile(filename, content);
};

/** 转换 nav.tsx */
const transformNavFile: Transform = ({ filename, content }) => {
  const CONFIG = getConfig();

  const ast = parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  traverse(ast, {
    enter(path) {
      if (path.node.type === 'JSXText' && path.node.value === 'PROJECT_NAME') {
        // eslint-disable-next-line no-param-reassign
        path.node.value = CONFIG.name;
      }
    },
  });
  const output = generate(ast).code;
  generateTargetFile(filename, output);
};

const resources = [
  {
    filename: 'routes.tsx',
    transform: transformRoutesFile,
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
    transform: transformNavFile,
  },
  {
    filename: 'sidebar.tsx',
    transform: transformOnlyCopy,
  },
  {
    filename: 'highlight-code.tsx',
    transform: transformOnlyCopy,
  },
  {
    filename: 'highlight-code-fold.tsx',
    transform: transformOnlyCopy,
  },
];

export function generateCodeFiles(): void {
  resources.forEach(({ filename, transform }) => {
    const filePath = join(resourcesFolder, filename);
    const content = readFileSync(filePath, { encoding: 'utf8' });
    transform({ filename, content });
  });
}
