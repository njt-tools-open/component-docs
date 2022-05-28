import { escapeHtml, unescapeAll } from 'markdown-it/lib/common/utils';

const wrapperCodeBlockPure = (arrs: string, highlighted: string) => `<pre>
  <code ${arrs}>
  ${highlighted}
  </code>
</pre>\n`;

const wrapperCodeBlockWithFold = (
  arrs: string,
  highlighted: string,
  content: string
) => `<HighlightCodeFold code={\`${content}\`}>
  <pre>
    <code ${arrs}>
    ${highlighted}
    </code>
  </pre>
</HighlightCodeFold>\n`;

const wrapperCodeBlock = (
  lang: string,
  arrs: string,
  highlighted: string,
  content: string
) =>
  lang === 'tsx'
    ? wrapperCodeBlockWithFold(arrs, highlighted, content)
    : wrapperCodeBlockPure(arrs, highlighted);

export const RuleFence = (
  tokens: Record<number, any>,
  idx: number,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  options: any,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _env: any,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  self: any
): any => {
  const token = tokens[idx];
  const info = token.info ? unescapeAll(token.info).trim() : '';
  let langName = '';
  let langAttrs = '';
  let highlighted;
  let i;
  let arr;
  let tmpAttrs;
  let tmpToken;

  if (info) {
    arr = info.split(/(\s+)/g);
    langName = arr[0] ?? '';
    langAttrs = arr.slice(2).join('');
  }

  if (options.highlight) {
    highlighted =
      options.highlight(token.content, langName, langAttrs) ||
      escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return `${highlighted}\n`;
  }

  if (info) {
    i = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push(['class', options.langPrefix + langName]);
    } else {
      tmpAttrs[i] = tmpAttrs[i].slice();
      tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`;
    }

    tmpToken = {
      attrs: tmpAttrs,
    };

    return wrapperCodeBlock(
      langName,
      self.renderAttrs(tmpToken),
      highlighted,
      token.content
    );
  }
  return wrapperCodeBlock(
    langName,
    self.renderAttrs(token),
    highlighted,
    token.content
  );
};
