const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssRegex = /\.css$/;

module.exports = {
  mode: 'development',
  devServer: {
    port: '13030',
    compress: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/get-start/, to: '/index.html' }],
      rewrites: [{ from: /^\/component/, to: '/index.html' }],
    },
    static: {
      directory: path.resolve('public'),
      serveIndex: true,
      publicPath: '/',
    },
  },
  entry: {
    main: path.resolve('src/main.tsx'),
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
      template: path.resolve('public/index.html'),
      publicPath: '/',
    }),
  ],
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
  },
  resolve: {
    alias: {
      '@/*': 'src/*',
    },
    extensions: ['.ts', '.js', '.mjs', '.tsx', '.jsx'],
    importsFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ['babel-loader', path.resolve('./loaders/md-loader-next.js')],
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
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)x?$/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env', 'solid', '@babel/preset-typescript'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: cssRegex,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
          },
          {
            loader: 'postcss-loader',
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
