import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import ProgressPlugin from 'progress-bar-webpack-plugin';

const jsxLoaderOptions = {
  babelrc: false,
  configFile: false,
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('babel-preset-solid'),
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
  ],
};

type GetWebpackConfigOptions = {
  mode: 'development' | 'production';
  port?: number;
  rewrites?: RegExp[];
};

const getWebpackConfig = (options: GetWebpackConfigOptions): any => {
  const { mode, port, rewrites } = options;
  return {
    mode,
    devServer: {
      port,
      compress: true,
      historyApiFallback: {
        rewrites: rewrites?.map(reg => ({ from: reg, to: '/index.html' })),
      },
      static: {
        directory: path.join(__dirname, '../../public'),
        serveIndex: true,
        publicPath: '/',
      },
    },
    entry: {
      main: path.resolve('.s25c/main.tsx'),
    },
    output: {
      filename: '[name].js',
      path: path.resolve('bundle'),
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../../public/index.html'),
        publicPath: '/',
      }),
      new ProgressPlugin(true),
    ],
    performance: {
      maxEntrypointSize: 2000000,
      maxAssetSize: 2000000,
    },
    resolve: {
      // alias: {
      //   '@/*': path.resolve('./*'),
      // },
      extensions: ['.ts', '.js', '.mjs', '.tsx', '.jsx'],
      importsFields: ['browser', 'module', 'main'],
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: jsxLoaderOptions,
            },
            require.resolve(
              '@njt-tools-open/solidjs-component-markdown-loader'
            ),
          ],
        },
        {
          test: /\.(js|mjs|ts)$/,
          loader: require.resolve('babel-loader'),
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: false,
          },
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.ts?$/,
          use: require.resolve('ts-loader'),
          exclude: /node_modules/,
        },
        {
          test: /\.(js|ts)x$/,
          // exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: jsxLoaderOptions,
          },
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.css$/,
          sideEffects: true,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [require.resolve('postcss-preset-env')],
                },
              },
            },
          ],
        },
      ],
    },
  };
};

export default getWebpackConfig;
