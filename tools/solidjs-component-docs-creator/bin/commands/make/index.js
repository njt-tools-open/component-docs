"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = require("path");
var fs_1 = require("fs");
var parser_1 = require("@babel/parser");
var template_1 = __importDefault(require("@babel/template"));
var traverse_1 = __importDefault(require("@babel/traverse"));
var generator_1 = __importDefault(require("@babel/generator"));
var utils_1 = require("./../../utils");
var code_generator_1 = require("../../utils/code-generator");
var types = require('@babel/types');
var resourcesFolder = (0, path_1.join)(__dirname, '../../../resources');
var formatDeclaration = function (str) {
    return "Page".concat(str
        .replace(/[^\w]/g, '')
        .replace(/^\w/, function (o) { return o.toUpperCase(); }));
};
// 生成目标文件
function generateTargetFile(filePath, context) {
    var folder = (0, path_1.resolve)('./.s25c');
    if (!(0, utils_1.isFolder)(folder)) {
        (0, fs_1.mkdirSync)(folder);
    }
    (0, fs_1.writeFileSync)((0, path_1.join)(folder, filePath), context, { encoding: 'utf8' });
}
// 转换 routes.tsx 文件
var transformRoutes = function (_a) {
    var filename = _a.filename, content = _a.content;
    var CONFIG = (0, utils_1.getConfig)();
    var lastImportIndex = -1;
    var ast = (0, parser_1.parse)(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });
    ast.program.body.forEach(function (node, index) {
        if (node.type === 'ImportDeclaration') {
            lastImportIndex = index;
        }
    });
    // 收集路由
    var pages = [];
    CONFIG.routes.forEach(function (root) {
        var _a;
        var page = __assign(__assign({}, root), { name: root.name, path: root.path, children: [] });
        ((_a = root.children) !== null && _a !== void 0 ? _a : []).forEach(function (route) {
            lastImportIndex += 1;
            var declarationName = formatDeclaration(route.name);
            var declaration = "import ".concat(declarationName, " from '../").concat(route.page, "'");
            var declarationAst = template_1["default"].ast(declaration);
            ast.program.body.splice(lastImportIndex, 0, declarationAst);
            page.children.push({
                name: route.name,
                path: route.path,
                component: declarationName
            });
        });
        pages.push(page);
    });
    (0, traverse_1["default"])(ast, {
        enter: function (path) {
            var _a;
            // 补充用户自定义 routes
            if (path.isVariableDeclarator() && path.node.id.name === 'routes') {
                var nodes_1 = [];
                pages.forEach(function (page) {
                    var node = types.objectExpression([
                        types.objectProperty(types.identifier('name'), types.stringLiteral(page.name)),
                        types.objectProperty(types.identifier('path'), types.stringLiteral(page.path)),
                        types.objectProperty(types.identifier('children'), types.arrayExpression(page.children.map(function (item) {
                            return types.objectExpression([
                                types.objectProperty(types.identifier('name'), types.stringLiteral(item.name)),
                                types.objectProperty(types.identifier('path'), types.stringLiteral(item.path)),
                                types.objectProperty(types.identifier('component'), types.identifier(item.component)),
                            ]);
                        }))),
                    ]);
                    nodes_1.push(node);
                });
                (_a = path.node.init.elements).unshift.apply(_a, nodes_1);
            }
        }
    });
    var output = (0, generator_1["default"])(ast).code;
    generateTargetFile(filename, output);
};
var transformOnlyCopy = function (_a) {
    var filename = _a.filename, content = _a.content;
    generateTargetFile(filename, content);
};
var resources = [
    {
        filename: 'routes.tsx',
        transform: transformRoutes
    },
    {
        filename: 'main.css',
        transform: transformOnlyCopy
    },
    {
        filename: 'main.tsx',
        transform: transformOnlyCopy
    },
    {
        filename: 'nav.tsx',
        transform: transformOnlyCopy
    },
    {
        filename: 'routes.tsx',
        transform: transformOnlyCopy
    },
    {
        filename: 'sidebar.tsx',
        transform: transformOnlyCopy
    },
];
function make() {
    (0, code_generator_1.generateCodeFiles)();
}
exports["default"] = make;
