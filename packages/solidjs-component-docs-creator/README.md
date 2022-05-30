# @njt-tools-open/solidjs-component-docs-creator

<br>

<a title="creator Downloads">
  <img src="https://img.shields.io/npm/dm/%40njt-tools-open%2Fsolidjs-component-docs-creator" alt="Downloads per Month"/>
</a>

<a title="creator Downloads">
  <img src="https://img.shields.io/npm/dy/%40njt-tools-open%2Fsolidjs-component-docs-creator" alt="Downloads per Year"/>
</a>

<a href="https://badge.fury.io/js/%40njt-tools-open%2Fsolidjs-component-docs-creator" title="NPM Version Badge">
   <img src="https://img.shields.io/npm/v/%40njt-tools-open%2Fsolidjs-component-docs-creator.svg?sanitize=true" alt="version">
</a>

<br>

### Get Start

```sh
# pull document template
npx degit njt-tools-open/component-docs/templates/docs-example my_solidjs_component
# install dependencies
cd my_solidjs_component & npm install
# or
cd my_solidjs_component & pnpm install
# or
cd my_solidjs_component & yarn install

```

### config - s25c.toml

> At git repository, you should ignore folder ".s25c".

```toml
# document name
name = "Docs Example"
# development serve port
port = 3030

# document classify
[[routes]]
name = "Get Start"
path = "/get-start"

# document classify sub route
[[routes.children]]
name = "Introduction"
path = "/introduction"
# component description markdown file
page = "pages/get-start/introduction.md"
```

### development

```sh
# start document server
npm run serve
```

### production

```sh
# build assets for production
npm run serve
```
