# @njt-tools-open/solidjs-component-markdown-loader

<br>

<a title="loader Downloads">
  <img src="https://img.shields.io/npm/dm/%40njt-tools-open%2Fsolidjs-component-markdown-loader" alt="Downloads per Month"/>
</a>

<a title="loader Downloads">
  <img src="https://img.shields.io/npm/dy/%40njt-tools-open%2Fsolidjs-component-markdown-loader" alt="Downloads per Year"/>
</a>

<a href="https://badge.fury.io/js/%40njt-tools-open%2Fsolidjs-component-markdown-loader" title="NPM Version Badge">
   <img src="https://img.shields.io/npm/v/%40njt-tools-open%2Fsolidjs-component-markdown-loader.svg?sanitize=true" alt="version">
</a>

<br>

## Usage

### Install

```sh

npm install @njt-tools-open/solidjs-component-markdown-loader -D
# or
pnpm install @njt-tools-open/solidjs-component-markdown-loader -D
# or
yarn install @njt-tools-open/solidjs-component-markdown-loader -D
```

### Webpack config

```ts
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              presets: [
                '@babel/preset-env',
                'babel-preset-solid',
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
              ],
            },
          },
          '@njt-tools-open/solidjs-component-markdown-loader',
        ],
      },
    ],
  },
};
```
