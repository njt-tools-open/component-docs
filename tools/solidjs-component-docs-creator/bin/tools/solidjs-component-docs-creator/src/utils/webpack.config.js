"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path = __importStar(require("path"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var md_loader_1 = require("./loaders/md-loader");
var getWebpackConfig = function (options) {
    var mode = options.mode, port = options.port, rewrites = options.rewrites;
    return {
        mode: mode,
        devServer: {
            port: port,
            compress: true,
            historyApiFallback: {
                rewrites: rewrites === null || rewrites === void 0 ? void 0 : rewrites.map(function (reg) { return ({ from: reg, to: '/index.html' }); })
            },
            static: {
                directory: path.join(__dirname, '../../public'),
                serveIndex: true,
                publicPath: '/'
            }
        },
        entry: {
            main: path.resolve('.s25c/main.tsx')
        },
        output: {
            filename: '[name].js',
            path: path.resolve('bundle')
        },
        optimization: {
            minimize: false
        },
        plugins: [
            new mini_css_extract_plugin_1["default"]({
                filename: '[name].css'
            }),
            new html_webpack_plugin_1["default"]({
                template: path.join(__dirname, '../../public/index.html'),
                publicPath: '/'
            }),
        ],
        performance: {
            maxEntrypointSize: 2000000,
            maxAssetSize: 2000000
        },
        resolve: {
            alias: {
                '@/*': path.resolve('./*')
            },
            extensions: ['.ts', '.js', '.mjs', '.tsx', '.jsx'],
            importsFields: ['browser', 'module', 'main']
        },
        module: {
            rules: [
                {
                    test: /\.md$/,
                    use: [require.resolve('babel-loader'), md_loader_1.mdLoader]
                },
                {
                    test: /\.(js|mjs|ts)$/,
                    loader: require.resolve('babel-loader'),
                    exclude: /node_modules/,
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: false
                    },
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(js|ts)x?$/,
                    // exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            presets: [
                                '@babel/preset-env',
                                'solid',
                                '@babel/preset-typescript',
                            ],
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread',
                            ]
                        }
                    },
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.css$/,
                    sideEffects: true,
                    use: [
                        mini_css_extract_plugin_1["default"].loader,
                        {
                            loader: require.resolve('css-loader')
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [require.resolve('postcss-preset-env')]
                                }
                            }
                        },
                    ]
                },
            ]
        }
    };
};
exports["default"] = getWebpackConfig;
